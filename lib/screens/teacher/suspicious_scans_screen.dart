import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_card.dart';
import '../../widgets/status_pill.dart';

class SuspiciousScansScreen extends StatefulWidget {
  const SuspiciousScansScreen({super.key});
  @override
  State<SuspiciousScansScreen> createState() => _SuspiciousScansScreenState();
}

class _SuspiciousScansScreenState extends State<SuspiciousScansScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;

  @override
  void initState() { super.initState(); _tabs = TabController(length: 2, vsync: this); }
  @override
  void dispose() { _tabs.dispose(); super.dispose(); }

  static const _pending = [
    _FlaggedScan('Akash Mehta', '21CS1131', 'FAKE_GPS',
      'GPS provider reports 0.0m accuracy at 184m from LH-2. Likely using a mock location app.'),
    _FlaggedScan('Rohan Das', '21CS1142', 'DEVICE_MISMATCH',
      'Scan originated from HWID b7e2…3f4a, but bound device is a4f3…8c2d.'),
    _FlaggedScan('Sneha Patel', '21CS1155', 'GEO_MISS',
      'Student was 312m from LH-2 when scan was submitted (geofence: 50m).'),
  ];

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
              child: Text('Suspicious Scans', style: GoogleFonts.cormorantGaramond(
                fontSize: 32, fontWeight: FontWeight.w400, color: c.ink,
                height: 1.05, letterSpacing: 32 * -0.02,
              )),
            ),
            const SizedBox(height: 12),
            TabBar(
              controller: _tabs,
              labelPadding: const EdgeInsets.symmetric(horizontal: 20),
              indicatorColor: c.accent,
              labelColor: c.ink,
              unselectedLabelColor: c.inkMute,
              dividerColor: c.line,
              tabs: const [Tab(text: 'Pending'), Tab(text: 'Resolved')],
            ),
            Expanded(
              child: TabBarView(
                controller: _tabs,
                children: [
                  _ScanList(scans: _pending),
                  Center(child: Text('No resolved scans', style: GoogleFonts.dmSans(fontSize: 14, color: c.inkMute))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FlaggedScan {
  final String name, roll, code, reason;
  const _FlaggedScan(this.name, this.roll, this.code, this.reason);
}

class _ScanList extends StatelessWidget {
  final List<_FlaggedScan> scans;
  const _ScanList({required this.scans});

  @override
  Widget build(BuildContext context) => ListView.separated(
    padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
    itemCount: scans.length,
    separatorBuilder: (_, __) => const SizedBox(height: 12),
    itemBuilder: (ctx, i) => _ScanCard(scan: scans[i]),
  );
}

class _ScanCard extends StatelessWidget {
  final _FlaggedScan scan;
  const _ScanCard({super.key, required this.scan});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(scan.name, style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w600, color: c.ink)),
              _RejectionCodePill(code: scan.code),
            ],
          ),
          Text(scan.roll, style: TextStyle(fontFamily: 'Courier New',
            fontFamilyFallback: const ['SF Mono', 'monospace'],
            fontSize: 11, color: c.inkMute)),
          Container(height: 1, color: c.line, margin: const EdgeInsets.symmetric(vertical: 12)),
          Text(scan.reason, style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute, height: 1.6)),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => _showMarkValid(context),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(0, 40),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  child: Text('Mark valid', style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w500)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextButton(
                  onPressed: () => _showBlock(context),
                  style: TextButton.styleFrom(
                    foregroundColor: c.error,
                    backgroundColor: c.error.withValues(alpha: 0.08),
                    minimumSize: const Size(0, 40),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: c.error.withValues(alpha: 0.2)),
                    ),
                  ),
                  child: Text('Block · escalate', style: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w600)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showMarkValid(BuildContext ctx) {
    ScaffoldMessenger.of(ctx).showSnackBar(
      SnackBar(content: Text('${scan.name} marked valid')));
  }

  void _showBlock(BuildContext ctx) {
    final c = AppColors.of(ctx);
    showDialog(
      context: ctx,
      builder: (_) => AlertDialog(
        backgroundColor: c.bg,
        title: Text('Block ${scan.name}?', style: GoogleFonts.cormorantGaramond(fontSize: 20, color: c.ink)),
        content: Text('This will flag the student and their device for security review.',
          style: GoogleFonts.dmSans(fontSize: 14, color: c.inkMute)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Block', style: TextStyle(color: c.error)),
          ),
        ],
      ),
    );
  }
}

class _RejectionCodePill extends StatelessWidget {
  final String code;
  const _RejectionCodePill({required this.code});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
      decoration: BoxDecoration(
        color: c.error.withValues(alpha: 0.12),
        border: Border.all(color: c.error.withValues(alpha: 0.25)),
        borderRadius: BorderRadius.circular(9999),
      ),
      child: Text(code, style: TextStyle(fontFamily: 'Courier New',
        fontFamilyFallback: const ['SF Mono', 'monospace'],
        fontSize: 10, fontWeight: FontWeight.w700, color: c.error, letterSpacing: 0.05)),
    );
  }
}
