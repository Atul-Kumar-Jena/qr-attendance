import 'dart:async';
import 'dart:convert';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

import '../models/session_model.dart';
import '../models/user_model.dart';

// ── ScanVerificationResult ─────────────────────────────────────────────────

/// Typed result returned by [AttendanceService.submitScan].
class ScanVerificationResult {
  const ScanVerificationResult.accepted({
    required this.sessionId,
    required this.className,
    required this.attendancePercent,
  })  : scanResult = ScanResult.accepted,
        rejectionReason = null;

  const ScanVerificationResult.rejected({
    required this.scanResult,
    required this.rejectionReason,
    this.sessionId,
    this.className,
    this.attendancePercent,
  });

  final ScanResult scanResult;
  final String? sessionId;
  final String? className;
  final String? attendancePercent;
  final String? rejectionReason;

  bool get isAccepted => scanResult == ScanResult.accepted;
}

// ── AttendanceService ──────────────────────────────────────────────────────

/// Handles QR scan submission, attendance record queries, and manual overrides.
///
/// Security model:
///   1. The raw QR payload contains a signed [QrToken] (sessionId + nonce +
///      HMAC signature).
///   2. This service forwards the token to the server-side Cloud Function for
///      signature validation, nonce replay-prevention, device binding, and
///      geofence verification.
///   3. All scan attempts (accepted and rejected) are persisted via Firestore,
///      indexed by both session and student for the audit trail.
class AttendanceService {
  AttendanceService({
    FirebaseFirestore? firestore,
    FirebaseAuth? auth,
    http.Client? httpClient,
    String? apiBase,
  })  : _firestore = firestore ?? FirebaseFirestore.instance,
        _auth = auth ?? FirebaseAuth.instance,
        _http = httpClient ?? http.Client(),
        _apiBase = apiBase ?? 'https://api.attendly.app/api/v1';

  final FirebaseFirestore _firestore;
  final FirebaseAuth _auth;
  final http.Client _http;
  final String _apiBase;

  // ── Scan submission ────────────────────────────────────────────────────────

  /// Submits a scanned QR [rawPayload] to the backend for verification.
  ///
  /// [rawPayload] is the raw string decoded from the QR image.
  /// [deviceId]   is the hardware ID of the student's registered device.
  /// [location]   is the GPS position at time of scan (optional).
  /// [accuracy]   is the GPS accuracy in metres.
  Future<ScanVerificationResult> submitScan({
    required String rawPayload,
    required String deviceId,
    LatLng? location,
    double accuracy = 0,
  }) async {
    final idToken = await _auth.currentUser?.getIdToken();
    if (idToken == null) {
      return const ScanVerificationResult.rejected(
        scanResult: ScanResult.rejected,
        rejectionReason: 'Not authenticated. Please sign in again.',
      );
    }

    // Attempt to parse the QR token locally first (fast-fail for expired QRs)
    QrToken? token;
    try {
      final decoded = jsonDecode(rawPayload) as Map<String, dynamic>;
      token = QrToken.fromJson(decoded);
      if (token.isExpired) {
        return const ScanVerificationResult.rejected(
          scanResult: ScanResult.expired,
          rejectionReason: 'QR code has expired. Wait for the teacher to '
              'generate a new one.',
        );
      }
    } catch (_) {
      return const ScanVerificationResult.rejected(
        scanResult: ScanResult.rejected,
        rejectionReason: 'Invalid QR code. This QR was not issued by Attendly.',
      );
    }

    try {
      final response = await _http
          .post(
            Uri.parse('$_apiBase/attendance/scan'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $idToken',
            },
            body: jsonEncode({
              'token': rawPayload,
              'deviceId': deviceId,
              if (location != null)
                'location': {
                  'lat': location.latitude,
                  'lng': location.longitude,
                  'accuracy': accuracy,
                },
              'scannedAt': DateTime.now().millisecondsSinceEpoch,
            }),
          )
          .timeout(const Duration(seconds: 15));

      final body = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode == 200 && body['ok'] == true) {
        final data = body['data'] as Map<String, dynamic>? ?? {};
        return ScanVerificationResult.accepted(
          sessionId: data['sessionId'] as String? ?? token.sessionId,
          className: data['className'] as String? ?? '',
          attendancePercent: data['attendancePercent'] as String? ?? '—',
        );
      }

      final err = body['error'] as Map<String, dynamic>? ?? {};
      final code = err['code'] as String? ?? 'UNKNOWN';
      return ScanVerificationResult.rejected(
        scanResult: _mapErrorCode(code),
        rejectionReason: err['message'] as String? ?? 'Scan rejected.',
        sessionId: token.sessionId,
      );
    } on TimeoutException {
      return const ScanVerificationResult.rejected(
        scanResult: ScanResult.networkError,
        rejectionReason: 'Request timed out. Check your connection.',
      );
    } catch (_) {
      return const ScanVerificationResult.rejected(
        scanResult: ScanResult.networkError,
        rejectionReason: 'Could not reach server. Check your connection.',
      );
    }
  }

  // ── Attendance record streams ──────────────────────────────────────────────

  /// Live stream of all [AttendanceRecord]s for a given session.
  Stream<List<AttendanceRecord>> sessionAttendanceStream(String sessionId) {
    return _firestore
        .collection('sessions')
        .doc(sessionId)
        .collection('attendance')
        .orderBy('markedAt', descending: false)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) =>
                AttendanceRecord.fromMap(d.id, d.data()))
            .toList());
  }

  /// Live stream of attendance records for a single [studentId] across all
  /// sessions (uses collectionGroup query).
  Stream<List<AttendanceRecord>> studentHistoryStream(String studentId) {
    return _firestore
        .collectionGroup('attendance')
        .where('studentId', isEqualTo: studentId)
        .orderBy('markedAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) =>
                AttendanceRecord.fromMap(d.id, d.data()))
            .toList());
  }

  /// Live stream of scan attempts for the given session — used by the teacher
  /// security monitor.
  Stream<List<ScanAttempt>> scanAttemptsStream(String sessionId) {
    return _firestore
        .collection('sessions')
        .doc(sessionId)
        .collection('scanAttempts')
        .orderBy('scannedAt', descending: true)
        .limit(200)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => ScanAttempt.fromMap(d.id, d.data()))
            .toList());
  }

  /// Live stream of *rejected* scan attempts for the given session.
  Stream<List<ScanAttempt>> rejectedScansStream(String sessionId) {
    return _firestore
        .collection('sessions')
        .doc(sessionId)
        .collection('scanAttempts')
        .where('result', whereIn: [
          ScanResult.rejected.name,
          ScanResult.deviceMismatch.name,
          ScanResult.locationFail.name,
          ScanResult.duplicate.name,
        ])
        .orderBy('scannedAt', descending: true)
        .limit(100)
        .snapshots()
        .map((snap) => snap.docs
            .map((d) => ScanAttempt.fromMap(d.id, d.data()))
            .toList());
  }

  // ── Manual override ────────────────────────────────────────────────────────

  /// Manually sets the attendance status for [studentId] in [sessionId].
  ///
  /// Requires the caller to pass their [overriddenByUid] for the audit log.
  Future<void> manualOverride({
    required String sessionId,
    required String studentId,
    required AttendanceStatus newStatus,
    required String overriddenByUid,
    String? reason,
  }) async {
    final ref = _firestore
        .collection('sessions')
        .doc(sessionId)
        .collection('attendance')
        .doc(studentId);

    final existing = await ref.get();
    final now = DateTime.now();

    final record = AttendanceRecord(
      studentId: studentId,
      sessionId: sessionId,
      status: newStatus,
      markedAt: existing.exists
          ? (existing.data()!['markedAt'] as Timestamp).toDate()
          : now,
      manuallyOverriddenBy: overriddenByUid,
      overrideReason: reason,
    );

    await ref.set(record.toMap(), SetOptions(merge: true));

    // Update session-level denormalised counters via server-side logic;
    // here we trigger a lightweight re-count cloud function.
    await _firestore
        .collection('sessions')
        .doc(sessionId)
        .update({'_countersDirty': true});
  }

  // ── Aggregate helpers ──────────────────────────────────────────────────────

  /// Fetches the overall attendance rate [0.0, 1.0] for [studentId] across
  /// all sessions in [classId].
  Future<double> classAttendanceRate({
    required String studentId,
    required String classId,
  }) async {
    final totalSnap = await _firestore
        .collectionGroup('attendance')
        .where('studentId', isEqualTo: studentId)
        .where('classId', isEqualTo: classId)
        .count()
        .get();

    if ((totalSnap.count ?? 0) == 0) return 0.0;

    final presentSnap = await _firestore
        .collectionGroup('attendance')
        .where('studentId', isEqualTo: studentId)
        .where('classId', isEqualTo: classId)
        .where('status', whereIn: [
          AttendanceStatus.present.name,
          AttendanceStatus.late.name,
        ])
        .count()
        .get();

    return (presentSnap.count ?? 0) / totalSnap.count!;
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  ScanResult _mapErrorCode(String code) {
    switch (code) {
      case 'DUPLICATE_SCAN':
        return ScanResult.duplicate;
      case 'DEVICE_MISMATCH':
        return ScanResult.deviceMismatch;
      case 'LOCATION_FAIL':
        return ScanResult.locationFail;
      case 'TOKEN_EXPIRED':
        return ScanResult.expired;
      default:
        return ScanResult.rejected;
    }
  }
}
