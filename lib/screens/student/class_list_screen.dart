import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_colors.dart';
import '../../widgets/attendance_bar.dart';
import '../../widgets/app_card.dart';
import '../../widgets/status_pill.dart';

class ClassListScreen extends StatefulWidget {
  const ClassListScreen({super.key});

  @override
  State<ClassListScreen> createState() => _ClassListScreenState();
}

class _ClassListScreenState extends State<ClassListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;
  final _filters = ['All', 'Theory', 'Lab', 'At Risk'];

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: _filters.length, vsync: this);
  }

  @override
  void dispose() { _tabs.dispose(); super.dispose(); }

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
              child: Text('Classes', style: GoogleFonts.cormorantGaramond(
                fontSize: 32, fontWeight: FontWeight.w400, color: c.ink,
                height: 1.05, letterSpacing: 32 * -0.02,
              )),
            ),
            const SizedBox(height: 16),
            TabBar(
              controller: _tabs,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              labelPadding: const EdgeInsets.symmetric(horizontal: 20),
              indicatorColor: c.accent,
              indicatorWeight: 2,
              labelColor: c.ink,
              unselectedLabelColor: c.inkMute,
              labelStyle: GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w600),
              unselectedLabelStyle: GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w400),
              dividerColor: c.line,
              tabs: _filters.map((f) => Tab(text: f)).toList(),
            ),
            Expanded(
              child: TabBarView(
                controller: _tabs,
                children: [
                  _ClassList(classes: _allClasses),
                  _ClassList(classes: _allClasses.where((c) => c.type == 'Theory').toList()),
                  _ClassList(classes: _allClasses.where((c) => c.type == 'Lab').toList()),
                  _ClassList(classes: _allClasses.where((c) => c.attendance < 75).toList()),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  static final _allClasses = [
    _ClassData('CS-301', 'Operating Systems', 'Dr. N. Iyer', 83, 10, 12, 'Theory'),
    _ClassData('CS-302', 'Computer Networks', 'Dr. S. Kumar', 72, 9, 12, 'Theory'),
    _ClassData('CS-303', 'Database Systems', 'Prof. R. Sharma', 91, 11, 12, 'Theory'),
    _ClassData('CS-311', 'OS Lab', 'Dr. N. Iyer', 67, 4, 6, 'Lab'),
    _ClassData('CS-312', 'Networks Lab', 'Dr. S. Kumar', 83, 5, 6, 'Lab'),
  ];
}

class _ClassData {
  final String code, name, teacher, type;
  final double attendance;
  final int sessionsAttended, totalSessions;
  const _ClassData(this.code, this.name, this.teacher, this.attendance,
      this.sessionsAttended, this.totalSessions, this.type);
  bool get isAtRisk => attendance < 75;
}

class _ClassList extends StatelessWidget {
  final List<_ClassData> classes;
  const _ClassList({required this.classes});

  @override
  Widget build(BuildContext context) {
    if (classes.isEmpty) {
      return Center(child: Text('No classes', style: GoogleFonts.dmSans(
        fontSize: 14, color: AppColors.of(context).inkMute)));
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      itemCount: classes.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (ctx, i) => _ClassCard(cls: classes[i]),
    );
  }
}

class _ClassCard extends StatelessWidget {
  final _ClassData cls;
  const _ClassCard({super.key, required this.cls});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return AppCard(
      onTap: () {},
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(cls.code, style: TextStyle(fontFamily: 'Courier New',
                fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11, color: c.inkMute, letterSpacing: 0.1)),
              if (cls.isAtRisk) StatusPill(PillStatus.atRisk),
            ],
          ),
          const SizedBox(height: 4),
          Text(cls.name, style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w600, color: c.ink)),
          const SizedBox(height: 2),
          Text(cls.teacher, style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute)),
          const SizedBox(height: 12),
          AttendanceBar(percentage: cls.attendance, height: 6),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('${cls.attendance.toStringAsFixed(0)}%', style: GoogleFonts.dmSans(
                fontSize: 13, fontWeight: FontWeight.w600,
                color: cls.attendance >= 85 ? c.live : cls.attendance >= 75 ? c.warning : c.error)),
              Text('${cls.sessionsAttended}/${cls.totalSessions} sessions', style: TextStyle(
                fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11, color: c.inkMute)),
            ],
          ),
        ],
      ),
    );
  }
}
