import 'package:cloud_firestore/cloud_firestore.dart';

// ── Role enum ──────────────────────────────────────────────────────────────

enum Role {
  developer,
  institution,
  admin,
  teacher,
  student;

  String get label {
    switch (this) {
      case Role.developer:
        return 'Developer';
      case Role.institution:
        return 'Institution';
      case Role.admin:
        return 'Admin';
      case Role.teacher:
        return 'Teacher';
      case Role.student:
        return 'Student';
    }
  }

  static Role fromString(String value) {
    return Role.values.firstWhere(
      (r) => r.name == value.toLowerCase(),
      orElse: () => Role.student,
    );
  }
}

// ── StudentDevice ──────────────────────────────────────────────────────────

/// Represents a trusted device registered by a student.
/// Each student may register up to [maxDevices] devices.
class StudentDevice {
  const StudentDevice({
    required this.deviceId,
    required this.deviceName,
    required this.platform,
    required this.registeredAt,
    this.lastSeenAt,
    this.trusted = true,
  });

  static const int maxDevices = 2;

  final String deviceId;
  final String deviceName;
  final String platform; // 'android' | 'ios' | 'web'
  final DateTime registeredAt;
  final DateTime? lastSeenAt;
  final bool trusted;

  factory StudentDevice.fromMap(Map<String, dynamic> map) {
    return StudentDevice(
      deviceId: map['deviceId'] as String,
      deviceName: map['deviceName'] as String,
      platform: map['platform'] as String,
      registeredAt: (map['registeredAt'] as Timestamp).toDate(),
      lastSeenAt: map['lastSeenAt'] != null
          ? (map['lastSeenAt'] as Timestamp).toDate()
          : null,
      trusted: map['trusted'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'deviceId': deviceId,
      'deviceName': deviceName,
      'platform': platform,
      'registeredAt': Timestamp.fromDate(registeredAt),
      if (lastSeenAt != null) 'lastSeenAt': Timestamp.fromDate(lastSeenAt!),
      'trusted': trusted,
    };
  }

  StudentDevice copyWith({
    String? deviceId,
    String? deviceName,
    String? platform,
    DateTime? registeredAt,
    DateTime? lastSeenAt,
    bool? trusted,
  }) {
    return StudentDevice(
      deviceId: deviceId ?? this.deviceId,
      deviceName: deviceName ?? this.deviceName,
      platform: platform ?? this.platform,
      registeredAt: registeredAt ?? this.registeredAt,
      lastSeenAt: lastSeenAt ?? this.lastSeenAt,
      trusted: trusted ?? this.trusted,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudentDevice && other.deviceId == deviceId;

  @override
  int get hashCode => deviceId.hashCode;
}

// ── Institution ────────────────────────────────────────────────────────────

class Institution {
  const Institution({
    required this.id,
    required this.name,
    required this.slug,
    this.logoUrl,
    this.domain,
    this.timeZone = 'UTC',
    this.createdAt,
  });

  final String id;
  final String name;
  final String slug; // URL-safe identifier
  final String? logoUrl;
  final String? domain; // e.g. 'university.edu'
  final String timeZone;
  final DateTime? createdAt;

  factory Institution.fromMap(String id, Map<String, dynamic> map) {
    return Institution(
      id: id,
      name: map['name'] as String,
      slug: map['slug'] as String,
      logoUrl: map['logoUrl'] as String?,
      domain: map['domain'] as String?,
      timeZone: map['timeZone'] as String? ?? 'UTC',
      createdAt: map['createdAt'] != null
          ? (map['createdAt'] as Timestamp).toDate()
          : null,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'slug': slug,
      if (logoUrl != null) 'logoUrl': logoUrl,
      if (domain != null) 'domain': domain,
      'timeZone': timeZone,
      if (createdAt != null) 'createdAt': Timestamp.fromDate(createdAt!),
    };
  }

  Institution copyWith({
    String? id,
    String? name,
    String? slug,
    String? logoUrl,
    String? domain,
    String? timeZone,
    DateTime? createdAt,
  }) {
    return Institution(
      id: id ?? this.id,
      name: name ?? this.name,
      slug: slug ?? this.slug,
      logoUrl: logoUrl ?? this.logoUrl,
      domain: domain ?? this.domain,
      timeZone: timeZone ?? this.timeZone,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is Institution && other.id == id;

  @override
  int get hashCode => id.hashCode;
}

// ── UserModel ──────────────────────────────────────────────────────────────

/// Core user document stored under `users/{uid}`.
class UserModel {
  const UserModel({
    required this.uid,
    required this.displayName,
    required this.email,
    required this.role,
    this.photoUrl,
    this.phone,
    this.institutionId,
    this.enrollmentNumber,
    this.registeredDevices = const [],
    this.onboardingComplete = false,
    this.fcmToken,
    this.createdAt,
    this.lastSignInAt,
    this.disabled = false,
  });

  final String uid;
  final String displayName;
  final String email;
  final Role role;
  final String? photoUrl;
  final String? phone;

  /// Null for roles that don't belong to an institution.
  final String? institutionId;

  /// Student-specific enrollment / roll number.
  final String? enrollmentNumber;

  /// Trusted devices — populated for [Role.student] only.
  final List<StudentDevice> registeredDevices;

  /// Whether the user has completed the first-run onboarding flow.
  final bool onboardingComplete;

  /// Firebase Cloud Messaging token for push notifications.
  final String? fcmToken;

  final DateTime? createdAt;
  final DateTime? lastSignInAt;

  /// Soft-delete / suspend flag.
  final bool disabled;

  // ── Derived helpers ──────────────────────────────────────────────────────

  String get initials {
    final parts = displayName.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }

  bool get isStudent => role == Role.student;
  bool get isTeacher => role == Role.teacher;
  bool get isAdmin => role == Role.admin;
  bool get isDeveloper => role == Role.developer;
  bool get canManageSessions =>
      role == Role.teacher || role == Role.admin || role == Role.developer;

  // ── Firestore serialisation ───────────────────────────────────────────────

  factory UserModel.fromMap(String uid, Map<String, dynamic> map) {
    return UserModel(
      uid: uid,
      displayName: map['displayName'] as String? ?? '',
      email: map['email'] as String? ?? '',
      role: Role.fromString(map['role'] as String? ?? 'student'),
      photoUrl: map['photoUrl'] as String?,
      phone: map['phone'] as String?,
      institutionId: map['institutionId'] as String?,
      enrollmentNumber: map['enrollmentNumber'] as String?,
      registeredDevices: (map['registeredDevices'] as List<dynamic>?)
              ?.map((e) =>
                  StudentDevice.fromMap(e as Map<String, dynamic>))
              .toList() ??
          const [],
      onboardingComplete: map['onboardingComplete'] as bool? ?? false,
      fcmToken: map['fcmToken'] as String?,
      createdAt: map['createdAt'] != null
          ? (map['createdAt'] as Timestamp).toDate()
          : null,
      lastSignInAt: map['lastSignInAt'] != null
          ? (map['lastSignInAt'] as Timestamp).toDate()
          : null,
      disabled: map['disabled'] as bool? ?? false,
    );
  }

  factory UserModel.fromSnapshot(DocumentSnapshot<Map<String, dynamic>> snap) {
    return UserModel.fromMap(snap.id, snap.data() ?? {});
  }

  Map<String, dynamic> toMap() {
    return {
      'displayName': displayName,
      'email': email,
      'role': role.name,
      if (photoUrl != null) 'photoUrl': photoUrl,
      if (phone != null) 'phone': phone,
      if (institutionId != null) 'institutionId': institutionId,
      if (enrollmentNumber != null) 'enrollmentNumber': enrollmentNumber,
      'registeredDevices':
          registeredDevices.map((d) => d.toMap()).toList(),
      'onboardingComplete': onboardingComplete,
      if (fcmToken != null) 'fcmToken': fcmToken,
      if (createdAt != null) 'createdAt': Timestamp.fromDate(createdAt!),
      if (lastSignInAt != null)
        'lastSignInAt': Timestamp.fromDate(lastSignInAt!),
      'disabled': disabled,
    };
  }

  UserModel copyWith({
    String? uid,
    String? displayName,
    String? email,
    Role? role,
    String? photoUrl,
    String? phone,
    String? institutionId,
    String? enrollmentNumber,
    List<StudentDevice>? registeredDevices,
    bool? onboardingComplete,
    String? fcmToken,
    DateTime? createdAt,
    DateTime? lastSignInAt,
    bool? disabled,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      displayName: displayName ?? this.displayName,
      email: email ?? this.email,
      role: role ?? this.role,
      photoUrl: photoUrl ?? this.photoUrl,
      phone: phone ?? this.phone,
      institutionId: institutionId ?? this.institutionId,
      enrollmentNumber: enrollmentNumber ?? this.enrollmentNumber,
      registeredDevices: registeredDevices ?? this.registeredDevices,
      onboardingComplete: onboardingComplete ?? this.onboardingComplete,
      fcmToken: fcmToken ?? this.fcmToken,
      createdAt: createdAt ?? this.createdAt,
      lastSignInAt: lastSignInAt ?? this.lastSignInAt,
      disabled: disabled ?? this.disabled,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is UserModel && other.uid == uid;

  @override
  int get hashCode => uid.hashCode;

  @override
  String toString() =>
      'UserModel(uid: $uid, displayName: $displayName, role: ${role.name})';
}
