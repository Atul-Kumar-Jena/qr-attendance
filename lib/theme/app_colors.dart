import 'package:flutter/material.dart';

/// Attendly design-system color tokens.
///
/// Usage:
///   final colors = AppColors.of(context);
///   Container(color: colors.bg)
@immutable
class AppColors extends ThemeExtension<AppColors> {
  const AppColors({
    required this.bg,
    required this.bg2,
    required this.ink,
    required this.inkSoft,
    required this.inkMute,
    required this.line,
    required this.accent,
    required this.live,
    required this.warning,
    required this.error,
    required this.roleDeveloper,
    required this.roleInstitution,
    required this.roleAdmin,
    required this.roleTeacher,
    required this.roleStudent,
  });

  // ── Backgrounds ────────────────────────────────────────────────────────────
  final Color bg;
  final Color bg2;

  // ── Text / Ink ─────────────────────────────────────────────────────────────
  final Color ink;
  final Color inkSoft;
  final Color inkMute;

  // ── Structural ─────────────────────────────────────────────────────────────
  final Color line;

  // ── Brand / Accent ─────────────────────────────────────────────────────────
  final Color accent;

  // ── Status ─────────────────────────────────────────────────────────────────
  final Color live;
  final Color warning;
  final Color error;

  // ── Role pills ─────────────────────────────────────────────────────────────
  final Color roleDeveloper;
  final Color roleInstitution;
  final Color roleAdmin;
  final Color roleTeacher;
  final Color roleStudent;

  // ── Static light palette ───────────────────────────────────────────────────
  static const light = AppColors(
    bg: Color(0xFFFAFAF7),
    bg2: Color(0xFFF4F3EC),
    ink: Color(0xFF0B1220),
    inkSoft: Color(0xFF1A2236),
    inkMute: Color(0xFF5A6783),
    line: Color(0x120B1220), // rgba(11,18,32,0.07)
    accent: Color(0xFFFF6B3D),
    live: Color(0xFF22C55E),
    warning: Color(0xFFF59E0B),
    error: Color(0xFFEF4444),
    roleDeveloper: Color(0xFFEF4444),   // red
    roleInstitution: Color(0xFFF97316), // orange
    roleAdmin: Color(0xFFEAB308),       // yellow
    roleTeacher: Color(0xFF3B82F6),     // blue
    roleStudent: Color(0xFF6B7280),     // neutral
  );

  // ── Static dark palette ────────────────────────────────────────────────────
  static const dark = AppColors(
    bg: Color(0xFF0D0F14),
    bg2: Color(0xFF13161D),
    ink: Color(0xFFF0EDE6),
    inkSoft: Color(0xFFD4D0C8),
    inkMute: Color(0xFF7A8199),
    line: Color(0x14F0EDE6), // rgba(240,237,230,0.08)
    accent: Color(0xFFFF6B3D),
    live: Color(0xFF22C55E),
    warning: Color(0xFFF59E0B),
    error: Color(0xFFEF4444),
    roleDeveloper: Color(0xFFEF4444),
    roleInstitution: Color(0xFFF97316),
    roleAdmin: Color(0xFFEAB308),
    roleTeacher: Color(0xFF3B82F6),
    roleStudent: Color(0xFF9CA3AF),
  );

  // ── ThemeExtension overrides ───────────────────────────────────────────────
  @override
  AppColors copyWith({
    Color? bg,
    Color? bg2,
    Color? ink,
    Color? inkSoft,
    Color? inkMute,
    Color? line,
    Color? accent,
    Color? live,
    Color? warning,
    Color? error,
    Color? roleDeveloper,
    Color? roleInstitution,
    Color? roleAdmin,
    Color? roleTeacher,
    Color? roleStudent,
  }) {
    return AppColors(
      bg: bg ?? this.bg,
      bg2: bg2 ?? this.bg2,
      ink: ink ?? this.ink,
      inkSoft: inkSoft ?? this.inkSoft,
      inkMute: inkMute ?? this.inkMute,
      line: line ?? this.line,
      accent: accent ?? this.accent,
      live: live ?? this.live,
      warning: warning ?? this.warning,
      error: error ?? this.error,
      roleDeveloper: roleDeveloper ?? this.roleDeveloper,
      roleInstitution: roleInstitution ?? this.roleInstitution,
      roleAdmin: roleAdmin ?? this.roleAdmin,
      roleTeacher: roleTeacher ?? this.roleTeacher,
      roleStudent: roleStudent ?? this.roleStudent,
    );
  }

  @override
  AppColors lerp(AppColors? other, double t) {
    if (other == null) return this;
    return AppColors(
      bg: Color.lerp(bg, other.bg, t)!,
      bg2: Color.lerp(bg2, other.bg2, t)!,
      ink: Color.lerp(ink, other.ink, t)!,
      inkSoft: Color.lerp(inkSoft, other.inkSoft, t)!,
      inkMute: Color.lerp(inkMute, other.inkMute, t)!,
      line: Color.lerp(line, other.line, t)!,
      accent: Color.lerp(accent, other.accent, t)!,
      live: Color.lerp(live, other.live, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      error: Color.lerp(error, other.error, t)!,
      roleDeveloper: Color.lerp(roleDeveloper, other.roleDeveloper, t)!,
      roleInstitution: Color.lerp(roleInstitution, other.roleInstitution, t)!,
      roleAdmin: Color.lerp(roleAdmin, other.roleAdmin, t)!,
      roleTeacher: Color.lerp(roleTeacher, other.roleTeacher, t)!,
      roleStudent: Color.lerp(roleStudent, other.roleStudent, t)!,
    );
  }

  // ── Convenience accessor ───────────────────────────────────────────────────
  static AppColors of(BuildContext context) {
    return Theme.of(context).extension<AppColors>()!;
  }

  /// Card shadow — same in both modes, just lower opacity in dark.
  static BoxShadow get cardShadow => const BoxShadow(
        color: Color(0x0F0B1220), // rgba(11,18,32,0.06)
        blurRadius: 4,
        offset: Offset(0, 1),
      );
}
