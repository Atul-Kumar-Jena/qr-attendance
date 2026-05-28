import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_theme.dart';

// ── AppCard ────────────────────────────────────────────────────────────────

/// The base card component for Attendly.
///
/// Matches the design system:
///   background : AppColors.bg2
///   radius     : 16 px
///   padding    : 16 px (default)
///   border     : 1 px solid AppColors.line
///   shadow     : 0 1px 4px rgba(11,18,32,0.06)
///
/// Optionally tappable via [onTap] — renders an [InkWell] with an
/// accent-tinted splash, otherwise it is inert.
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.onLongPress,
    this.radius = AppTheme.cardRadius,
    this.color,
    this.borderColor,
    this.elevation,
  });

  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final double radius;

  /// Override the background color (defaults to [AppColors.bg2]).
  final Color? color;

  /// Override the border color (defaults to [AppColors.line]).
  final Color? borderColor;

  /// Adds an extra box-shadow layer when non-null (0–3 range feels natural).
  final double? elevation;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final bgColor = color ?? c.bg2;
    final border = borderColor ?? c.line;

    Widget card = Container(
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: border, width: 1),
        boxShadow: [
          AppColors.cardShadow,
          if (elevation != null && elevation! > 0)
            BoxShadow(
              color: const Color(0x0A0B1220),
              blurRadius: 4 + elevation! * 4,
              spreadRadius: -1,
              offset: Offset(0, 1 + elevation!),
            ),
        ],
      ),
      padding: padding ?? const EdgeInsets.all(AppTheme.cardPadding),
      child: child,
    );

    if (onTap != null || onLongPress != null) {
      return Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(radius),
        child: InkWell(
          onTap: onTap,
          onLongPress: onLongPress,
          borderRadius: BorderRadius.circular(radius),
          splashColor: c.accent.withOpacity(0.06),
          highlightColor: c.accent.withOpacity(0.03),
          child: card,
        ),
      );
    }

    return card;
  }
}

// ── CardDivider ────────────────────────────────────────────────────────────

/// A 1 px horizontal rule styled to [AppColors.line].
class CardDivider extends StatelessWidget {
  const CardDivider({super.key, this.verticalPadding = 12});

  final double verticalPadding;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 1,
      color: AppColors.of(context).line,
      margin: EdgeInsets.symmetric(vertical: verticalPadding),
    );
  }
}

// ── CardSection ────────────────────────────────────────────────────────────

/// A labelled section within a card, separated by a [CardDivider].
class CardSection extends StatelessWidget {
  const CardSection({
    super.key,
    required this.title,
    required this.child,
    this.trailing,
  });

  final String title;
  final Widget child;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title.toUpperCase(),
              style: TextStyle(
                fontFamily: 'Courier New',
                fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: c.inkMute,
                letterSpacing: 0.5,
              ),
            ),
            if (trailing != null) trailing!,
          ],
        ),
        const SizedBox(height: 12),
        child,
      ],
    );
  }
}
