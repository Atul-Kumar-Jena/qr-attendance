import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../theme/app_colors.dart';
import '../../widgets/status_pill.dart';

class LiveQrScreen extends StatefulWidget {
  final String sessionId;
  const LiveQrScreen({super.key, required this.sessionId});

  @override
  State<LiveQrScreen> createState() => _LiveQrScreenState();
}

class _LiveQrScreenState extends State<LiveQrScreen>
    with TickerProviderStateMixin {
  late AnimationController _countdown;
  late AnimationController _flipCtrl;
  late Animation<double> _flipAnim;
  Timer? _rotationTimer;
  int _version = 1;
  int _markedCount = 42;
  int _pendingCount = 14;
  static const _interval = 7;
  String _currentToken = 'aqr:v1:dGVzdA.eyJzaWQiOiJTLTlGMkEifQ.abc123';

  @override
  void initState() {
    super.initState();
    _countdown = AnimationController(
      vsync: this, duration: const Duration(seconds: _interval))
      ..repeat();
    _flipCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 150));
    _flipAnim = Tween<double>(begin: 0, end: 1).animate(_flipCtrl);
    _startRotation();
  }

  void _startRotation() {
    _rotationTimer = Timer.periodic(const Duration(seconds: _interval), (_) {
      _flipCtrl.forward().then((_) {
        setState(() {
          _version++;
          _currentToken = 'aqr:v1:${DateTime.now().millisecondsSinceEpoch.toRadixString(36)}.payload.sig';
        });
        _flipCtrl.reverse();
      });
    });
  }

  @override
  void dispose() {
    _countdown.dispose();
    _flipCtrl.dispose();
    _rotationTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.bg,
      appBar: AppBar(
        backgroundColor: c.bg, elevation: 0,
        leading: IconButton(icon: Icon(Icons.arrow_back, color: c.ink), onPressed: () => context.pop()),
        title: Text('Live QR', style: GoogleFonts.cormorantGaramond(
          fontSize: 22, color: c.ink, fontWeight: FontWeight.w500)),
        actions: [
          TextButton(
            onPressed: () => _showEndDialog(context),
            child: Text('End', style: GoogleFonts.dmSans(fontSize: 14, color: c.error, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 8),
            Text(widget.sessionId, style: TextStyle(fontFamily: 'Courier New',
              fontFamilyFallback: const ['SF Mono', 'monospace'],
              fontSize: 11, color: c.inkMute)),
            const SizedBox(height: 4),
            Text('Operating Systems · LH-2', style: GoogleFonts.dmSans(
              fontSize: 17, fontWeight: FontWeight.w600, color: c.ink)),
            const SizedBox(height: 24),
            // QR with countdown ring
            Center(
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Countdown ring
                  AnimatedBuilder(
                    animation: _countdown,
                    builder: (_, __) => SizedBox(
                      width: 288, height: 288,
                      child: CustomPaint(
                        painter: _CountdownRingPainter(
                          progress: 1 - _countdown.value,
                          color: c.accent,
                        ),
                      ),
                    ),
                  ),
                  // QR code
                  Container(
                    width: 264, height: 264,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: c.bg2,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: c.line),
                    ),
                    child: AnimatedBuilder(
                      animation: _flipAnim,
                      builder: (_, child) => Opacity(
                        opacity: 1 - (_flipAnim.value * 2 - 1).abs(),
                        child: QrImageView(
                          data: _currentToken,
                          version: QrVersions.auto,
                          backgroundColor: Colors.transparent,
                          eyeStyle: QrEyeStyle(eyeShape: QrEyeShape.square, color: c.ink),
                          dataModuleStyle: QrDataModuleStyle(
                            dataModuleShape: QrDataModuleShape.square,
                            color: c.ink,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Text('#${_version.toString().padLeft(4, '0')} · ${_interval}s window', style: TextStyle(
              fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
              fontSize: 11, color: c.inkMute)),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _ScanStat(value: '$_markedCount', label: 'MARKED', color: AppColors.of(context).live),
                  Container(width: 1, height: 40, color: c.line),
                  _ScanStat(value: '$_pendingCount', label: 'PENDING', color: c.warning),
                  Container(width: 1, height: 40, color: c.line),
                  _ScanStat(value: '0', label: 'FLAGGED', color: c.error),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: _LiveScansList(markedCount: _markedCount),
            ),
          ],
        ),
      ),
    );
  }

  void _showEndDialog(BuildContext context) {
    final c = AppColors.of(context);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: c.bg,
        title: Text('End session?', style: GoogleFonts.cormorantGaramond(fontSize: 22, color: c.ink)),
        content: Text('$_markedCount/${ _markedCount + _pendingCount} students marked. This cannot be undone.',
          style: GoogleFonts.dmSans(fontSize: 14, color: c.inkMute)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () { Navigator.pop(ctx); context.go('/teacher/dashboard'); },
            child: Text('End Session', style: TextStyle(color: c.error)),
          ),
        ],
      ),
    );
  }
}

class _ScanStat extends StatelessWidget {
  final String value, label;
  final Color color;
  const _ScanStat({required this.value, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Column(children: [
      Text(value, style: GoogleFonts.cormorantGaramond(fontSize: 28, fontWeight: FontWeight.w500, color: color)),
      Text(label, style: TextStyle(fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
        fontSize: 10, color: c.inkMute, letterSpacing: 0.18)),
    ]);
  }
}

class _LiveScansList extends StatefulWidget {
  final int markedCount;
  const _LiveScansList({required this.markedCount});

  @override
  State<_LiveScansList> createState() => _LiveScansListState();
}

class _LiveScansListState extends State<_LiveScansList> {
  final _scans = <_ScanEvent>[
    _ScanEvent('Aarav Reddy', '21CS1108', '10:14:38', 184, true),
    _ScanEvent('Priya Sharma', '21CS1109', '10:14:22', 201, true),
    _ScanEvent('Rohan Mehta', '21CS1110', '10:14:08', 156, true),
    _ScanEvent('Akash Singh', '21CS1111', '10:13:55', 312, false),
  ];

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      itemCount: _scans.length,
      separatorBuilder: (_, __) => Container(height: 1, color: c.line),
      itemBuilder: (ctx, i) {
        final scan = _scans[i];
        return Container(
          height: 52,
          color: scan.accepted ? null : c.error.withValues(alpha: 0.06),
          child: Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: c.accent.withValues(alpha: 0.15),
                child: Text(scan.name[0], style: GoogleFonts.cormorantGaramond(
                  fontSize: 15, fontWeight: FontWeight.w600, color: c.accent)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(scan.name, style: GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w500, color: c.ink)),
                    Text(scan.roll, style: TextStyle(fontFamily: 'Courier New',
                      fontFamilyFallback: const ['SF Mono', 'monospace'],
                      fontSize: 11, color: c.inkMute)),
                  ],
                ),
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(scan.time, style: TextStyle(fontFamily: 'Courier New',
                    fontFamilyFallback: const ['SF Mono', 'monospace'],
                    fontSize: 11, color: c.inkMute)),
                  Text('${scan.latencyMs}ms', style: TextStyle(fontFamily: 'Courier New',
                    fontFamilyFallback: const ['SF Mono', 'monospace'],
                    fontSize: 10, color: c.inkMute.withValues(alpha: 0.6))),
                ],
              ),
              const SizedBox(width: 8),
              StatusPill(scan.accepted ? PillStatus.accepted : PillStatus.rejected),
            ],
          ),
        );
      },
    );
  }
}

class _ScanEvent {
  final String name, roll, time;
  final int latencyMs;
  final bool accepted;
  const _ScanEvent(this.name, this.roll, this.time, this.latencyMs, this.accepted);
}

class _CountdownRingPainter extends CustomPainter {
  final double progress;
  final Color color;
  const _CountdownRingPainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 4;
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      2 * math.pi * progress,
      false,
      paint,
    );
  }

  @override
  bool shouldRepaint(_CountdownRingPainter old) => old.progress != progress;
}
