import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';

// ── AvatarCircle ───────────────────────────────────────────────────────────

/// A circular avatar widget that renders either a network photo or an
/// initials placeholder styled with the Attendly design system.
///
/// The initials placeholder uses:
///   background : [AppColors.accent] at 15% opacity
///   text       : [AppColors.accent], CormorantGaramond SemiBold
///
/// Example:
/// ```dart
/// AvatarCircle(initials: 'JD', size: 48)
/// AvatarCircle(initials: 'JD', photoUrl: user.photoUrl, size: 40)
/// ```
class AvatarCircle extends StatelessWidget {
  const AvatarCircle({
    super.key,
    required this.initials,
    this.size = 40,
    this.photoUrl,
    this.backgroundColor,
    this.textColor,
  });

  /// The fallback initials to show when no [photoUrl] is provided.
  final String initials;

  /// Diameter of the circle in logical pixels.
  final double size;

  /// If non-null and non-empty, loads the photo from the network.
  final String? photoUrl;

  /// Optional background color override for the initials placeholder.
  final Color? backgroundColor;

  /// Optional text color override for the initials placeholder.
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    if (photoUrl != null && photoUrl!.isNotEmpty) {
      return _NetworkAvatar(url: photoUrl!, size: size);
    }
    return _InitialsAvatar(
      initials: initials,
      size: size,
      backgroundColor: backgroundColor,
      textColor: textColor,
    );
  }
}

// ── _NetworkAvatar ─────────────────────────────────────────────────────────

class _NetworkAvatar extends StatelessWidget {
  const _NetworkAvatar({required this.url, required this.size});

  final String url;
  final double size;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: c.line, width: 1),
        image: DecorationImage(
          image: NetworkImage(url),
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}

// ── _InitialsAvatar ────────────────────────────────────────────────────────

class _InitialsAvatar extends StatelessWidget {
  const _InitialsAvatar({
    required this.initials,
    required this.size,
    this.backgroundColor,
    this.textColor,
  });

  final String initials;
  final double size;
  final Color? backgroundColor;
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final bg = backgroundColor ?? c.accent.withOpacity(0.15);
    final fg = textColor ?? c.accent;

    // Show at most 2 characters
    final display =
        initials.trim().isEmpty ? '?' : initials.substring(0, initials.length.clamp(0, 2));

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: bg,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        display.toUpperCase(),
        style: GoogleFonts.cormorantGaramond(
          fontSize: size * 0.38,
          fontWeight: FontWeight.w600,
          color: fg,
          height: 1,
        ),
      ),
    );
  }
}

// ── AvatarStack ────────────────────────────────────────────────────────────

/// Stacks multiple avatars horizontally with overlap, showing up to
/// [maxVisible] circles and a "+N" overflow indicator.
///
/// Useful for showing the member list of a class or session.
class AvatarStack extends StatelessWidget {
  const AvatarStack({
    super.key,
    required this.initials,
    this.photoUrls = const [],
    this.size = 32,
    this.overlap = 10,
    this.maxVisible = 5,
  });

  final List<String> initials;
  final List<String?> photoUrls;
  final double size;
  final double overlap;
  final int maxVisible;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final count = initials.length;
    final visible = count.clamp(0, maxVisible);
    final overflow = count - visible;

    return SizedBox(
      height: size,
      width: visible * (size - overlap) + (overflow > 0 ? size : 0),
      child: Stack(
        children: [
          for (int i = 0; i < visible; i++)
            Positioned(
              left: i * (size - overlap),
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: c.bg, width: 2),
                ),
                child: AvatarCircle(
                  initials: initials[i],
                  photoUrl:
                      i < photoUrls.length ? photoUrls[i] : null,
                  size: size,
                ),
              ),
            ),
          if (overflow > 0)
            Positioned(
              left: visible * (size - overlap),
              child: Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  color: c.bg2,
                  shape: BoxShape.circle,
                  border: Border.all(color: c.line, width: 1),
                ),
                alignment: Alignment.center,
                child: Text(
                  '+$overflow',
                  style: TextStyle(
                    fontFamily: 'Courier New',
                    fontSize: size * 0.28,
                    fontWeight: FontWeight.w600,
                    color: c.inkMute,
                    height: 1,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
