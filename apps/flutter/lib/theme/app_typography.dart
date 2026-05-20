import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Attendly typography system.
///
/// Display / heading text uses CormorantGaramond (serif, via google_fonts).
/// Body, label, and caption text use DM Sans (sans, via google_fonts).
/// Monospace (IDs, technical data) uses a platform monospace font.
///
/// All sizes follow an 8px-based scale (4px sub-steps where needed).
class AppTypography {
  AppTypography._();

  // ── Font family name constants (used for direct TextStyle.fontFamily) ──────

  static const String displayFamily = 'Cormorant Garamond';
  static const String sansFamily = 'DM Sans';
  static const String monoFamily = 'Courier New';

  // ── Private font-builder helpers ───────────────────────────────────────────

  /// DM Sans — body/UI sans-serif
  static TextStyle _sans({
    required double size,
    FontWeight weight = FontWeight.w400,
    double height = 1.55,
    double letterSpacing = 0.01,
    FontStyle style = FontStyle.normal,
  }) =>
      GoogleFonts.dmSans(
        fontSize: size,
        fontWeight: weight,
        height: height,
        letterSpacing: letterSpacing,
        fontStyle: style,
      );

  /// Cormorant Garamond — display/headings
  static TextStyle _display({
    required double size,
    FontWeight weight = FontWeight.w400,
    double? height,
    FontStyle style = FontStyle.normal,
  }) =>
      GoogleFonts.cormorantGaramond(
        fontSize: size,
        fontWeight: weight,
        height: height ?? (size >= 32 ? 1.05 : 1.1),
        letterSpacing: size >= 32 ? size * -0.02 : -0.3,
        fontStyle: style,
      );

  /// Monospace — IDs, tokens, technical values
  static TextStyle _mono({
    required double size,
    FontWeight weight = FontWeight.w400,
  }) =>
      TextStyle(
        fontFamily: monoFamily,
        fontFamilyFallback: const [
          'SF Mono',
          'Fira Code',
          'Menlo',
          'Consolas',
          'monospace',
        ],
        fontSize: size,
        fontWeight: weight,
        height: 1.55,
        letterSpacing: -0.1,
        fontFeatures: const [FontFeature.tabularFigures()],
      );

  // ── Display ────────────────────────────────────────────────────────────────

  /// Hero / marketing display — 48 sp, CormorantGaramond Light 300
  static TextStyle get displayLarge =>
      _display(size: 48, weight: FontWeight.w300, height: 1.1);

  /// Section header — 36 sp, CormorantGaramond Regular 400
  static TextStyle get displayMedium =>
      _display(size: 36, weight: FontWeight.w400, height: 1.15);

  /// Card heading — 28 sp, CormorantGaramond SemiBold 600
  static TextStyle get displaySmall =>
      _display(size: 28, weight: FontWeight.w600, height: 1.2);

  // ── Headings ───────────────────────────────────────────────────────────────

  /// Page title — 24 sp, CormorantGaramond SemiBold 600
  static TextStyle get headlineLarge =>
      _display(size: 24, weight: FontWeight.w600, height: 1.25);

  /// Section title — 20 sp, CormorantGaramond Medium 500
  static TextStyle get headlineMedium =>
      _display(size: 20, weight: FontWeight.w500, height: 1.3);

  /// Sub-section label — 18 sp, CormorantGaramond Medium 500
  static TextStyle get headlineSmall =>
      _display(size: 18, weight: FontWeight.w500, height: 1.35);

  // ── Title (sans) ───────────────────────────────────────────────────────────

  /// Card / list-item title — 16 sp, DM Sans SemiBold 600
  static TextStyle get titleLarge =>
      _sans(size: 16, weight: FontWeight.w600, height: 1.4);

  /// Smaller title — 14 sp, DM Sans SemiBold 600
  static TextStyle get titleMedium =>
      _sans(size: 14, weight: FontWeight.w600, height: 1.4);

  /// Tiny title / overline — 12 sp, DM Sans SemiBold 600, tracked
  static TextStyle get titleSmall =>
      _sans(size: 12, weight: FontWeight.w600, height: 1.4, letterSpacing: 0.4);

  // ── Body (sans) ────────────────────────────────────────────────────────────

  /// Primary body — 16 sp, DM Sans Regular 400
  static TextStyle get bodyLarge => _sans(size: 16);

  /// Secondary body — 14 sp, DM Sans Regular 400
  static TextStyle get bodyMedium => _sans(size: 14);

  /// Caption / helper text — 12 sp, DM Sans Regular 400
  static TextStyle get bodySmall => _sans(size: 12);

  // ── Label (sans) ───────────────────────────────────────────────────────────

  /// Button / prominent label — 14 sp, DM Sans Medium 500
  static TextStyle get labelLarge =>
      _sans(size: 14, weight: FontWeight.w500, height: 1.4, letterSpacing: 0.1);

  /// Pill / badge label — 12 sp, DM Sans Medium 500
  static TextStyle get labelMedium =>
      _sans(size: 12, weight: FontWeight.w500, height: 1.4, letterSpacing: 0.2);

  /// Tiny label — 10 sp, DM Sans Medium 500, tracked
  static TextStyle get labelSmall =>
      _sans(size: 10, weight: FontWeight.w500, height: 1.4, letterSpacing: 0.5);

  // ── Monospace ──────────────────────────────────────────────────────────────

  /// Monospace — IDs, tokens, hashes — 14 sp
  static TextStyle get monoMedium => _mono(size: 14);

  /// Monospace small — 12 sp
  static TextStyle get monoSmall => _mono(size: 12);

  // ── TextTheme builder ──────────────────────────────────────────────────────

  /// Builds a [TextTheme] wired to [color] for all roles.
  static TextTheme textTheme(Color color) {
    return TextTheme(
      displayLarge: displayLarge.copyWith(color: color),
      displayMedium: displayMedium.copyWith(color: color),
      displaySmall: displaySmall.copyWith(color: color),
      headlineLarge: headlineLarge.copyWith(color: color),
      headlineMedium: headlineMedium.copyWith(color: color),
      headlineSmall: headlineSmall.copyWith(color: color),
      titleLarge: titleLarge.copyWith(color: color),
      titleMedium: titleMedium.copyWith(color: color),
      titleSmall: titleSmall.copyWith(color: color),
      bodyLarge: bodyLarge.copyWith(color: color),
      bodyMedium: bodyMedium.copyWith(color: color),
      bodySmall: bodySmall.copyWith(color: color),
      labelLarge: labelLarge.copyWith(color: color),
      labelMedium: labelMedium.copyWith(color: color),
      labelSmall: labelSmall.copyWith(color: color),
    );
  }
}
