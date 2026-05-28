import 'package:cloud_firestore/cloud_firestore.dart';
import 'user_model.dart';

// ── ClassSchedule ──────────────────────────────────────────────────────────

/// A recurring schedule slot for a class (e.g. "Mon/Wed 09:00–10:30").
class ClassSchedule {
  const ClassSchedule({
    required this.dayOfWeek, // 1=Mon … 7=Sun (ISO 8601)
    required this.startHour,
    required this.startMinute,
    required this.durationMinutes,
    this.room,
  });

  final int dayOfWeek;
  final int startHour;
  final int startMinute;
  final int durationMinutes;
  final String? room;

  String get timeLabel {
    final h = startHour.toString().padLeft(2, '0');
    final m = startMinute.toString().padLeft(2, '0');
    final endTotal = startHour * 60 + startMinute + durationMinutes;
    final eh = (endTotal ~/ 60).toString().padLeft(2, '0');
    final em = (endTotal % 60).toString().padLeft(2, '0');
    return '$h:$m – $eh:$em';
  }

  String get dayLabel {
    const days = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayOfWeek.clamp(1, 7)];
  }

  factory ClassSchedule.fromMap(Map<String, dynamic> map) {
    return ClassSchedule(
      dayOfWeek: map['dayOfWeek'] as int? ?? 1,
      startHour: map['startHour'] as int? ?? 9,
      startMinute: map['startMinute'] as int? ?? 0,
      durationMinutes: map['durationMinutes'] as int? ?? 60,
      room: map['room'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'dayOfWeek': dayOfWeek,
      'startHour': startHour,
      'startMinute': startMinute,
      'durationMinutes': durationMinutes,
      if (room != null) 'room': room,
    };
  }
}

// ── ClassMember ────────────────────────────────────────────────────────────

/// A single member entry in a class roster.
/// Stored under `classes/{classId}/members/{uid}`.
class ClassMember {
  const ClassMember({
    required this.uid,
    required this.displayName,
    required this.email,
    required this.role,
    this.enrollmentNumber,
    this.photoUrl,
    this.joinedAt,
    this.active = true,
    this.currentAttendanceRate = 0.0,
  });

  final String uid;
  final String displayName;
  final String email;
  final Role role;
  final String? enrollmentNumber;
  final String? photoUrl;
  final DateTime? joinedAt;
  final bool active;

  /// Cached attendance rate [0.0, 1.0] for quick display in roster views.
  final double currentAttendanceRate;

  bool get isAtRisk => currentAttendanceRate < 0.75;

  String get initials {
    final parts = displayName.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }

  factory ClassMember.fromMap(String uid, Map<String, dynamic> map) {
    return ClassMember(
      uid: uid,
      displayName: map['displayName'] as String? ?? '',
      email: map['email'] as String? ?? '',
      role: Role.fromString(map['role'] as String? ?? 'student'),
      enrollmentNumber: map['enrollmentNumber'] as String?,
      photoUrl: map['photoUrl'] as String?,
      joinedAt: map['joinedAt'] != null
          ? (map['joinedAt'] as Timestamp).toDate()
          : null,
      active: map['active'] as bool? ?? true,
      currentAttendanceRate:
          (map['currentAttendanceRate'] as num?)?.toDouble() ?? 0.0,
    );
  }

  factory ClassMember.fromSnapshot(
      DocumentSnapshot<Map<String, dynamic>> snap) {
    return ClassMember.fromMap(snap.id, snap.data() ?? {});
  }

  Map<String, dynamic> toMap() {
    return {
      'displayName': displayName,
      'email': email,
      'role': role.name,
      if (enrollmentNumber != null) 'enrollmentNumber': enrollmentNumber,
      if (photoUrl != null) 'photoUrl': photoUrl,
      if (joinedAt != null) 'joinedAt': Timestamp.fromDate(joinedAt!),
      'active': active,
      'currentAttendanceRate': currentAttendanceRate,
    };
  }

  ClassMember copyWith({
    String? uid,
    String? displayName,
    String? email,
    Role? role,
    String? enrollmentNumber,
    String? photoUrl,
    DateTime? joinedAt,
    bool? active,
    double? currentAttendanceRate,
  }) {
    return ClassMember(
      uid: uid ?? this.uid,
      displayName: displayName ?? this.displayName,
      email: email ?? this.email,
      role: role ?? this.role,
      enrollmentNumber: enrollmentNumber ?? this.enrollmentNumber,
      photoUrl: photoUrl ?? this.photoUrl,
      joinedAt: joinedAt ?? this.joinedAt,
      active: active ?? this.active,
      currentAttendanceRate:
          currentAttendanceRate ?? this.currentAttendanceRate,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is ClassMember && other.uid == uid;

  @override
  int get hashCode => uid.hashCode;
}

// ── ClassModel ─────────────────────────────────────────────────────────────

/// Represents a class / course, stored under `classes/{classId}`.
class ClassModel {
  const ClassModel({
    required this.id,
    required this.name,
    required this.code,
    required this.institutionId,
    required this.teacherIds,
    this.description,
    this.semester,
    this.academicYear,
    this.schedule = const [],
    this.studentCount = 0,
    this.totalSessions = 0,
    this.credits = 3,
    this.archivedAt,
    this.createdAt,
  });

  final String id;
  final String name;

  /// Short code like "CS-101" shown in lists and QR payloads.
  final String code;
  final String institutionId;

  /// UIDs of teachers who can start sessions for this class.
  final List<String> teacherIds;

  final String? description;
  final String? semester;
  final String? academicYear;
  final List<ClassSchedule> schedule;

  /// Denormalised count of enrolled active students.
  final int studentCount;

  /// Total number of sessions ever started for this class.
  final int totalSessions;

  final int credits;

  final DateTime? archivedAt;
  final DateTime? createdAt;

  bool get isArchived => archivedAt != null;

  // ── Serialisation ─────────────────────────────────────────────────────────

  factory ClassModel.fromMap(String id, Map<String, dynamic> map) {
    return ClassModel(
      id: id,
      name: map['name'] as String? ?? '',
      code: map['code'] as String? ?? '',
      institutionId: map['institutionId'] as String? ?? '',
      teacherIds: List<String>.from(map['teacherIds'] as List? ?? []),
      description: map['description'] as String?,
      semester: map['semester'] as String?,
      academicYear: map['academicYear'] as String?,
      schedule: (map['schedule'] as List<dynamic>?)
              ?.map((e) =>
                  ClassSchedule.fromMap(e as Map<String, dynamic>))
              .toList() ??
          const [],
      studentCount: map['studentCount'] as int? ?? 0,
      totalSessions: map['totalSessions'] as int? ?? 0,
      credits: map['credits'] as int? ?? 3,
      archivedAt: map['archivedAt'] != null
          ? (map['archivedAt'] as Timestamp).toDate()
          : null,
      createdAt: map['createdAt'] != null
          ? (map['createdAt'] as Timestamp).toDate()
          : null,
    );
  }

  factory ClassModel.fromSnapshot(
      DocumentSnapshot<Map<String, dynamic>> snap) {
    return ClassModel.fromMap(snap.id, snap.data() ?? {});
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'code': code,
      'institutionId': institutionId,
      'teacherIds': teacherIds,
      if (description != null) 'description': description,
      if (semester != null) 'semester': semester,
      if (academicYear != null) 'academicYear': academicYear,
      'schedule': schedule.map((s) => s.toMap()).toList(),
      'studentCount': studentCount,
      'totalSessions': totalSessions,
      'credits': credits,
      if (archivedAt != null)
        'archivedAt': Timestamp.fromDate(archivedAt!),
      if (createdAt != null) 'createdAt': Timestamp.fromDate(createdAt!),
    };
  }

  ClassModel copyWith({
    String? id,
    String? name,
    String? code,
    String? institutionId,
    List<String>? teacherIds,
    String? description,
    String? semester,
    String? academicYear,
    List<ClassSchedule>? schedule,
    int? studentCount,
    int? totalSessions,
    int? credits,
    DateTime? archivedAt,
    DateTime? createdAt,
  }) {
    return ClassModel(
      id: id ?? this.id,
      name: name ?? this.name,
      code: code ?? this.code,
      institutionId: institutionId ?? this.institutionId,
      teacherIds: teacherIds ?? this.teacherIds,
      description: description ?? this.description,
      semester: semester ?? this.semester,
      academicYear: academicYear ?? this.academicYear,
      schedule: schedule ?? this.schedule,
      studentCount: studentCount ?? this.studentCount,
      totalSessions: totalSessions ?? this.totalSessions,
      credits: credits ?? this.credits,
      archivedAt: archivedAt ?? this.archivedAt,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is ClassModel && other.id == id;

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() => 'ClassModel($code – $name)';
}
