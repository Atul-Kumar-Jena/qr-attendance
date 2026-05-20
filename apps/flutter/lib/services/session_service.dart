import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../models/class_model.dart';
import '../models/session_model.dart';
import '../models/user_model.dart';

// ── CreateSessionParams ────────────────────────────────────────────────────

/// Value object that bundles all parameters for [SessionService.createSession].
class CreateSessionParams {
  const CreateSessionParams({
    required this.classId,
    required this.className,
    required this.institutionId,
    required this.createdBy,
    required this.createdByName,
    required this.scheduledStart,
    this.location,
    this.locationRadiusMeters = 100,
    this.requireLocation = false,
    this.qrRotateSeconds = 30,
    this.notes,
  });

  final String classId;
  final String className;
  final String institutionId;
  final String createdBy;
  final String createdByName;
  final DateTime scheduledStart;
  final LatLng? location;
  final double locationRadiusMeters;
  final bool requireLocation;
  final int qrRotateSeconds;
  final String? notes;
}

// ── SessionService ─────────────────────────────────────────────────────────

/// Manages the lifecycle of attendance sessions and exposes real-time streams.
///
/// Firestore layout:
///   sessions/{sessionId}                     — [AttendanceSession] document
///   sessions/{sessionId}/attendance/{uid}    — [AttendanceRecord] per student
///   sessions/{sessionId}/scanAttempts/{id}   — [ScanAttempt] immutable log
class SessionService {
  SessionService({
    FirebaseFirestore? firestore,
    FirebaseAuth? auth,
  })  : _firestore = firestore ?? FirebaseFirestore.instance,
        _auth = auth ?? FirebaseAuth.instance;

  final FirebaseFirestore _firestore;
  final FirebaseAuth _auth;

  // ── Stream: single session ─────────────────────────────────────────────────

  /// Real-time stream for a single session document.
  Stream<AttendanceSession?> sessionStream(String sessionId) {
    return _firestore
        .collection('sessions')
        .doc(sessionId)
        .withConverter<AttendanceSession?>(
          fromFirestore: (snap, _) =>
              snap.exists ? AttendanceSession.fromSnapshot(snap) : null,
          toFirestore: (session, _) => session?.toMap() ?? {},
        )
        .snapshots()
        .map((snap) => snap.data());
  }

  // ── Stream: live sessions for an institution ───────────────────────────────

  /// Real-time list of all currently-live sessions for [institutionId].
  Stream<List<AttendanceSession>> liveSessionsStream(String institutionId) {
    return _firestore
        .collection('sessions')
        .where('institutionId', isEqualTo: institutionId)
        .where('status', isEqualTo: SessionStatus.live.name)
        .orderBy('liveStart', descending: true)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => AttendanceSession.fromMap(d.id, d.data()))
            .toList());
  }

  // ── Stream: sessions for a teacher ────────────────────────────────────────

  /// Real-time list of sessions created by [teacherUid], most recent first.
  /// [limit] caps the number of results for pagination.
  Stream<List<AttendanceSession>> teacherSessionsStream(
    String teacherUid, {
    int limit = 50,
  }) {
    return _firestore
        .collection('sessions')
        .where('createdBy', isEqualTo: teacherUid)
        .orderBy('scheduledStart', descending: true)
        .limit(limit)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => AttendanceSession.fromMap(d.id, d.data()))
            .toList());
  }

  // ── Stream: sessions for a class ──────────────────────────────────────────

  Stream<List<AttendanceSession>> classSessionsStream(
    String classId, {
    int limit = 100,
  }) {
    return _firestore
        .collection('sessions')
        .where('classId', isEqualTo: classId)
        .orderBy('scheduledStart', descending: true)
        .limit(limit)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => AttendanceSession.fromMap(d.id, d.data()))
            .toList());
  }

  // ── Stream: attendance roll for a session ──────────────────────────────────

  /// Real-time attendance roll for a session — used on the teacher's live
  /// dashboard to see who has marked attendance.
  Stream<List<AttendanceRecord>> attendanceRollStream(String sessionId) {
    return _firestore
        .collection('sessions')
        .doc(sessionId)
        .collection('attendance')
        .orderBy('markedAt', descending: false)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => AttendanceRecord.fromMap(d.id, d.data()))
            .toList());
  }

  // ── Create session ─────────────────────────────────────────────────────────

  /// Creates a new session in [SessionStatus.scheduled] state and returns
  /// its Firestore document ID.
  Future<String> createSession(CreateSessionParams params) async {
    final ref = _firestore.collection('sessions').doc();

    final session = AttendanceSession(
      id: ref.id,
      classId: params.classId,
      className: params.className,
      institutionId: params.institutionId,
      createdBy: params.createdBy,
      createdByName: params.createdByName,
      status: SessionStatus.scheduled,
      scheduledStart: params.scheduledStart,
      location: params.location,
      locationRadiusMeters: params.locationRadiusMeters,
      requireLocation: params.requireLocation,
      qrRotateSeconds: params.qrRotateSeconds,
      notes: params.notes,
    );

    await ref.set(session.toMap());
    return ref.id;
  }

  // ── Start session (go live) ────────────────────────────────────────────────

  /// Transitions a session from [SessionStatus.scheduled] to
  /// [SessionStatus.live] and records the [liveStart] timestamp.
  ///
  /// Also queries the class roster to denormalise [totalEnrolled].
  Future<void> startSession(String sessionId, String classId) async {
    final batch = _firestore.batch();

    // Fetch enrolled student count from the class document
    final classSnap =
        await _firestore.collection('classes').doc(classId).get();
    final totalEnrolled = classSnap.data()?['studentCount'] as int? ?? 0;

    final sessionRef = _firestore.collection('sessions').doc(sessionId);
    batch.update(sessionRef, {
      'status': SessionStatus.live.name,
      'liveStart': FieldValue.serverTimestamp(),
      'totalEnrolled': totalEnrolled,
    });

    // Increment totalSessions counter on the class doc
    batch.update(
      _firestore.collection('classes').doc(classId),
      {'totalSessions': FieldValue.increment(1)},
    );

    await batch.commit();
  }

  // ── End session ────────────────────────────────────────────────────────────

  /// Transitions a session to [SessionStatus.ended].
  /// Any students not yet marked are implicitly absent (computed server-side).
  Future<void> endSession(String sessionId) async {
    await _firestore.collection('sessions').doc(sessionId).update({
      'status': SessionStatus.ended.name,
      'endedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── Cancel session ─────────────────────────────────────────────────────────

  Future<void> cancelSession(String sessionId) async {
    await _firestore.collection('sessions').doc(sessionId).update({
      'status': SessionStatus.cancelled.name,
      'endedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── QR nonce rotation ──────────────────────────────────────────────────────

  /// Rotates the QR nonce for an active session.
  ///
  /// In production this is called by a server-side Cloud Scheduler function;
  /// this client-side path is provided as a fallback for offline scenarios
  /// where the teacher can manually trigger rotation.
  Future<void> rotateNonce({
    required String sessionId,
    required String nonce,
    required DateTime expiresAt,
  }) async {
    await _firestore.collection('sessions').doc(sessionId).update({
      'currentNonce': nonce,
      'nonceExpiresAt': Timestamp.fromDate(expiresAt),
    });
  }

  // ── Fetch helpers ──────────────────────────────────────────────────────────

  /// Fetches a single [AttendanceSession] document by ID.
  Future<AttendanceSession?> fetchSession(String sessionId) async {
    final snap =
        await _firestore.collection('sessions').doc(sessionId).get();
    if (!snap.exists || snap.data() == null) return null;
    return AttendanceSession.fromSnapshot(snap);
  }

  /// Returns all sessions for [classId] that [studentId] marked present or
  /// late, useful for building a student's per-class attendance history.
  Future<List<AttendanceRecord>> studentClassHistory({
    required String studentId,
    required String classId,
  }) async {
    final snap = await _firestore
        .collectionGroup('attendance')
        .where('studentId', isEqualTo: studentId)
        .where('classId', isEqualTo: classId)
        .orderBy('markedAt', descending: true)
        .get();

    return snap.docs
        .map((d) => AttendanceRecord.fromMap(d.id, d.data()))
        .toList();
  }

  // ── WebSocket / long-poll simulation ──────────────────────────────────────

  /// Opens a timer-based subscription that fires [onTick] every
  /// [interval] for as long as the session is live.
  ///
  /// This is intentionally thin — real-time updates are driven by the
  /// Firestore [sessionStream]. This helper is used for QR countdown
  /// animations and local nonce expiry warnings.
  StreamSubscription<void> subscribeSessionTick({
    required String sessionId,
    required Duration interval,
    required void Function(Duration elapsed) onTick,
    required void Function() onExpired,
  }) {
    final start = DateTime.now();
    final controller = StreamController<void>.broadcast();

    final timer = Timer.periodic(interval, (t) {
      final elapsed = DateTime.now().difference(start);
      // Expire the ticker after 4 hours (max session length)
      if (elapsed.inHours >= 4) {
        t.cancel();
        controller.close();
        onExpired();
        return;
      }
      if (!controller.isClosed) {
        controller.add(null);
      }
    });

    final sub = controller.stream.listen((_) {
      onTick(DateTime.now().difference(start));
    });

    // Cancel the underlying timer when the subscription is cancelled
    sub.onCancel = () {
      timer.cancel();
      if (!controller.isClosed) controller.close();
    };

    return sub;
  }
}
