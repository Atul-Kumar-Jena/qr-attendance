import 'dart:async';

import 'package:flutter/foundation.dart';

import '../models/session_model.dart';
import '../services/session_service.dart';

// ── SessionProviderState ───────────────────────────────────────────────────

enum SessionProviderState {
  idle,
  loading,
  ready,
  error,
}

// ── SessionProvider ────────────────────────────────────────────────────────

/// Manages the state of the currently-watched attendance session and exposes
/// live attendance data to the widget tree.
///
/// The provider holds at most one active session at a time. Call
/// [watchSession] to subscribe to real-time updates from Firestore, or
/// [createAndStartSession] to create a new session and immediately watch it.
///
/// Clear the state with [clearSession] when navigating away.
class SessionProvider extends ChangeNotifier {
  SessionProvider({SessionService? service})
      : _service = service ?? SessionService();

  final SessionService _service;

  SessionProviderState _state = SessionProviderState.idle;
  AttendanceSession? _session;
  List<AttendanceRecord> _attendanceRoll = [];
  List<ScanAttempt> _recentScans = [];
  String? _error;

  StreamSubscription<AttendanceSession?>? _sessionSub;
  StreamSubscription<List<AttendanceRecord>>? _rollSub;
  StreamSubscription<void>? _tickSub;

  // ── Public state ───────────────────────────────────────────────────────────

  SessionProviderState get state => _state;
  AttendanceSession? get session => _session;
  List<AttendanceRecord> get attendanceRoll => _attendanceRoll;
  List<ScanAttempt> get recentScans => _recentScans;
  String? get error => _error;

  bool get isLoading => _state == SessionProviderState.loading;
  bool get hasSession => _session != null;
  bool get isLive => _session?.status == SessionStatus.live;
  bool get isEnded => _session?.status == SessionStatus.ended;

  /// How many students have been marked (present + late).
  int get markedCount => _session?.markedCount ?? 0;

  /// How many students are enrolled in the session.
  int get totalEnrolled => _session?.totalEnrolled ?? 0;

  /// Attendance rate [0.0, 1.0].
  double get attendanceRate => _session?.attendanceRate ?? 0.0;

  // ── Watch an existing session ─────────────────────────────────────────────

  /// Subscribes to real-time updates for [sessionId].
  ///
  /// This replaces any previously-watched session.
  void watchSession(String sessionId) {
    _cancelSubscriptions();
    _state = SessionProviderState.loading;
    _error = null;
    notifyListeners();

    _sessionSub = _service.sessionStream(sessionId).listen(
      (session) {
        _session = session;
        _state = session != null
            ? SessionProviderState.ready
            : SessionProviderState.error;
        _error = session == null ? 'Session not found.' : null;
        notifyListeners();
      },
      onError: (Object e) {
        _state = SessionProviderState.error;
        _error = e.toString();
        notifyListeners();
      },
    );

    _rollSub = _service.attendanceRollStream(sessionId).listen(
      (records) {
        _attendanceRoll = records;
        notifyListeners();
      },
      onError: (_) {}, // Non-fatal; session state still updates
    );
  }

  // ── Create and start a session ────────────────────────────────────────────

  /// Creates a new [AttendanceSession] and immediately watches it.
  ///
  /// Returns the new session ID on success, or null on error.
  Future<String?> createAndStartSession(CreateSessionParams params) async {
    _state = SessionProviderState.loading;
    _error = null;
    notifyListeners();

    try {
      final sessionId = await _service.createSession(params);
      await _service.startSession(sessionId, params.classId);
      watchSession(sessionId);
      return sessionId;
    } catch (e) {
      _state = SessionProviderState.error;
      _error = e.toString();
      notifyListeners();
      return null;
    }
  }

  // ── Session lifecycle ─────────────────────────────────────────────────────

  /// Ends the currently-watched session.
  Future<void> endSession() async {
    final currentSession = _session;
    if (currentSession == null) return;
    try {
      await _service.endSession(currentSession.id);
      // Firestore stream will fire and update _session automatically
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Cancels the currently-watched session.
  Future<void> cancelSession() async {
    final currentSession = _session;
    if (currentSession == null) return;
    try {
      await _service.cancelSession(currentSession.id);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Rotates the QR nonce for the active session.
  Future<void> rotateNonce({
    required String nonce,
    required DateTime expiresAt,
  }) async {
    final currentSession = _session;
    if (currentSession == null) return;
    try {
      await _service.rotateNonce(
        sessionId: currentSession.id,
        nonce: nonce,
        expiresAt: expiresAt,
      );
    } catch (_) {
      // Nonce rotation is best-effort; server-side Cloud Scheduler handles it
    }
  }

  // ── Scan activity ─────────────────────────────────────────────────────────

  /// Appends a scan result to the local [recentScans] list for immediate
  /// UI feedback before the Firestore write propagates.
  ///
  /// Real persistence happens server-side; this is display-only.
  void appendLocalScan(ScanAttempt attempt) {
    _recentScans = [attempt, ..._recentScans];
    if (_recentScans.length > 50) {
      _recentScans = _recentScans.sublist(0, 50);
    }
    notifyListeners();
  }

  // ── Attendance roll helpers ────────────────────────────────────────────────

  /// Returns the [AttendanceRecord] for [studentId], or null if not yet marked.
  AttendanceRecord? recordFor(String studentId) {
    try {
      return _attendanceRoll
          .firstWhere((r) => r.studentId == studentId);
    } catch (_) {
      return null;
    }
  }

  /// Returns all records with status [AttendanceStatus.present] or
  /// [AttendanceStatus.late] — the "marked as attended" list.
  List<AttendanceRecord> get attendedRecords => _attendanceRoll
      .where((r) =>
          r.status == AttendanceStatus.present ||
          r.status == AttendanceStatus.late)
      .toList();

  // ── Clear state ────────────────────────────────────────────────────────────

  /// Cancels all subscriptions and resets provider state.
  void clearSession() {
    _cancelSubscriptions();
    _session = null;
    _attendanceRoll = const [];
    _recentScans = const [];
    _state = SessionProviderState.idle;
    _error = null;
    notifyListeners();
  }

  void clearError() {
    if (_error != null) {
      _error = null;
      notifyListeners();
    }
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  void _cancelSubscriptions() {
    _sessionSub?.cancel();
    _rollSub?.cancel();
    _tickSub?.cancel();
    _sessionSub = null;
    _rollSub = null;
    _tickSub = null;
  }

  @override
  void dispose() {
    _cancelSubscriptions();
    super.dispose();
  }
}
