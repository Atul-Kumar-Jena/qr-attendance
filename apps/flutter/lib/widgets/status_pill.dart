import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';

// ── PillStatus enum ────────────────────────────────────────────────────────

/// All possible pill status values used throughout the Attendly UI.
enum PillStatus {
  live,
  scheduled,
  ended,
  cancelled,
  accepted,
  rejected,
  duplicate,
  locationFail,
  deviceMismatch,
  expired,
  atRisk,
  attested,
  sealed,
  suspended,
  pending,
  present,
  late,
  absent,
  excused,
}

// ── StatusPill ─────────────────────────────────────────────────────────────

/// A compact status pill badge conforming to the Attendly design system.
///
/// Uses a pill radius (9999 px), a subtle tinted background, a matching
/// border, and DM Sans 700 at 10 sp in all-caps.
///
/// ```dart
/// StatusPill(PillStatus.live)
/// StatusPill(PillStatus.atRisk, label: 'At Risk')
/// ```
class StatusPill extends StatelessWidget {
  const StatusPill(
    this.status, {
    super.key,
    this.label,
  });

  final PillStatus status;

  /// Override the auto-generated label.
  final String? label;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final cfg = _config(status, c);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
      decoration: BoxDecoration(
        color: cfg.bg,
        border: Border.all(color: cfg.border, width: 1),
        borderRadius: BorderRadius.circular(9999),
      ),
      child: Text(
        (label ?? cfg.label).toUpperCase(),
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

  // ── Config lookup ──────────────────────────────────────────────────────────

  static _PillConfig _config(PillStatus s, AppColors c) {
    switch (s) {
      // ── Green (good / active) ───────────────────────────────────────────
      case PillStatus.live:
        return _PillConfig(
          label: 'Live',
          fg: c.live,
          bg: c.live.withOpacity(0.12),
          border: c.live.withOpacity(0.25),
        );
      case PillStatus.accepted:
      case PillStatus.present:
        return _PillConfig(
          label: s == PillStatus.present ? 'Present' : 'Accepted',
          fg: c.live,
          bg: c.live.withOpacity(0.12),
          border: c.live.withOpacity(0.25),
        );
      case PillStatus.attested:
        return _PillConfig(
          label: 'Attested',
          fg: c.live,
          bg: c.live.withOpacity(0.12),
          border: c.live.withOpacity(0.25),
        );

      // ── Amber (warning / late) ──────────────────────────────────────────
      case PillStatus.atRisk:
        return _PillConfig(
          label: 'At Risk',
          fg: c.warning,
          bg: c.warning.withOpacity(0.12),
          border: c.warning.withOpacity(0.25),
        );
      case PillStatus.late:
        return _PillConfig(
          label: 'Late',
          fg: c.warning,
          bg: c.warning.withOpacity(0.12),
          border: c.warning.withOpacity(0.25),
        );

      // ── Red (error / rejected) ──────────────────────────────────────────
      case PillStatus.rejected:
        return _PillConfig(
          label: 'Rejected',
          fg: c.error,
          bg: c.error.withOpacity(0.12),
          border: c.error.withOpacity(0.25),
        );
      case PillStatus.duplicate:
        return _PillConfig(
          label: 'Duplicate',
          fg: c.error,
          bg: c.error.withOpacity(0.12),
          border: c.error.withOpacity(0.25),
        );
      case PillStatus.locationFail:
        return _PillConfig(
          label: 'Location',
          fg: c.error,
          bg: c.error.withOpacity(0.12),
          border: c.error.withOpacity(0.25),
        );
      case PillStatus.deviceMismatch:
        return _PillConfig(
          label: 'Device',
          fg: c.error,
          bg: c.error.withOpacity(0.12),
          border: c.error.withOpacity(0.25),
        );
      case PillStatus.expired:
        return _PillConfig(
          label: 'Expired',
          fg: c.error,
          bg: c.error.withOpacity(0.12),
          border: c.error.withOpacity(0.25),
        );
      case PillStatus.suspended:
        return _PillConfig(
          label: 'Suspended',
          fg: c.error,
          bg: c.error.withOpacity(0.12),
          border: c.error.withOpacity(0.25),
        );
      case PillStatus.absent:
        return _PillConfig(
          label: 'Absent',
          fg: c.error,
          bg: c.error.withOpacity(0.12),
          border: c.error.withOpacity(0.25),
        );

      // ── Neutral (pending / ended / default) ─────────────────────────────
      case PillStatus.pending:
      case PillStatus.scheduled:
        return _PillConfig(
          label: s == PillStatus.scheduled ? 'Scheduled' : 'Pending',
          fg: c.inkMute,
          bg: c.ink.withOpacity(0.06),
          border: c.ink.withOpacity(0.10),
        );
      case PillStatus.ended:
        return _PillConfig(
          label: 'Ended',
          fg: c.inkMute,
          bg: c.ink.withOpacity(0.06),
          border: c.ink.withOpacity(0.10),
        );
      case PillStatus.cancelled:
        return _PillConfig(
          label: 'Cancelled',
          fg: c.inkMute,
          bg: c.ink.withOpacity(0.06),
          border: c.ink.withOpacity(0.10),
        );
      case PillStatus.sealed:
        return _PillConfig(
          label: 'Sealed',
          fg: c.inkMute,
          bg: c.ink.withOpacity(0.06),
          border: c.ink.withOpacity(0.10),
        );
      case PillStatus.excused:
        return _PillConfig(
          label: 'Excused',
          fg: c.inkMute,
          bg: c.ink.withOpacity(0.06),
          border: c.ink.withOpacity(0.10),
        );
    }
  }
}

// ── _PillConfig ────────────────────────────────────────────────────────────

class _PillConfig {
  const _PillConfig({
    required this.label,
    required this.fg,
    required this.bg,
    required this.border,
  });

  final String label;
  final Color fg;
  final Color bg;
  final Color border;
}
