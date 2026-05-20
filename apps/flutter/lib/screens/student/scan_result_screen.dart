import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/attendance_service.dart';
import '../../theme/app_colors.dart';

class ScanResultScreen extends StatelessWidget {
  final ScanResult result;
  const ScanResultScreen({super.key, required this.result});

  @override
  Widget build(BuildContext context) {
    return result.ok ? _SuccessView(result: result) : _RejectionView(result: result);
  }
}

class _SuccessView extends StatelessWidget {
  final ScanResult result;
  const _SuccessView({required this.result});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.live.withValues(alpha: 0.08),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80, height: 80,
                decoration: BoxDecoration(
                  color: c.live.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: c.live.withValues(alpha: 0.4), width: 2),
                ),
                child: Icon(Icons.check, color: c.live, size: 40),
              ),
              const SizedBox(height: 24),
              Text('Marked Present', style: GoogleFonts.cormorantGaramond(
                fontSize: 32, fontWeight: FontWeight.w400, color: c.ink,
                height: 1.05, letterSpacing: 32 * -0.02,
              )),
              const SizedBox(height: 8),
              Text(result.className ?? 'Session', style: GoogleFonts.dmSans(
                fontSize: 17, fontWeight: FontWeight.w500, color: c.ink)),
              const SizedBox(height: 8),
              if (result.newAttendance != null)
                Text(result.newAttendance!, style: GoogleFonts.dmSans(
                  fontSize: 13, color: c.live)),
              const SizedBox(height: 8),
              if (result.sessionId != null)
                Text(result.sessionId!, style: TextStyle(
                  fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                  fontSize: 11, color: c.inkMute)),
              const SizedBox(height: 48),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.go('/student/home'),
                  child: const Text('Done'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RejectionView extends StatelessWidget {
  final ScanResult result;
  bool _expanded = false;

  _RejectionView({required this.result});

  String get _plainEnglish {
    switch (result.errorCode) {
      case 'TOKEN_EXPIRED': return 'The QR token has expired. Ask your teacher to show the latest QR and scan again.';
      case 'TOKEN_REUSED': return 'This QR token has already been used. Each token is single-use.';
      case 'TOKEN_INVALID': return 'The QR code could not be verified. Make sure you are scanning the correct Attendly QR.';
      case 'GEO_MISS': return 'You are outside the classroom geofence. Move inside the room and try again.';
      case 'FAKE_GPS': return 'Mock location detected. Disable any GPS spoofing apps and try again.';
      case 'DEVICE_MISMATCH': return 'This is not your bound device. Attendance must be scanned from your registered device.';
      case 'ALREADY_MARKED': return 'You are already marked present for this session.';
      case 'SESSION_CLOSED': return 'This session has ended. Contact your teacher if you need attendance marked.';
      default: return result.errorMessage ?? 'An error occurred.';
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.error.withValues(alpha: 0.06),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 80, height: 80,
                  decoration: BoxDecoration(
                    color: c.error.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                    border: Border.all(color: c.error.withValues(alpha: 0.4), width: 2),
                  ),
                  child: Icon(Icons.close, color: c.error, size: 40),
                ),
              ),
              const SizedBox(height: 24),
              if (result.errorCode != null)
                Center(
                  child: Text('E-${result.errorCode!.replaceAll('_', '')}',
                    style: TextStyle(fontFamily: 'Courier New',
                      fontFamilyFallback: const ['SF Mono', 'monospace'],
                      fontSize: 22, fontWeight: FontWeight.w600, color: c.ink)),
                ),
              const SizedBox(height: 8),
              Center(
                child: Text(
                  _getTitle(result.errorCode ?? ''),
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 28, fontWeight: FontWeight.w400, color: c.ink,
                    height: 1.1, letterSpacing: -0.5,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 12),
              Text(_plainEnglish, style: GoogleFonts.dmSans(fontSize: 15, color: c.inkMute, height: 1.65)),
              const SizedBox(height: 24),
              StatefulBuilder(builder: (ctx, setSt) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  InkWell(
                    onTap: () => setSt(() => _expanded = !_expanded),
                    child: Row(
                      children: [
                        Text('Other possible reasons', style: GoogleFonts.dmSans(
                          fontSize: 13, color: c.inkMute, fontWeight: FontWeight.w500)),
                        const SizedBox(width: 4),
                        Icon(_expanded ? Icons.expand_less : Icons.expand_more, size: 16, color: c.inkMute),
                      ],
                    ),
                  ),
                  if (_expanded) ...[
                    const SizedBox(height: 8),
                    ..._otherReasons.map((r) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('• ', style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute)),
                          Expanded(child: Text(r, style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute, height: 1.5))),
                        ],
                      ),
                    )),
                  ],
                ],
              )),
              const SizedBox(height: 36),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.go('/student/scan'),
                  child: const Text('Try Again'),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => context.go('/student/home'),
                  child: const Text('Back to Home'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getTitle(String code) {
    switch (code) {
      case 'TOKEN_EXPIRED': return 'Token expired';
      case 'GEO_MISS': return 'Outside geofence';
      case 'FAKE_GPS': return 'Mock location detected';
      case 'DEVICE_MISMATCH': return 'Device mismatch';
      case 'ALREADY_MARKED': return 'Already marked';
      case 'SESSION_CLOSED': return 'Session ended';
      default: return 'Scan rejected';
    }
  }

  static const _otherReasons = [
    'Token may have expired — scan faster next time',
    'GPS signal weak — move away from walls',
    'Session may have ended',
    'Your device binding may need renewal',
  ];
}
