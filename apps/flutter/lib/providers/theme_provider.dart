import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

// ── ThemeProvider ──────────────────────────────────────────────────────────

/// Persists and exposes the user's preferred [ThemeMode].
///
/// The preference is stored under the key `'attendly-theme-mode'` in
/// [SharedPreferences] and is loaded asynchronously on construction.
///
/// Usage:
/// ```dart
/// // In MultiProvider / ChangeNotifierProvider
/// ChangeNotifierProvider(create: (_) => ThemeProvider())
///
/// // In a widget
/// final tp = context.watch<ThemeProvider>();
/// MaterialApp(themeMode: tp.mode, ...)
/// ```
class ThemeProvider extends ChangeNotifier {
  ThemeProvider() {
    _loadFromPrefs();
  }

  static const _kKey = 'attendly-theme-mode';

  ThemeMode _mode = ThemeMode.system;
  bool _initialised = false;

  // ── State ──────────────────────────────────────────────────────────────────

  ThemeMode get mode => _mode;
  bool get initialised => _initialised;
  bool get isDark => _mode == ThemeMode.dark;
  bool get isLight => _mode == ThemeMode.light;
  bool get isSystem => _mode == ThemeMode.system;

  // ── Resolves the effective dark/light against the platform preference ───────

  /// Returns `true` if the effective appearance is dark, resolving
  /// [ThemeMode.system] against the current [BuildContext].
  bool effectiveIsDark(BuildContext context) {
    if (_mode == ThemeMode.system) {
      return MediaQuery.platformBrightnessOf(context) == Brightness.dark;
    }
    return _mode == ThemeMode.dark;
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  /// Sets the theme mode and persists it.
  Future<void> setMode(ThemeMode mode) async {
    if (_mode == mode) return;
    _mode = mode;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kKey, _serialize(mode));
  }

  /// Toggles between [ThemeMode.light] and [ThemeMode.dark].
  /// If currently [ThemeMode.system], switches to [ThemeMode.dark].
  Future<void> toggle() async {
    await setMode(_mode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark);
  }

  /// Resets to [ThemeMode.system] and removes the persisted preference.
  Future<void> reset() async {
    _mode = ThemeMode.system;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kKey);
  }

  // ── Persistence ────────────────────────────────────────────────────────────

  Future<void> _loadFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_kKey);
      if (saved != null) {
        _mode = _deserialize(saved);
      }
    } catch (_) {
      // If SharedPreferences fails, fall back to system default silently
    } finally {
      _initialised = true;
      notifyListeners();
    }
  }

  static String _serialize(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.dark:
        return 'dark';
      case ThemeMode.light:
        return 'light';
      case ThemeMode.system:
        return 'system';
    }
  }

  static ThemeMode _deserialize(String value) {
    switch (value) {
      case 'dark':
        return ThemeMode.dark;
      case 'light':
        return ThemeMode.light;
      default:
        return ThemeMode.system;
    }
  }
}
