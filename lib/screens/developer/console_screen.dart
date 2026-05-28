import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

class ConsoleScreen extends StatefulWidget {
  const ConsoleScreen({super.key});

  @override
  State<ConsoleScreen> createState() => _ConsoleScreenState();
}

class _ConsoleScreenState extends State<ConsoleScreen> {
  // ── Kill switches ─────────────────────────────────────────────────────────
  final Map<String, bool> _switches = {
    'globalQrScanning': true,
    'deviceBinding': true,
    'qrRotation': true,
    'apiAccess': true,
  };

  // ── Live stats ────────────────────────────────────────────────────────────
  int _liveSessions = 7;
  int _scansPerMin = 34;
  int _p99LatencyMs = 142;

  // ── Terminal lines ────────────────────────────────────────────────────────
  final List<_LogLine> _lines = [
    _LogLine('[OK] System boot — ed25519 key loaded', _LogLevel.ok),
    _LogLine('[OK] Firebase connection established', _LogLevel.ok),
    _LogLine('[OK] QR rotation engine started  interval=7s', _LogLevel.ok),
    _LogLine('[WARN] geo_miss attempts: 3  sid=S-7C1B', _LogLevel.warn),
    _LogLine('[OK] token generated  sid=S-9F2A  v=0024', _LogLevel.ok),
  ];

  final ScrollController _scrollController = ScrollController();
  Timer? _statsTimer;
  Timer? _logTimer;

  static const _logTemplates = [
    ('[OK] token generated  sid=S-9F2A  v={v}', _LogLevel.ok),
    ('[OK] attestation passed  uid=21CS1108', _LogLevel.ok),
    ('[WARN] geo_miss attempts: {n}  sid=S-7C1B', _LogLevel.warn),
    ('[OK] scan accepted  uid=21CS1042  lat={l}ms', _LogLevel.ok),
    ('[ERR] attestation timeout  uid=21CS1067', _LogLevel.error),
    ('[OK] session created  sid=S-{s}  class=CS301', _LogLevel.ok),
    ('[WARN] high scan rate  sid=S-9F2A  rate={r}/min', _LogLevel.warn),
    ('[OK] QR rotated  sid=S-9F2A  v={v}', _LogLevel.ok),
  ];

  @override
  void initState() {
    super.initState();
    _statsTimer = Timer.periodic(const Duration(seconds: 3), (_) => _updateStats());
    _logTimer = Timer.periodic(const Duration(milliseconds: 2500), (_) => _addLogLine());
  }

  void _updateStats() {
    if (!mounted) return;
    final rng = math.Random();
    setState(() {
      _scansPerMin = 28 + rng.nextInt(20);
      _p99LatencyMs = 110 + rng.nextInt(80);
      if (rng.nextBool()) _liveSessions = 5 + rng.nextInt(6);
    });
  }

  void _addLogLine() {
    if (!mounted) return;
    final rng = math.Random();
    final template = _logTemplates[rng.nextInt(_logTemplates.length)];
    var msg = template.$1
        .replaceAll('{v}', rng.nextInt(100).toString().padLeft(4, '0'))
        .replaceAll('{n}', (rng.nextInt(8) + 1).toString())
        .replaceAll('{l}', (80 + rng.nextInt(200)).toString())
        .replaceAll('{s}', _randomHex(rng))
        .replaceAll('{r}', (25 + rng.nextInt(30)).toString());

    setState(() {
      _lines.add(_LogLine(msg, template.$2));
      if (_lines.length > 200) _lines.removeAt(0);
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String _randomHex(math.Random rng) {
    const chars = '0123456789ABCDEF';
    return List.generate(4, (_) => chars[rng.nextInt(16)]).join();
  }

  @override
  void dispose() {
    _statsTimer?.cancel();
    _logTimer?.cancel();
    _scrollController.dispose();
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
        titleSpacing: 20,
        title: Text(
          'Developer Console',
          style: AppTypography.displayMedium.copyWith(color: colors.ink, fontSize: 32),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        children: [
          const SizedBox(height: 4),

          // ── Kill switch section ──────────────────────────────────────────
          Text(
            'Kill Switches',
            style: AppTypography.titleLarge.copyWith(color: colors.ink, fontSize: 17),
          ),
          const SizedBox(height: 10),
          Container(
            decoration: BoxDecoration(
              color: colors.bg2,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colors.line),
            ),
            child: Column(
              children: [
                _KillSwitchRow(
                  label: 'Global QR Scanning',
                  description: 'Allow students to scan attendance QR codes',
                  value: _switches['globalQrScanning']!,
                  colors: colors,
                  onChanged: (v) => setState(() => _switches['globalQrScanning'] = v),
                  isFirst: true,
                ),
                Divider(height: 1, color: colors.line),
                _KillSwitchRow(
                  label: 'Device Binding',
                  description: 'Enforce one-device-per-student constraint',
                  value: _switches['deviceBinding']!,
                  colors: colors,
                  onChanged: (v) => setState(() => _switches['deviceBinding'] = v),
                ),
                Divider(height: 1, color: colors.line),
                _KillSwitchRow(
                  label: 'QR Rotation',
                  description: 'Rotate QR tokens on interval to prevent replay',
                  value: _switches['qrRotation']!,
                  colors: colors,
                  onChanged: (v) => setState(() => _switches['qrRotation'] = v),
                ),
                Divider(height: 1, color: colors.line),
                _KillSwitchRow(
                  label: 'API Access',
                  description: 'Allow all external API calls to proceed',
                  value: _switches['apiAccess']!,
                  colors: colors,
                  onChanged: (v) => setState(() => _switches['apiAccess'] = v),
                  isLast: true,
                ),
              ],
            ),
          ),

          const SizedBox(height: 28),

          // ── Live stats section ───────────────────────────────────────────
          Text(
            'Live Stats',
            style: AppTypography.titleLarge.copyWith(color: colors.ink, fontSize: 17),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _LiveStatTile(
                  label: 'LIVE SESSIONS',
                  value: '$_liveSessions',
                  colors: colors,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _LiveStatTile(
                  label: 'SCANS/MIN',
                  value: '$_scansPerMin',
                  colors: colors,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _LiveStatTile(
                  label: 'P99 LATENCY',
                  value: '${_p99LatencyMs}ms',
                  colors: colors,
                  valueColor: _p99LatencyMs > 180 ? colors.warning : null,
                ),
              ),
            ],
          ),

          const SizedBox(height: 28),

          // ── Terminal output ──────────────────────────────────────────────
          Text(
            'System Log',
            style: AppTypography.titleLarge.copyWith(color: colors.ink, fontSize: 17),
          ),
          const SizedBox(height: 10),
          Container(
            height: 280,
            decoration: BoxDecoration(
              color: colors.bg2,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colors.line),
            ),
            padding: const EdgeInsets.all(16),
            child: ListView.builder(
              controller: _scrollController,
              itemCount: _lines.length,
              itemBuilder: (ctx, i) {
                final line = _lines[i];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 1),
                  child: Text(
                    line.message,
                    style: TextStyle(
                      fontFamily: AppTypography.monoFamily,
                      fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                      fontSize: 12,
                      color: switch (line.level) {
                        _LogLevel.ok => const Color(0xFF22C55E),
                        _LogLevel.warn => const Color(0xFFF59E0B),
                        _LogLevel.error => const Color(0xFFEF4444),
                      },
                      height: 1.6,
                    ),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

// ── Kill switch row ───────────────────────────────────────────────────────────

class _KillSwitchRow extends StatelessWidget {
  const _KillSwitchRow({
    required this.label,
    required this.description,
    required this.value,
    required this.colors,
    required this.onChanged,
    this.isFirst = false,
    this.isLast = false,
  });

  final String label;
  final String description;
  final bool value;
  final AppColors colors;
  final ValueChanged<bool> onChanged;
  final bool isFirst;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    final bgColor = value ? Colors.transparent : colors.error.withOpacity(0.04);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      height: 52,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.vertical(
          top: isFirst ? const Radius.circular(15) : Radius.zero,
          bottom: isLast ? const Radius.circular(15) : Radius.zero,
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTypography.bodyMedium.copyWith(
                    color: value ? colors.ink : colors.error,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  description,
                  style: AppTypography.bodySmall.copyWith(
                    color: colors.inkMute,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: colors.live,
            activeTrackColor: colors.live.withOpacity(0.3),
            inactiveThumbColor: colors.error,
            inactiveTrackColor: colors.error.withOpacity(0.2),
          ),
        ],
      ),
    );
  }
}

// ── Live stat tile ────────────────────────────────────────────────────────────

class _LiveStatTile extends StatelessWidget {
  const _LiveStatTile({
    required this.label,
    required this.value,
    required this.colors,
    this.valueColor,
  });

  final String label;
  final String value;
  final AppColors colors;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
      decoration: BoxDecoration(
        color: colors.bg2,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontFamily: AppTypography.monoFamily,
              fontFamilyFallback: AppTypography.monoFontFamilyFallback,
              fontSize: 9,
              color: colors.inkMute,
              letterSpacing: 0.5,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: AppTypography.displaySmall.copyWith(
              fontFamily: AppTypography.displayFamily,
              color: valueColor ?? colors.ink,
              fontSize: 32,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Data classes ──────────────────────────────────────────────────────────────

enum _LogLevel { ok, warn, error }

class _LogLine {
  const _LogLine(this.message, this.level);
  final String message;
  final _LogLevel level;
}
