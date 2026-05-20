import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

class LiveScansScreen extends StatefulWidget {
  const LiveScansScreen({super.key, required this.sessionId});
  final String sessionId;

  @override
  State<LiveScansScreen> createState() => _LiveScansScreenState();
}

class _LiveScansScreenState extends State<LiveScansScreen> {
  final List<_ScanRow> _rows = [];
  Timer? _timer;
  int _markedCount = 42;
  int _pendingCount = 14;
  int _flaggedCount = 0;

  static const _names = [
    'Aarav Reddy', 'Priya Sharma', 'Rohit Kumar', 'Meera Iyer',
    'Karan Mehta', 'Divya Nair', 'Arjun Singh', 'Sneha Patel',
    'Vikas Gupta', 'Ananya Bose',
  ];
  static const _rolls = [
    '21CS1108', '21CS1042', '21CS1067', '21CS1099', '21CS1023',
    '21CS1011', '21CS1034', '21CS1056', '21CS1078', '21CS1090',
  ];

  @override
  void initState() {
    super.initState();
    // Pre-populate with some data
    final rng = math.Random(42);
    for (int i = 0; i < 8; i++) {
      final idx = rng.nextInt(_names.length);
      _rows.add(_ScanRow(
        name: _names[idx],
        rollNumber: _rolls[idx],
        timestamp: '10:${(14 + i).toString().padLeft(2, '0')}:${(rng.nextInt(59)).toString().padLeft(2, '0')}',
        status: rng.nextDouble() < 0.85 ? _ScanStatus.accepted : _ScanStatus.rejected,
        latencyMs: 100 + rng.nextInt(250),
      ));
    }
    _timer = Timer.periodic(const Duration(seconds: 2), (_) => _addScan());
  }

  void _addScan() {
    if (!mounted) return;
    final rng = math.Random();
    final idx = rng.nextInt(_names.length);
    final isRejected = rng.nextDouble() < 0.1;
    final now = DateTime.now();
    setState(() {
      _rows.insert(
        0,
        _ScanRow(
          name: _names[idx],
          rollNumber: _rolls[idx],
          timestamp: '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}',
          status: isRejected ? _ScanStatus.rejected : _ScanStatus.accepted,
          latencyMs: 80 + rng.nextInt(300),
        ),
      );
      if (_rows.length > 100) _rows.removeLast();
      if (isRejected) {
        _flaggedCount++;
      } else {
        _markedCount++;
        if (_pendingCount > 0) _pendingCount--;
      }
    });
  }

  Future<void> _refresh() async {
    await Future.delayed(const Duration(seconds: 1));
    _addScan();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.bg,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colors.ink, size: 20),
          onPressed: () => Navigator.pop(context),
          padding: EdgeInsets.zero,
        ),
        titleSpacing: 0,
        title: Text(
          'Live Scans',
          style: AppTypography.titleLarge.copyWith(color: colors.ink, fontSize: 17),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 20),
            child: Text(
              widget.sessionId,
              style: TextStyle(
                fontFamily: AppTypography.monoFamily,
                fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                fontSize: 11,
                color: colors.inkMute,
                letterSpacing: 0.4,
              ),
            ),
          ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Header stats row ─────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
            child: Row(
              children: [
                Expanded(child: _HeaderStat(value: '$_markedCount', label: 'Marked', colors: colors, valueColor: colors.live)),
                Expanded(child: _HeaderStat(value: '$_pendingCount', label: 'Pending', colors: colors, valueColor: colors.warning)),
                Expanded(child: _HeaderStat(value: '$_flaggedCount', label: 'Flagged', colors: colors, valueColor: colors.error)),
              ],
            ),
          ),

          Divider(height: 1, color: colors.line),

          // ── Scan list ────────────────────────────────────────────────────
          Expanded(
            child: RefreshIndicator(
              color: colors.accent,
              backgroundColor: colors.bg2,
              onRefresh: _refresh,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 4),
                itemCount: _rows.length,
                itemBuilder: (ctx, i) => _ScanRowWidget(row: _rows[i], colors: colors),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Header stat ───────────────────────────────────────────────────────────────

class _HeaderStat extends StatelessWidget {
  const _HeaderStat({
    required this.value,
    required this.label,
    required this.colors,
    required this.valueColor,
  });

  final String value;
  final String label;
  final AppColors colors;
  final Color valueColor;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: AppTypography.headlineLarge.copyWith(
            fontFamily: AppTypography.displayFamily,
            color: valueColor,
            fontSize: 22,
            fontWeight: FontWeight.w600,
          ),
        ),
        Text(
          label,
          style: AppTypography.bodySmall.copyWith(
            color: colors.inkMute,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}

// ── Scan row widget ───────────────────────────────────────────────────────────

class _ScanRowWidget extends StatelessWidget {
  const _ScanRowWidget({required this.row, required this.colors});
  final _ScanRow row;
  final AppColors colors;

  @override
  Widget build(BuildContext context) {
    final isFlagged = row.status == _ScanStatus.rejected;
    final initials = row.name.split(' ').take(2).map((p) => p[0]).join();

    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: isFlagged ? colors.error.withOpacity(0.05) : Colors.transparent,
        border: Border(
          bottom: BorderSide(color: colors.line),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: colors.accent.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                initials,
                style: AppTypography.labelSmall.copyWith(
                  color: colors.accent,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),

          // Name + roll number
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  row.name,
                  style: AppTypography.bodyMedium.copyWith(
                    color: colors.ink,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  row.rollNumber,
                  style: TextStyle(
                    fontFamily: AppTypography.monoFamily,
                    fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                    fontSize: 12,
                    color: colors.inkMute,
                  ),
                ),
              ],
            ),
          ),

          // Timestamp + status pill + latency
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _StatusPill(status: row.status, colors: colors),
                  const SizedBox(width: 8),
                  Text(
                    row.timestamp,
                    style: TextStyle(
                      fontFamily: AppTypography.monoFamily,
                      fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                      fontSize: 11,
                      color: colors.inkMute,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 2),
              Text(
                '${row.latencyMs}ms',
                style: TextStyle(
                  fontFamily: AppTypography.monoFamily,
                  fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                  fontSize: 10,
                  color: colors.inkMute.withOpacity(0.6),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Status pill ───────────────────────────────────────────────────────────────

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.status, required this.colors});
  final _ScanStatus status;
  final AppColors colors;

  @override
  Widget build(BuildContext context) {
    final (label, color) = switch (status) {
      _ScanStatus.accepted => ('ACCEPTED', colors.live),
      _ScanStatus.rejected => ('REJECTED', colors.error),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: AppTypography.labelSmall.copyWith(
          color: color,
          fontSize: 9,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.4,
        ),
      ),
    );
  }
}

// ── Data classes ──────────────────────────────────────────────────────────────

enum _ScanStatus { accepted, rejected }

class _ScanRow {
  const _ScanRow({
    required this.name,
    required this.rollNumber,
    required this.timestamp,
    required this.status,
    required this.latencyMs,
  });

  final String name;
  final String rollNumber;
  final String timestamp;
  final _ScanStatus status;
  final int latencyMs;
}
