import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:geolocator/geolocator.dart';
import '../../theme/app_colors.dart';
import '../../services/attendance_service.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  MobileScannerController? _scanner;
  bool _processing = false;
  int _tokenNum = 24;

  @override
  void initState() {
    super.initState();
    _scanner = MobileScannerController(
      detectionSpeed: DetectionSpeed.noDuplicates,
      facing: CameraFacing.back,
    );
  }

  @override
  void dispose() {
    _scanner?.dispose();
    super.dispose();
  }

  Future<void> _onDetect(BarcodeCapture capture) async {
    if (_processing) return;
    final barcode = capture.barcodes.firstOrNull;
    if (barcode == null || barcode.rawValue == null) return;

    final token = barcode.rawValue!;
    if (!token.startsWith('aqr:v1:')) return;

    setState(() => _processing = true);
    _scanner?.stop();

    try {
      Position? pos;
      try {
        pos = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
        );
      } catch (_) {}

      final result = await AttendanceService().submitScan(
        token: token,
        studentId: 'current-user-id',
        deviceHwid: 'device-hwid',
        latitude: pos?.latitude ?? 0,
        longitude: pos?.longitude ?? 0,
        accuracy: pos?.accuracy ?? 0,
        idToken: 'firebase-id-token',
      );

      if (mounted) {
        context.push('/student/result', extra: result);
      }
    } finally {
      if (mounted) setState(() => _processing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          MobileScanner(
            controller: _scanner!,
            onDetect: _onDetect,
          ),
          // Session info header
          Positioned(
            top: 0, left: 0, right: 0,
            child: Container(
              color: Colors.black.withValues(alpha: 0.7),
              padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 12, 20, 12),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white, size: 22),
                    onPressed: () => context.pop(),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Operating Systems', style: GoogleFonts.dmSans(
                          fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white)),
                        Text('LH-2 · CS-301', style: TextStyle(
                          fontFamily: 'Courier New', fontSize: 11, color: Colors.white60)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Center guide box
          Center(
            child: Container(
              width: 240, height: 240,
              decoration: BoxDecoration(
                border: Border.all(color: c.accent, width: 2),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
          // Processing overlay
          if (_processing)
            Container(
              color: Colors.black.withValues(alpha: 0.6),
              child: Center(
                child: CircularProgressIndicator(color: c.accent),
              ),
            ),
          // Token counter bottom
          Positioned(
            bottom: 0, left: 0, right: 0,
            child: Container(
              color: Colors.black.withValues(alpha: 0.7),
              padding: EdgeInsets.fromLTRB(20, 12, 20, MediaQuery.of(context).padding.bottom + 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('#${_tokenNum.toString().padLeft(4, '0')} · 7s window',
                    style: const TextStyle(fontFamily: 'Courier New',
                      fontFamilyFallback: ['SF Mono', 'monospace'],
                      fontSize: 11, color: Colors.white60)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
