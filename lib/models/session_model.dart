import 'package:cloud_firestore/cloud_firestore.dart';

// ── Enums ──────────────────────────────────────────────────────────────────

enum SessionStatus {
  scheduled,
  live,
  ended,
  cancelled;

  String get label {
    switch (this) {
      case SessionStatus.scheduled:
        return 'Scheduled';
      case SessionStatus.live:
        return 'Live';
      case SessionStatus.ended:
        return 'Ended';
      case SessionStatus.cancelled:
        return 'Cancelled';
    }
  }

  bool get isActive => this == SessionStatus.live;

  static SessionStatus fromString(String value) {
    return SessionStatus.values.firstWhere(
      (s) => s.name == value.toLowerCase(),
      orElse: () => SessionStatus.scheduled,
    );
  }
}

enum AttendanceStatus {
  present,
  late,
  absent,
  excused;

  String get label {
    switch (this) {
      case AttendanceStatus.present:
        return 'Present';
      case AttendanceStatus.late:
        return 'Late';
      case AttendanceStatus.absent:
        return 'Absent';
      case AttendanceStatus.excused:
        return 'Excused';
    }
  }

  static AttendanceStatus fromString(String value) {
    return AttendanceStatus.values.firstWhere(
      (s) => s.name == value.toLowerCase(),
      orElse: () => AttendanceStatus.absent,
    );
  }
}

enum ScanResult {
  accepted,
  rejected,
  duplicate,
  locationFail,
  deviceMismatch,
  expired,
  networkError;

  bool get isSuccess => this == ScanResult.accepted;

  String get label {
    switch (this) {
      case ScanResult.accepted:
        return 'Accepted';
      case ScanResult.rejected:
        return 'Rejected';
      case ScanResult.duplicate:
        return 'Duplicate';
      case ScanResult.locationFail:
        return 'Location Failed';
      case ScanResult.deviceMismatch:
        return 'Device Mismatch';
      case ScanResult.expired:
        return 'QR Expired';
      case ScanResult.networkError:
        return 'Network Error';
    }
  }

  static ScanResult fromString(String value) {
    return ScanResult.values.firstWhere(
      (s) => s.name == value,
      orElse: () => ScanResult.rejected,
    );
  }
}

// ── QrToken ────────────────────────────────────────────────────────────────

/// Represents one rotating QR code payload embedded in the scanned image.
class QrToken {
  const QrToken({
    required this.sessionId,
    required this.nonce,
    required this.issuedAt,
    required this.expiresAt,
    required this.signature,
  });

  final String sessionId;
  final String nonce;
  final DateTime issuedAt;
  final DateTime expiresAt;
  final String signature; // HMAC-SHA256 of sessionId+nonce+issuedAt

  bool get isExpired => DateTime.now().isAfter(expiresAt);

  factory QrToken.fromJson(Map<String, dynamic> json) {
    return QrToken(
      sessionId: json['sid'] as String,
      nonce: json['n'] as String,
      issuedAt: DateTime.fromMillisecondsSinceEpoch(json['iat'] as int),
      expiresAt: DateTime.fromMillisecondsSinceEpoch(json['exp'] as int),
      signature: json['sig'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'sid': sessionId,
      'n': nonce,
      'iat': issuedAt.millisecondsSinceEpoch,
      'exp': expiresAt.millisecondsSinceEpoch,
      'sig': signature,
    };
  }

  @override
  String toString() =>
      'QrToken(sessionId: $sessionId, nonce: $nonce, expired: $isExpired)';
}

// ── GeoPoint wrapper ───────────────────────────────────────────────────────

class LatLng {
  const LatLng(this.latitude, this.longitude);

  final double latitude;
  final double longitude;

  factory LatLng.fromMap(Map<String, dynamic> map) {
    return LatLng(
      (map['lat'] as num).toDouble(),
      (map['lng'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toMap() => {'lat': latitude, 'lng': longitude};

  /// Haversine distance in meters between [this] and [other].
  double distanceTo(LatLng other) {
    const r = 6371000.0; // Earth radius in metres
    final phi1 = latitude * 3.141592653589793 / 180;
    final phi2 = other.latitude * 3.141592653589793 / 180;
    final dphi = (other.latitude - latitude) * 3.141592653589793 / 180;
    final dlambda =
        (other.longitude - longitude) * 3.141592653589793 / 180;
    final a = _sin2(dphi / 2) +
        _cos(phi1) * _cos(phi2) * _sin2(dlambda / 2);
    final c = 2 * _atan2(_sqrt(a), _sqrt(1 - a));
    return r * c;
  }

  // Minimal trig helpers to avoid importing dart:math
  static double _sin2(double x) {
    final s = x - x * x * x / 6 + x * x * x * x * x / 120;
    return s * s;
  }

  static double _cos(double x) {
    return 1 - x * x / 2 + x * x * x * x / 24;
  }

  static double _sqrt(double x) {
    if (x <= 0) return 0;
    double guess = x / 2;
    for (int i = 0; i < 20; i++) {
      guess = (guess + x / guess) / 2;
    }
    return guess;
  }

  static double _atan2(double y, double x) {
    if (x > 0) return _atan(y / x);
    if (x < 0 && y >= 0) return _atan(y / x) + 3.141592653589793;
    if (x < 0 && y < 0) return _atan(y / x) - 3.141592653589793;
    if (x == 0 && y > 0) return 3.141592653589793 / 2;
    if (x == 0 && y < 0) return -3.141592653589793 / 2;
    return 0;
  }

  static double _atan(double x) {
    return x -
        x * x * x / 3 +
        x * x * x * x * x / 5 -
        x * x * x * x * x * x * x / 7;
  }

  @override
  String toString() =>
      'LatLng(${latitude.toStringAsFixed(6)}, ${longitude.toStringAsFixed(6)})';
}

// ── ScanAttempt ────────────────────────────────────────────────────────────

/// Immutable record of a single scan attempt — written regardless of outcome.
/// Stored under `sessions/{sessionId}/scanAttempts/{attemptId}`.
class ScanAttempt {
  const ScanAttempt({
    required this.id,
    required this.sessionId,
    required this.studentId,
    required this.studentName,
    required this.result,
    required this.scannedAt,
    this.deviceId,
    this.location,
    this.nonce,
    this.ipAddress,
    this.rejectionReason,
  });

  final String id;
  final String sessionId;
  final String studentId;
  final String studentName;
  final ScanResult result;
  final DateTime scannedAt;
  final String? deviceId;
  final LatLng? location;
  final String? nonce;
  final String? ipAddress;
  final String? rejectionReason;

  factory ScanAttempt.fromMap(String id, Map<String, dynamic> map) {
    return ScanAttempt(
      id: id,
      sessionId: map['sessionId'] as String,
      studentId: map['studentId'] as String,
      studentName: map['studentName'] as String? ?? '',
      result: ScanResult.fromString(map['result'] as String? ?? 'rejected'),
      scannedAt: (map['scannedAt'] as Timestamp).toDate(),
      deviceId: map['deviceId'] as String?,
      location: map['location'] != null
          ? LatLng.fromMap(map['location'] as Map<String, dynamic>)
          : null,
      nonce: map['nonce'] as String?,
      ipAddress: map['ipAddress'] as String?,
      rejectionReason: map['rejectionReason'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'sessionId': sessionId,
      'studentId': studentId,
      'studentName': studentName,
      'result': result.name,
      'scannedAt': Timestamp.fromDate(scannedAt),
      if (deviceId != null) 'deviceId': deviceId,
      if (location != null) 'location': location!.toMap(),
      if (nonce != null) 'nonce': nonce,
      if (ipAddress != null) 'ipAddress': ipAddress,
      if (rejectionReason != null) 'rejectionReason': rejectionReason,
    };
  }
}

// ── AttendanceRecord ───────────────────────────────────────────────────────

/// Final, resolved attendance record for one student in one session.
/// Stored under `sessions/{sessionId}/attendance/{studentId}`.
class AttendanceRecord {
  const AttendanceRecord({
    required this.studentId,
    required this.sessionId,
    required this.status,
    required this.markedAt,
    this.scanAttemptId,
    this.manuallyOverriddenBy,
    this.overrideReason,
    this.location,
  });

  final String studentId;
  final String sessionId;
  final AttendanceStatus status;
  final DateTime markedAt;

  /// Reference to the [ScanAttempt] that produced this record, if any.
  final String? scanAttemptId;

  /// UID of the teacher / admin who manually changed the status.
  final String? manuallyOverriddenBy;
  final String? overrideReason;
  final LatLng? location;

  bool get isManual => manuallyOverriddenBy != null;

  factory AttendanceRecord.fromMap(
      String studentId, Map<String, dynamic> map) {
    return AttendanceRecord(
      studentId: studentId,
      sessionId: map['sessionId'] as String,
      status:
          AttendanceStatus.fromString(map['status'] as String? ?? 'absent'),
      markedAt: (map['markedAt'] as Timestamp).toDate(),
      scanAttemptId: map['scanAttemptId'] as String?,
      manuallyOverriddenBy: map['manuallyOverriddenBy'] as String?,
      overrideReason: map['overrideReason'] as String?,
      location: map['location'] != null
          ? LatLng.fromMap(map['location'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'sessionId': sessionId,
      'status': status.name,
      'markedAt': Timestamp.fromDate(markedAt),
      if (scanAttemptId != null) 'scanAttemptId': scanAttemptId,
      if (manuallyOverriddenBy != null)
        'manuallyOverriddenBy': manuallyOverriddenBy,
      if (overrideReason != null) 'overrideReason': overrideReason,
      if (location != null) 'location': location!.toMap(),
    };
  }

  AttendanceRecord copyWith({
    String? studentId,
    String? sessionId,
    AttendanceStatus? status,
    DateTime? markedAt,
    String? scanAttemptId,
    String? manuallyOverriddenBy,
    String? overrideReason,
    LatLng? location,
  }) {
    return AttendanceRecord(
      studentId: studentId ?? this.studentId,
      sessionId: sessionId ?? this.sessionId,
      status: status ?? this.status,
      markedAt: markedAt ?? this.markedAt,
      scanAttemptId: scanAttemptId ?? this.scanAttemptId,
      manuallyOverriddenBy:
          manuallyOverriddenBy ?? this.manuallyOverriddenBy,
      overrideReason: overrideReason ?? this.overrideReason,
      location: location ?? this.location,
    );
  }
}

// ── AttendanceSession ──────────────────────────────────────────────────────

/// The main session document stored under `sessions/{sessionId}`.
class AttendanceSession {
  const AttendanceSession({
    required this.id,
    required this.classId,
    required this.className,
    required this.institutionId,
    required this.createdBy,
    required this.createdByName,
    required this.status,
    required this.scheduledStart,
    this.liveStart,
    this.endedAt,
    this.location,
    this.locationRadiusMeters = 100,
    this.requireLocation = false,
    this.qrRotateSeconds = 30,
    this.totalEnrolled = 0,
    this.presentCount = 0,
    this.lateCount = 0,
    this.absentCount = 0,
    this.currentNonce,
    this.nonceExpiresAt,
    this.notes,
  });

  final String id;
  final String classId;
  final String className;
  final String institutionId;
  final String createdBy; // UID of teacher
  final String createdByName;
  final SessionStatus status;
  final DateTime scheduledStart;
  final DateTime? liveStart;
  final DateTime? endedAt;

  /// Optional anchor location for geofencing.
  final LatLng? location;
  final double locationRadiusMeters;
  final bool requireLocation;

  /// How often the QR code rotates (seconds).
  final int qrRotateSeconds;

  // ── Live counters (denormalised for speed) ─────────────────────────────
  final int totalEnrolled;
  final int presentCount;
  final int lateCount;
  final int absentCount;

  // ── Current rotating token ─────────────────────────────────────────────
  final String? currentNonce;
  final DateTime? nonceExpiresAt;

  final String? notes;

  // ── Derived ────────────────────────────────────────────────────────────────

  int get markedCount => presentCount + lateCount;
  int get remainingCount => totalEnrolled - markedCount - absentCount;

  double get attendanceRate =>
      totalEnrolled == 0 ? 0.0 : markedCount / totalEnrolled;

  /// Returns a percentage string like "87%"
  String get attendancePercent =>
      '${(attendanceRate * 100).round()}%';

  /// Severity level for UI colour coding.
  AttendanceSeverity get severity {
    final rate = attendanceRate;
    if (rate >= 0.75) return AttendanceSeverity.good;
    if (rate >= 0.50) return AttendanceSeverity.warning;
    return AttendanceSeverity.critical;
  }

  Duration? get duration {
    if (liveStart == null) return null;
    final end = endedAt ?? DateTime.now();
    return end.difference(liveStart!);
  }

  // ── Serialisation ─────────────────────────────────────────────────────────

  factory AttendanceSession.fromMap(String id, Map<String, dynamic> map) {
    return AttendanceSession(
      id: id,
      classId: map['classId'] as String,
      className: map['className'] as String? ?? '',
      institutionId: map['institutionId'] as String,
      createdBy: map['createdBy'] as String,
      createdByName: map['createdByName'] as String? ?? '',
      status: SessionStatus.fromString(
          map['status'] as String? ?? 'scheduled'),
      scheduledStart: (map['scheduledStart'] as Timestamp).toDate(),
      liveStart: map['liveStart'] != null
          ? (map['liveStart'] as Timestamp).toDate()
          : null,
      endedAt: map['endedAt'] != null
          ? (map['endedAt'] as Timestamp).toDate()
          : null,
      location: map['location'] != null
          ? LatLng.fromMap(map['location'] as Map<String, dynamic>)
          : null,
      locationRadiusMeters:
          (map['locationRadiusMeters'] as num?)?.toDouble() ?? 100,
      requireLocation: map['requireLocation'] as bool? ?? false,
      qrRotateSeconds: map['qrRotateSeconds'] as int? ?? 30,
      totalEnrolled: map['totalEnrolled'] as int? ?? 0,
      presentCount: map['presentCount'] as int? ?? 0,
      lateCount: map['lateCount'] as int? ?? 0,
      absentCount: map['absentCount'] as int? ?? 0,
      currentNonce: map['currentNonce'] as String?,
      nonceExpiresAt: map['nonceExpiresAt'] != null
          ? (map['nonceExpiresAt'] as Timestamp).toDate()
          : null,
      notes: map['notes'] as String?,
    );
  }

  factory AttendanceSession.fromSnapshot(
      DocumentSnapshot<Map<String, dynamic>> snap) {
    return AttendanceSession.fromMap(snap.id, snap.data() ?? {});
  }

  Map<String, dynamic> toMap() {
    return {
      'classId': classId,
      'className': className,
      'institutionId': institutionId,
      'createdBy': createdBy,
      'createdByName': createdByName,
      'status': status.name,
      'scheduledStart': Timestamp.fromDate(scheduledStart),
      if (liveStart != null) 'liveStart': Timestamp.fromDate(liveStart!),
      if (endedAt != null) 'endedAt': Timestamp.fromDate(endedAt!),
      if (location != null) 'location': location!.toMap(),
      'locationRadiusMeters': locationRadiusMeters,
      'requireLocation': requireLocation,
      'qrRotateSeconds': qrRotateSeconds,
      'totalEnrolled': totalEnrolled,
      'presentCount': presentCount,
      'lateCount': lateCount,
      'absentCount': absentCount,
      if (currentNonce != null) 'currentNonce': currentNonce,
      if (nonceExpiresAt != null)
        'nonceExpiresAt': Timestamp.fromDate(nonceExpiresAt!),
      if (notes != null) 'notes': notes,
    };
  }

  AttendanceSession copyWith({
    String? id,
    String? classId,
    String? className,
    String? institutionId,
    String? createdBy,
    String? createdByName,
    SessionStatus? status,
    DateTime? scheduledStart,
    DateTime? liveStart,
    DateTime? endedAt,
    LatLng? location,
    double? locationRadiusMeters,
    bool? requireLocation,
    int? qrRotateSeconds,
    int? totalEnrolled,
    int? presentCount,
    int? lateCount,
    int? absentCount,
    String? currentNonce,
    DateTime? nonceExpiresAt,
    String? notes,
  }) {
    return AttendanceSession(
      id: id ?? this.id,
      classId: classId ?? this.classId,
      className: className ?? this.className,
      institutionId: institutionId ?? this.institutionId,
      createdBy: createdBy ?? this.createdBy,
      createdByName: createdByName ?? this.createdByName,
      status: status ?? this.status,
      scheduledStart: scheduledStart ?? this.scheduledStart,
      liveStart: liveStart ?? this.liveStart,
      endedAt: endedAt ?? this.endedAt,
      location: location ?? this.location,
      locationRadiusMeters:
          locationRadiusMeters ?? this.locationRadiusMeters,
      requireLocation: requireLocation ?? this.requireLocation,
      qrRotateSeconds: qrRotateSeconds ?? this.qrRotateSeconds,
      totalEnrolled: totalEnrolled ?? this.totalEnrolled,
      presentCount: presentCount ?? this.presentCount,
      lateCount: lateCount ?? this.lateCount,
      absentCount: absentCount ?? this.absentCount,
      currentNonce: currentNonce ?? this.currentNonce,
      nonceExpiresAt: nonceExpiresAt ?? this.nonceExpiresAt,
      notes: notes ?? this.notes,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AttendanceSession && other.id == id;

  @override
  int get hashCode => id.hashCode;
}

// ── AttendanceSeverity ─────────────────────────────────────────────────────

enum AttendanceSeverity {
  good,    // >= 75%
  warning, // 50–74%
  critical // < 50%
}
