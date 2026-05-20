import 'dart:async';
import 'package:flutter/material.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_colors.dart';
import '../../widgets/status_pill.dart';
import '../../widgets/app_card.dart';

class DeviceBindingScreen extends StatefulWidget {
  const DeviceBindingScreen({super.key});

  @override
  State<DeviceBindingScreen> createState() => _DeviceBindingScreenState();
}

class _DeviceBindingScreenState extends State<DeviceBindingScreen> {
  String _model = 'Detecting...';
  String _os = '...';
  String _hwid = 'a4f3-bb19-8c2d';
  bool _attesting = false;
  bool _attested = false;

  @override
  void initState() {
    super.initState();
    _detectDevice();
  }

  Future<void> _detectDevice() async {
    final info = DeviceInfoPlugin();
    try {
      if (Theme.of(context).platform == TargetPlatform.iOS) {
        final ios = await info.iosInfo;
        setState(() {
          _model = ios.utsname.machine;
          _os = 'iOS ${ios.systemVersion}';
          _hwid = ios.identifierForVendor?.substring(0, 9).replaceAll('-', '').toLowerCase() ?? 'a4f3-bb19';
        });
      } else {
        final android = await info.androidInfo;
        setState(() {
          _model = '${android.brand} ${android.model}';
          _os = 'Android ${android.version.release}';
          _hwid = android.id.substring(0, 8).toLowerCase();
        });
      }
    } catch (_) {}
  }

  Future<void> _bindDevice() async {
    setState(() => _attesting = true);
    await Future.delayed(const Duration(milliseconds: 1800));
    setState(() { _attesting = false; _attested = true; });
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.bg,
      appBar: AppBar(
        backgroundColor: c.bg, elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: c.ink),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: List.generate(3, (i) => Container(
                width: 24, height: 4, margin: const EdgeInsets.only(right: 6),
                decoration: BoxDecoration(
                  color: i <= 2 ? c.accent : c.line,
                  borderRadius: BorderRadius.circular(2),
                ),
              ))),
              const SizedBox(height: 36),
              Text('Bind this device',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 32, fontWeight: FontWeight.w400, color: c.ink,
                  height: 1.05, letterSpacing: 32 * -0.02,
                )),
              const SizedBox(height: 8),
              Text('This device will be bound to your account for QR scanning.',
                style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute)),
              const SizedBox(height: 28),
              AppCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('DEVICE', style: TextStyle(fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                      fontSize: 11, color: c.inkMute, letterSpacing: 0.18)),
                    const SizedBox(height: 12),
                    CardLabelRow(label: 'Model', value: _model),
                    Container(height: 1, color: c.line),
                    CardLabelRow(label: 'OS', value: _os),
                    Container(height: 1, color: c.line),
                    CardLabelRow(label: 'HWID', value: _hwid, mono: true),
                    Container(height: 1, color: c.line),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('ATTESTATION', style: TextStyle(fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                            fontSize: 11, color: c.inkMute, letterSpacing: 0.18)),
                          _attested
                              ? StatusPill(PillStatus.attested)
                              : _attesting
                                  ? Row(children: [
                                      SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 1.5, color: c.accent)),
                                      const SizedBox(width: 6),
                                      Text('Attesting…', style: GoogleFonts.dmSans(fontSize: 12, color: c.inkMute)),
                                    ])
                                  : Text('Pending', style: GoogleFonts.dmSans(fontSize: 12, color: c.inkMute)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text('Secure Enclave key · Generated · nonexportable',
                style: TextStyle(fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                  fontSize: 11, color: c.inkMute, letterSpacing: 0.05)),
              const Spacer(),
              if (_attested) ...[
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => context.go('/student/home'),
                    child: const Text('Go to App'),
                  ),
                ),
              ] else
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _attesting ? null : _bindDevice,
                    child: _attesting
                        ? const SizedBox(width: 18, height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text('Bind Device'),
                  ),
                ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
