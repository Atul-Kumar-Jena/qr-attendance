import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';
import 'app_typography.dart';

/// Builds the full [ThemeData] for Attendly in both light and dark modes.
///
/// Design system constants:
///   Spacing grid : 8 px
///   Screen padding: 20 px
///   Card padding  : 16 px
///   Card radius   : 16 px
///   Button radius : 12 px
///   Pill radius   : 9999 px (use [AppTheme.pillRadius])
class AppTheme {
  AppTheme._();

  // ── Radius constants ───────────────────────────────────────────────────────
  static const double cardRadius = 16;
  static const double buttonRadius = 12;
  static const double pillRadius = 9999;

  // ── Spacing constants ──────────────────────────────────────────────────────
  static const double screenPadding = 20;
  static const double cardPadding = 16;
  static const double gridUnit = 8;

  // ── Light theme ────────────────────────────────────────────────────────────
  static ThemeData get light => _build(
        colors: AppColors.light,
        brightness: Brightness.light,
        systemUiStyle: SystemUiOverlayStyle.dark,
      );

  // ── Dark theme ─────────────────────────────────────────────────────────────
  static ThemeData get dark => _build(
        colors: AppColors.dark,
        brightness: Brightness.dark,
        systemUiStyle: SystemUiOverlayStyle.light,
      );

  // ── Internal builder ───────────────────────────────────────────────────────
  static ThemeData _build({
    required AppColors colors,
    required Brightness brightness,
    required SystemUiOverlayStyle systemUiStyle,
  }) {
    final isDark = brightness == Brightness.dark;

    // M3 ColorScheme mapped from design tokens
    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: colors.accent,
      onPrimary: Colors.white,
      primaryContainer: colors.accent.withOpacity(0.12),
      onPrimaryContainer: colors.accent,
      secondary: colors.inkSoft,
      onSecondary: colors.bg,
      secondaryContainer: colors.bg2,
      onSecondaryContainer: colors.ink,
      tertiary: colors.live,
      onTertiary: Colors.white,
      tertiaryContainer: colors.live.withOpacity(0.12),
      onTertiaryContainer: colors.live,
      error: colors.error,
      onError: Colors.white,
      errorContainer: colors.error.withOpacity(0.12),
      onErrorContainer: colors.error,
      surface: colors.bg,
      onSurface: colors.ink,
      surfaceContainerHighest: colors.bg2,
      onSurfaceVariant: colors.inkMute,
      outline: colors.line,
      outlineVariant: colors.line,
      shadow: const Color(0xFF0B1220),
      scrim: const Color(0xFF0B1220),
      inverseSurface: isDark ? colors.bg2 : const Color(0xFF1A2236),
      onInverseSurface: isDark ? colors.inkMute : const Color(0xFFF0EDE6),
      inversePrimary: colors.accent,
    );

    // Card shape shared across the app
    final cardShape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(cardRadius),
    );

    // Button shape
    final buttonShape = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(buttonRadius),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colors.bg,
      canvasColor: colors.bg,
      cardColor: colors.bg2,
      dividerColor: colors.line,
      extensions: [colors],

      // ── Typography ─────────────────────────────────────────────────────────
      textTheme: AppTypography.textTheme(colors.ink),
      primaryTextTheme: AppTypography.textTheme(colors.ink),

      // ── AppBar ─────────────────────────────────────────────────────────────
      appBarTheme: AppBarTheme(
        backgroundColor: colors.bg,
        foregroundColor: colors.ink,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: colors.line,
        centerTitle: false,
        titleTextStyle: GoogleFonts.cormorantGaramond(
          fontSize: 20,
          fontWeight: FontWeight.w500,
          height: 1.3,
          color: colors.ink,
        ),
        iconTheme: IconThemeData(color: colors.ink, size: 24),
        actionsIconTheme: IconThemeData(color: colors.inkSoft, size: 24),
        systemOverlayStyle: systemUiStyle.copyWith(
          statusBarColor: Colors.transparent,
        ),
      ),

      // ── Card ───────────────────────────────────────────────────────────────
      cardTheme: CardThemeData(
        color: colors.bg2,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shape: cardShape,
        clipBehavior: Clip.antiAlias,
        margin: EdgeInsets.zero,
      ),

      // ── ElevatedButton ─────────────────────────────────────────────────────
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: colors.accent,
          foregroundColor: Colors.white,
          disabledBackgroundColor: colors.inkMute.withOpacity(0.12),
          disabledForegroundColor: colors.inkMute,
          elevation: 0,
          shadowColor: Colors.transparent,
          textStyle: AppTypography.labelLarge,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: buttonShape,
          minimumSize: const Size(0, 48),
        ),
      ),

      // ── OutlinedButton ─────────────────────────────────────────────────────
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: colors.ink,
          disabledForegroundColor: colors.inkMute,
          side: BorderSide(color: colors.line, width: 1),
          textStyle: AppTypography.labelLarge,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: buttonShape,
          minimumSize: const Size(0, 48),
        ),
      ),

      // ── TextButton ─────────────────────────────────────────────────────────
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: colors.accent,
          textStyle: AppTypography.labelLarge,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          shape: buttonShape,
          minimumSize: const Size(0, 40),
        ),
      ),

      // ── FilledButton ───────────────────────────────────────────────────────
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: colors.accent,
          foregroundColor: Colors.white,
          disabledBackgroundColor: colors.inkMute.withOpacity(0.12),
          disabledForegroundColor: colors.inkMute,
          elevation: 0,
          textStyle: AppTypography.labelLarge,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: buttonShape,
          minimumSize: const Size(0, 48),
        ),
      ),

      // ── InputDecoration ────────────────────────────────────────────────────
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colors.bg2,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(buttonRadius),
          borderSide: BorderSide(color: colors.line, width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(buttonRadius),
          borderSide: BorderSide(color: colors.line, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(buttonRadius),
          borderSide: BorderSide(color: colors.accent, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(buttonRadius),
          borderSide: BorderSide(color: colors.error, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(buttonRadius),
          borderSide: BorderSide(color: colors.error, width: 1.5),
        ),
        labelStyle: AppTypography.bodyMedium.copyWith(color: colors.inkMute),
        hintStyle: AppTypography.bodyMedium.copyWith(color: colors.inkMute),
        errorStyle: AppTypography.bodySmall.copyWith(color: colors.error),
        prefixIconColor: colors.inkMute,
        suffixIconColor: colors.inkMute,
        floatingLabelStyle: AppTypography.labelMedium.copyWith(
          color: colors.accent,
        ),
      ),

      // ── ListTile ───────────────────────────────────────────────────────────
      listTileTheme: ListTileThemeData(
        tileColor: Colors.transparent,
        selectedTileColor: colors.accent.withOpacity(0.08),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: screenPadding, vertical: 4),
        titleTextStyle:
            AppTypography.bodyMedium.copyWith(color: colors.ink),
        subtitleTextStyle:
            AppTypography.bodySmall.copyWith(color: colors.inkMute),
        leadingAndTrailingTextStyle:
            AppTypography.labelMedium.copyWith(color: colors.inkMute),
        iconColor: colors.inkMute,
        selectedColor: colors.accent,
        minLeadingWidth: 24,
        minVerticalPadding: 10,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(cardRadius),
        ),
      ),

      // ── BottomNavigationBar ────────────────────────────────────────────────
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: colors.bg,
        selectedItemColor: colors.accent,
        unselectedItemColor: colors.inkMute,
        selectedLabelStyle: AppTypography.labelSmall,
        unselectedLabelStyle: AppTypography.labelSmall,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        showSelectedLabels: true,
        showUnselectedLabels: true,
      ),

      // ── NavigationBar (M3) ─────────────────────────────────────────────────
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: colors.bg,
        indicatorColor: colors.accent.withOpacity(0.12),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return IconThemeData(color: colors.accent, size: 24);
          }
          return IconThemeData(color: colors.inkMute, size: 24);
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppTypography.labelSmall.copyWith(color: colors.accent);
          }
          return AppTypography.labelSmall.copyWith(color: colors.inkMute);
        }),
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        height: 64,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      ),

      // ── NavigationDrawer ───────────────────────────────────────────────────
      navigationDrawerTheme: NavigationDrawerThemeData(
        backgroundColor: colors.bg,
        indicatorColor: colors.accent.withOpacity(0.12),
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppTypography.bodyMedium.copyWith(
              color: colors.accent,
              fontWeight: FontWeight.w600,
            );
          }
          return AppTypography.bodyMedium.copyWith(color: colors.inkSoft);
        }),
      ),

      // ── Divider ────────────────────────────────────────────────────────────
      dividerTheme: DividerThemeData(
        color: colors.line,
        thickness: 1,
        space: 1,
      ),

      // ── Chip ───────────────────────────────────────────────────────────────
      chipTheme: ChipThemeData(
        backgroundColor: colors.bg2,
        selectedColor: colors.accent.withOpacity(0.12),
        labelStyle: AppTypography.labelMedium.copyWith(color: colors.ink),
        secondaryLabelStyle:
            AppTypography.labelMedium.copyWith(color: colors.accent),
        side: BorderSide(color: colors.line, width: 1),
        shape: const StadiumBorder(),
        padding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        elevation: 0,
        pressElevation: 0,
        iconTheme: IconThemeData(color: colors.inkMute, size: 16),
        deleteIconColor: colors.inkMute,
      ),

      // ── FloatingActionButton ───────────────────────────────────────────────
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: colors.accent,
        foregroundColor: Colors.white,
        elevation: 2,
        focusElevation: 4,
        hoverElevation: 4,
        highlightElevation: 6,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),

      // ── SnackBar ───────────────────────────────────────────────────────────
      snackBarTheme: SnackBarThemeData(
        backgroundColor:
            isDark ? colors.bg2 : const Color(0xFF1A2236),
        contentTextStyle:
            AppTypography.bodyMedium.copyWith(color: Colors.white),
        actionTextColor: colors.accent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(buttonRadius),
        ),
        elevation: 4,
      ),

      // ── Dialog ─────────────────────────────────────────────────────────────
      dialogTheme: DialogThemeData(
        backgroundColor: colors.bg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(cardRadius),
        ),
        titleTextStyle:
            AppTypography.headlineMedium.copyWith(color: colors.ink),
        contentTextStyle:
            AppTypography.bodyMedium.copyWith(color: colors.inkSoft),
      ),

      // ── BottomSheet ────────────────────────────────────────────────────────
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: colors.bg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        modalElevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(cardRadius),
          ),
        ),
        clipBehavior: Clip.antiAlias,
        dragHandleColor: colors.line,
        showDragHandle: true,
      ),

      // ── Switch ─────────────────────────────────────────────────────────────
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return colors.accent;
          return colors.inkMute;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return colors.accent.withOpacity(0.3);
          }
          return colors.line;
        }),
        trackOutlineColor:
            WidgetStateProperty.all(Colors.transparent),
      ),

      // ── Checkbox ───────────────────────────────────────────────────────────
      checkboxTheme: CheckboxThemeData(
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return colors.accent;
          return Colors.transparent;
        }),
        checkColor: WidgetStateProperty.all(Colors.white),
        side: BorderSide(color: colors.line, width: 1.5),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),

      // ── Radio ──────────────────────────────────────────────────────────────
      radioTheme: RadioThemeData(
        fillColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return colors.accent;
          return colors.inkMute;
        }),
      ),

      // ── Progress indicator ─────────────────────────────────────────────────
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: colors.accent,
        linearTrackColor: colors.bg2,
        circularTrackColor: colors.bg2,
        linearMinHeight: 4,
        borderRadius: BorderRadius.circular(pillRadius),
      ),

      // ── Tab Bar ────────────────────────────────────────────────────────────
      tabBarTheme: TabBarThemeData(
        labelColor: colors.ink,
        unselectedLabelColor: colors.inkMute,
        labelStyle: AppTypography.labelLarge,
        unselectedLabelStyle: AppTypography.labelLarge,
        indicatorColor: colors.accent,
        indicatorSize: TabBarIndicatorSize.label,
        dividerColor: colors.line,
        overlayColor: WidgetStateProperty.all(
          colors.accent.withOpacity(0.06),
        ),
      ),

      // ── Tooltip ────────────────────────────────────────────────────────────
      tooltipTheme: TooltipThemeData(
        decoration: BoxDecoration(
          color:
              isDark ? colors.bg2 : const Color(0xFF1A2236),
          borderRadius: BorderRadius.circular(8),
        ),
        textStyle: AppTypography.bodySmall.copyWith(
          color: isDark ? colors.ink : Colors.white,
        ),
        waitDuration: const Duration(milliseconds: 600),
        showDuration: const Duration(seconds: 2),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),

      // ── PopupMenu ──────────────────────────────────────────────────────────
      popupMenuTheme: PopupMenuThemeData(
        color: colors.bg,
        surfaceTintColor: Colors.transparent,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(buttonRadius),
        ),
        textStyle: AppTypography.bodyMedium.copyWith(color: colors.ink),
        labelTextStyle:
            WidgetStateProperty.all(
          AppTypography.bodyMedium.copyWith(color: colors.ink),
        ),
      ),

      // ── Icon ───────────────────────────────────────────────────────────────
      iconTheme: IconThemeData(color: colors.inkSoft, size: 24),
      primaryIconTheme: IconThemeData(color: colors.accent, size: 24),

      // ── Focus ring ─────────────────────────────────────────────────────────
      focusColor: colors.accent.withOpacity(0.12),
      hoverColor: colors.ink.withOpacity(0.04),
      highlightColor: colors.ink.withOpacity(0.06),
      splashColor: colors.accent.withOpacity(0.08),
    );
  }
}
