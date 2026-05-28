import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../models/user_model.dart';
import '../theme/app_colors.dart';

// ── RoleBadge ──────────────────────────────────────────────────────────────

/// A pill-shaped role badge conforming to the Attendly design system.
///
/// Role colour mappings:
///   developer   → red
///   institution → orange
///   admin       → yellow
///   teacher     → blue
///   student     → neutral (ink-mute)
///
/// The pill uses a subtle tinted background (12% opacity), a matching border
/// (25% opacity), and DM Sans Bold at 10 sp in all-caps.
///
/// Example:
/// ```dart
/// RoleBadge(Role.teacher)
/// RoleBadge(Role.student, label: 'Enrolled')
/// ```
class RoleBadge extends StatelessWidget {
  const RoleBadge(
    this.role, {
    super.key,
    this.label,
  });

  final Role role;

  /// Optional label override. Defaults to [Role.label].
  final String? label;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final cfg = _configFor(role, c);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
      decoration: BoxDecoration(
        color: cfg.bg,
        border: Border.all(color: cfg.border, width: 1),
        borderRadius: BorderRadius.circular(9999),
      ),
      child: Text(
        (label ?? role.label).toUpperCase(),
        style: GoogleFonts.dmSans(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: cfg.fg,
          letterSpacing: 0.15,
          height: 1.2,
        ),
      ),
    );
  }

  // ── Colour lookup ──────────────────────────────────────────────────────────

  static _BadgeConfig _configFor(Role role, AppColors c) {
    switch (role) {
      case Role.developer:
        return _BadgeConfig(
          fg: c.roleDeveloper,
          bg: c.roleDeveloper.withOpacity(0.12),
          border: c.roleDeveloper.withOpacity(0.25),
        );
      case Role.institution:
        return _BadgeConfig(
          fg: c.roleInstitution,
          bg: c.roleInstitution.withOpacity(0.12),
          border: c.roleInstitution.withOpacity(0.25),
        );
      case Role.admin:
        return _BadgeConfig(
          fg: c.roleAdmin,
          bg: c.roleAdmin.withOpacity(0.12),
          border: c.roleAdmin.withOpacity(0.25),
        );
      case Role.teacher:
        return _BadgeConfig(
          fg: c.roleTeacher,
          bg: c.roleTeacher.withOpacity(0.12),
          border: c.roleTeacher.withOpacity(0.25),
        );
      case Role.student:
        return _BadgeConfig(
          fg: c.roleStudent,
          bg: c.ink.withOpacity(0.06),
          border: c.ink.withOpacity(0.12),
        );
    }
  }
}

// ── _BadgeConfig ───────────────────────────────────────────────────────────

class _BadgeConfig {
  const _BadgeConfig({
    required this.fg,
    required this.bg,
    required this.border,
  });

  final Color fg;
  final Color bg;
  final Color border;
}
