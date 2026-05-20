import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_colors.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  static const _heatmapData = [
    [92.0, 83.0, 78.0, 91.0, 67.0, 0.0, 0.0],
    [88.0, 75.0, 91.0, 83.0, 79.0, 0.0, 0.0],
    [84.0, 92.0, 70.0, 86.0, 88.0, 0.0, 0.0],
    [79.0, 88.0, 83.0, 75.0, 91.0, 0.0, 0.0],
  ];
  static const _days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  static const _weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'];

  Color _heatColor(double v, AppColors c) {
    if (v == 0) return c.line;
    if (v >= 85) return c.live.withValues(alpha: 0.7);
    if (v >= 75) return c.warning.withValues(alpha: 0.7);
    return c.error.withValues(alpha: 0.7);
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              Text('Reports', style: GoogleFonts.cormorantGaramond(
                fontSize: 32, fontWeight: FontWeight.w400, color: c.ink,
                height: 1.05, letterSpacing: 32 * -0.02,
              )),
              const SizedBox(height: 20),
              Text('ATTENDANCE HEATMAP', style: TextStyle(fontFamily: 'Courier New',
                fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11, color: c.inkMute, letterSpacing: 0.18)),
              const SizedBox(height: 12),
              // Day labels
              Row(
                children: [
                  const SizedBox(width: 36),
                  ...List.generate(7, (i) => Expanded(
                    child: Center(child: Text(_days[i], style: TextStyle(
                      fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                      fontSize: 10, color: c.inkMute))),
                  )),
                ],
              ),
              const SizedBox(height: 4),
              // Heatmap rows
              ...List.generate(_heatmapData.length, (week) => Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  children: [
                    SizedBox(
                      width: 36,
                      child: Text(_weeks[week], style: TextStyle(fontFamily: 'Courier New',
                        fontFamilyFallback: const ['SF Mono', 'monospace'],
                        fontSize: 10, color: c.inkMute)),
                    ),
                    ...List.generate(7, (day) => Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 2),
                        child: Container(
                          height: 28,
                          decoration: BoxDecoration(
                            color: _heatColor(_heatmapData[week][day], c),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: _heatmapData[week][day] > 0
                              ? Center(child: Text('${_heatmapData[week][day].toInt()}', style: TextStyle(
                                  fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                                  fontSize: 9, color: Colors.white.withValues(alpha: 0.9),
                                  fontWeight: FontWeight.w600)))
                              : null,
                        ),
                      ),
                    )),
                  ],
                ),
              )),
              const SizedBox(height: 24),
              Text('EXPORT', style: TextStyle(fontFamily: 'Courier New',
                fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11, color: c.inkMute, letterSpacing: 0.18)),
              const SizedBox(height: 8),
              Row(
                children: [
                  _ExportButton(label: 'PDF', icon: Icons.picture_as_pdf_outlined),
                  const SizedBox(width: 8),
                  _ExportButton(label: 'Excel', icon: Icons.table_chart_outlined),
                  const SizedBox(width: 8),
                  _ExportButton(label: 'Sheets', icon: Icons.grid_on_outlined),
                ],
              ),
              const SizedBox(height: 24),
              Text('RECENT REPORTS', style: TextStyle(fontFamily: 'Courier New',
                fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11, color: c.inkMute, letterSpacing: 0.18)),
              const SizedBox(height: 12),
              ..._reports.map((r) => _ReportRow(report: r)),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  static const _reports = [
    _Report('CS-301 Attendance - May 2026', 'May 16, 2026', '142 KB'),
    _Report('CS-302 Attendance - May 2026', 'May 16, 2026', '118 KB'),
    _Report('CS-303 Attendance - Apr 2026', 'Apr 30, 2026', '134 KB'),
  ];
}

class _Report {
  final String name, date, size;
  const _Report(this.name, this.date, this.size);
}

class _ReportRow extends StatelessWidget {
  final _Report report;
  const _ReportRow({super.key, required this.report});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Column(
      children: [
        SizedBox(
          height: 52,
          child: Row(
            children: [
              Icon(Icons.description_outlined, size: 20, color: c.inkMute),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(report.name, style: GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w500, color: c.ink)),
                    Text(report.date, style: TextStyle(fontFamily: 'Courier New',
                      fontFamilyFallback: const ['SF Mono', 'monospace'],
                      fontSize: 11, color: c.inkMute)),
                  ],
                ),
              ),
              Text(report.size, style: TextStyle(fontFamily: 'Courier New',
                fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11, color: c.inkMute)),
            ],
          ),
        ),
        Container(height: 1, color: c.line),
      ],
    );
  }
}

class _ExportButton extends StatelessWidget {
  final String label;
  final IconData icon;
  const _ExportButton({required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Expanded(
      child: OutlinedButton.icon(
        icon: Icon(icon, size: 16),
        label: Text(label),
        onPressed: () {},
        style: OutlinedButton.styleFrom(
          foregroundColor: c.inkMute,
          side: BorderSide(color: c.line),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          textStyle: GoogleFonts.dmSans(fontSize: 13, fontWeight: FontWeight.w500),
          minimumSize: const Size(0, 40),
        ),
      ),
    );
  }
}
