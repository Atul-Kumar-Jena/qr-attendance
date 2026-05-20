import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../models/session_model.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

// ── AttendanceBar ──────────────────────────────────────────────────────────

/// Animated progress bar colour-coded by attendance percentage.
///
/// Colour thresholds (matches design spec):
///   ≥ 75 % → green  ([AppColors.live])
///   50–74% → amber  ([AppColors.warning])
///   < 50 % → red    ([AppColors.error])
///
/// [percentage] must be in the range [0, 100].
class AttendanceBar extends StatefulWidget {
  const AttendanceBar({
    super.key,
    required this.percentage,
    this.height = 6,
    this.animate = true,
    this.animationDuration = const Duration(milliseconds: 700),
    this.animationCurve = Curves.easeOut,
  });

  final double percentage;
  final double height;
  final bool animate;
  final Duration animationDuration;
  final Curve animationCurve;

  @override
  State<AttendanceBar> createState() => _AttendanceBarState();
}

class _AttendanceBarState extends State<AttendanceBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: widget.animationDuration,
    );
    _anim = Tween<double>(begin: 0, end: _clamped)
        .animate(CurvedAnimation(parent: _ctrl, curve: widget.animationCurve));
    if (widget.animate) _ctrl.forward();
  }

  @override
  void didUpdateWidget(AttendanceBar old) {
    super.didUpdateWidget(old);
    if (old.percentage != widget.percentage) {
      _anim = Tween<double>(begin: _anim.value, end: _clamped)
          .animate(CurvedAnimation(parent: _ctrl, curve: widget.animationCurve));
      _ctrl
        ..reset()
        ..forward();
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  double get _clamped => (widget.percentage / 100).clamp(0.0, 1.0);

  Color _barColor(AppColors c) {
    if (widget.percentage >= 75) return c.live;
    if (widget.percentage >= 50) return c.warning;
    return c.error;
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final barColor = _barColor(c);

    return AnimatedBuilder(
      animation: _anim,
      builder: (_, __) {
        final fraction = widget.animate ? _anim.value : _clamped;
        return ClipRRect(
          borderRadius: BorderRadius.circular(9999),
          child: Container(
            height: widget.height,
            color: c.line,
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: fraction,
              child: Container(
                decoration: BoxDecoration(
                  color: barColor,
                  borderRadius: BorderRadius.circular(9999),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

// ── AttendanceBarWithLabel ─────────────────────────────────────────────────

/// [AttendanceBar] with a right-aligned percentage label.
class AttendanceBarWithLabel extends StatelessWidget {
  const AttendanceBarWithLabel({
    super.key,
    required this.percentage,
    this.height = 6,
    this.animate = true,
    this.labelFontSize = 12,
  });

  final double percentage;
  final double height;
  final bool animate;
  final double labelFontSize;

  Color _textColor(AppColors c) {
    if (percentage >= 75) return c.live;
    if (percentage >= 50) return c.warning;
    return c.error;
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Row(
      children: [
        Expanded(
          child: AttendanceBar(
            percentage: percentage,
            height: height,
            animate: animate,
          ),
        ),
        const SizedBox(width: 10),
        Text(
          '${percentage.round()}%',
          style: AppTypography.monoSmall.copyWith(
            fontSize: labelFontSize,
            fontWeight: FontWeight.w600,
            color: _textColor(c),
          ),
        ),
      ],
    );
  }
}

// ── AttendancePercentText ──────────────────────────────────────────────────

/// A large display text showing a percentage, coloured by severity.
///
/// Uses CormorantGaramond for the display value.
class AttendancePercentText extends StatelessWidget {
  const AttendancePercentText({
    super.key,
    required this.percentage,
    this.fontSize = 40,
    this.suffix,
  });

  final double percentage;
  final double fontSize;

  /// Optional suffix appended after the number (e.g. "%" or " / 120").
  final String? suffix;

  Color _color(AppColors c) {
    if (percentage >= 75) return c.live;
    if (percentage >= 50) return c.warning;
    return c.error;
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Text(
      '${percentage.round()}%${suffix ?? ''}',
      style: GoogleFonts.cormorantGaramond(
        fontSize: fontSize,
        fontWeight: FontWeight.w500,
        color: _color(c),
        height: 1.05,
        letterSpacing: fontSize * -0.02,
      ),
    );
  }
}

// ── SeverityIndicator ──────────────────────────────────────────────────────

/// A coloured dot (filled circle) indicating attendance severity.
class SeverityIndicator extends StatelessWidget {
  const SeverityIndicator({
    super.key,
    required this.severity,
    this.size = 8,
  });

  final AttendanceSeverity severity;
  final double size;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final color = switch (severity) {
      AttendanceSeverity.good => c.live,
      AttendanceSeverity.warning => c.warning,
      AttendanceSeverity.critical => c.error,
    };
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
    );
  }
}
