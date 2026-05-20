import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

// ── MonoDataRow ────────────────────────────────────────────────────────────

/// A key-value row where the value is rendered in a monospace font.
///
/// Used for displaying technical data: session IDs, device IDs, tokens,
/// GPS coordinates, timestamps, etc.
///
/// Anatomy:
/// ```
/// LABEL                        value in mono
/// ```
///
/// Design system:
///   label  : 11 sp, mono font, ink-mute, letter-spacing 0.5
///   value  : 12–13 sp, mono font, ink (or [valueColor])
///   layout : space-between Row, 6 px vertical padding
///
/// Optionally shows a copy-to-clipboard icon when [copyable] is true.
class MonoDataRow extends StatelessWidget {
  const MonoDataRow({
    super.key,
    required this.label,
    required this.value,
    this.valueColor,
    this.copyable = false,
    this.onTap,
    this.padding,
  });

  final String label;
  final String value;

  /// Override the value text colour.
  final Color? valueColor;

  /// When true, long-pressing (or tapping the copy icon) copies [value] to
  /// the clipboard and shows a [SnackBar].
  final bool copyable;

  /// Optional tap callback on the whole row.
  final VoidCallback? onTap;

  /// Row padding. Defaults to `EdgeInsets.symmetric(vertical: 6)`.
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);

    Widget row = Padding(
      padding: padding ?? const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // ── Label ──────────────────────────────────────────────────────
          Text(
            label.toUpperCase(),
            style: TextStyle(
              fontFamily: AppTypography.monoFamily,
              fontFamilyFallback: const [
                'SF Mono',
                'Fira Code',
                'Menlo',
                'Consolas',
                'monospace',
              ],
              fontSize: 11,
              fontWeight: FontWeight.w400,
              color: c.inkMute,
              letterSpacing: 0.5,
              height: 1.4,
            ),
          ),
          const Spacer(),

          // ── Value ──────────────────────────────────────────────────────
          Flexible(
            child: Text(
              value,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.right,
              style: TextStyle(
                fontFamily: AppTypography.monoFamily,
                fontFamilyFallback: const [
                  'SF Mono',
                  'Fira Code',
                  'Menlo',
                  'Consolas',
                  'monospace',
                ],
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: valueColor ?? c.ink,
                letterSpacing: -0.1,
                height: 1.4,
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),
          ),

          // ── Copy icon ──────────────────────────────────────────────────
          if (copyable) ...[
            const SizedBox(width: 8),
            _CopyButton(value: value),
          ],
        ],
      ),
    );

    if (onTap != null) {
      row = GestureDetector(onTap: onTap, child: row);
    } else if (copyable) {
      row = GestureDetector(
        onLongPress: () => _copyToClipboard(context, value),
        child: row,
      );
    }

    return row;
  }

  static void _copyToClipboard(BuildContext context, String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Copied to clipboard'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}

// ── _CopyButton ────────────────────────────────────────────────────────────

class _CopyButton extends StatefulWidget {
  const _CopyButton({required this.value});
  final String value;

  @override
  State<_CopyButton> createState() => _CopyButtonState();
}

class _CopyButtonState extends State<_CopyButton> {
  bool _copied = false;

  Future<void> _copy() async {
    await Clipboard.setData(ClipboardData(text: widget.value));
    if (!mounted) return;
    setState(() => _copied = true);
    await Future<void>.delayed(const Duration(seconds: 2));
    if (mounted) setState(() => _copied = false);
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return GestureDetector(
      onTap: _copy,
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 200),
        child: Icon(
          _copied ? Icons.check_rounded : Icons.copy_rounded,
          key: ValueKey(_copied),
          size: 14,
          color: _copied ? c.live : c.inkMute,
        ),
      ),
    );
  }
}

// ── MonoDataBlock ──────────────────────────────────────────────────────────

/// A vertically-stacked group of [MonoDataRow]s separated by subtle dividers.
///
/// ```dart
/// MonoDataBlock(rows: [
///   MonoDataRowData(label: 'Session ID', value: 'S-1A2B3C4D'),
///   MonoDataRowData(label: 'Device',     value: 'iPhone 15 Pro'),
///   MonoDataRowData(label: 'Location',   value: '28.6139, 77.2090'),
/// ])
/// ```
class MonoDataBlock extends StatelessWidget {
  const MonoDataBlock({
    super.key,
    required this.rows,
    this.showDividers = true,
  });

  final List<MonoDataRowData> rows;
  final bool showDividers;

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Column(
      children: [
        for (int i = 0; i < rows.length; i++) ...[
          MonoDataRow(
            label: rows[i].label,
            value: rows[i].value,
            valueColor: rows[i].valueColor,
            copyable: rows[i].copyable,
          ),
          if (showDividers && i < rows.length - 1)
            Divider(color: c.line, height: 1, thickness: 1),
        ],
      ],
    );
  }
}

// ── MonoDataRowData ────────────────────────────────────────────────────────

/// Data class for use with [MonoDataBlock].
class MonoDataRowData {
  const MonoDataRowData({
    required this.label,
    required this.value,
    this.valueColor,
    this.copyable = false,
  });

  final String label;
  final String value;
  final Color? valueColor;
  final bool copyable;
}
