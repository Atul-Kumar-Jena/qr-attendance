import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_colors.dart';
import '../../widgets/attendance_bar.dart';
import '../../widgets/avatar_circle.dart';
import '../../widgets/status_pill.dart';
import '../../widgets/app_card.dart';

class StudentHomeScreen extends StatelessWidget {
  const StudentHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final user = context.watch<AuthProvider>().user;
    final hour = DateTime.now().hour;
    final greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    final firstName = user?.displayName.split(' ').first ?? 'there';

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              pinned: true,
              backgroundColor: c.bg,
              surfaceTintColor: Colors.transparent,
              title: Text(
                '$greeting, $firstName',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 22, fontWeight: FontWeight.w500,
                  color: c.ink, height: 1.1,
                ),
              ),
              titleSpacing: 20,
              actions: [
                Padding(
                  padding: const EdgeInsets.only(right: 20),
                  child: AvatarCircle(initials: user?.initials ?? '?', size: 32),
                ),
              ],
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  const SizedBox(height: 8),
                  _BigStatCard(percentage: 83, sessions: 12, atRisk: 0),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Today's Classes",
                        style: GoogleFonts.dmSans(fontSize: 17, fontWeight: FontWeight.w600, color: c.ink)),
                      Text(_formatDate(DateTime.now()),
                        style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ..._mockClasses.map((cls) => _ClassRow(cls: cls)),
                  const SizedBox(height: 32),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime d) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    return '${days[d.weekday - 1]}, ${months[d.month - 1]} ${d.day}';
  }

  static const _mockClasses = [
    _MockClass('CS-301', 'Operating Systems', '10:00', 'LH-2', true),
    _MockClass('CS-302', 'Computer Networks', '12:00', 'LH-4', false),
    _MockClass('CS-303', 'Database Systems', '14:00', 'AB-1', false),
  ];
}

class _BigStatCard extends StatelessWidget {
  final double percentage;
  final int sessions;
  final int atRisk;

  const _BigStatCard({required this.percentage, required this.sessions, required this.atRisk});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return AppCard(
      child: Column(
        children: [
          Text(
            '${percentage.toStringAsFixed(0)}%',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 56, fontWeight: FontWeight.w400, color: c.ink, height: 1.0, letterSpacing: -1.2,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.trending_up, size: 12, color: c.live),
              const SizedBox(width: 3),
              Text('+2.1 this wk', style: GoogleFonts.dmSans(fontSize: 11, color: c.live)),
            ],
          ),
          const SizedBox(height: 4),
          Text('TERM ATTENDANCE', style: TextStyle(
            fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
            fontSize: 11, color: c.inkMute, letterSpacing: 0.18,
          )),
          const SizedBox(height: 16),
          AttendanceBar(percentage: percentage, height: 8),
          const SizedBox(height: 8),
          Text('75% minimum required', style: GoogleFonts.dmSans(fontSize: 11, color: c.inkMute)),
          const SizedBox(height: 16),
          Container(height: 1, color: c.line),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _MiniStat(label: 'Sessions', value: '$sessions'),
              Container(width: 1, height: 28, color: c.line),
              _MiniStat(label: 'At Risk', value: '$atRisk', danger: atRisk > 0),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String label;
  final String value;
  final bool danger;
  const _MiniStat({required this.label, required this.value, this.danger = false});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Column(
      children: [
        Text(value, style: GoogleFonts.cormorantGaramond(
          fontSize: 22, fontWeight: FontWeight.w500, color: danger ? c.error : c.ink)),
        Text(label, style: GoogleFonts.dmSans(fontSize: 11, color: c.inkMute)),
      ],
    );
  }
}

class _MockClass {
  final String code, name, time, room;
  final bool isLive;
  const _MockClass(this.code, this.name, this.time, this.room, this.isLive);
}

class _ClassRow extends StatelessWidget {
  final _MockClass cls;
  const _ClassRow({super.key, required this.cls});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Column(
      children: [
        InkWell(
          onTap: () {},
          child: SizedBox(
            height: 56,
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        children: [
                          Text(cls.code, style: TextStyle(fontFamily: 'Courier New',
                            fontFamilyFallback: const ['SF Mono', 'monospace'],
                            fontSize: 11, color: c.inkMute, letterSpacing: 0.1)),
                          const SizedBox(width: 6),
                          Text(cls.room, style: TextStyle(fontFamily: 'Courier New',
                            fontFamilyFallback: const ['SF Mono', 'monospace'],
                            fontSize: 11, color: c.inkMute.withValues(alpha: 0.6))),
                        ],
                      ),
                      Text(cls.name, style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w500, color: c.ink)),
                    ],
                  ),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(cls.time, style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute)),
                    const SizedBox(height: 2),
                    cls.isLive ? StatusPill(PillStatus.live) : _UpcomingPill(),
                  ],
                ),
              ],
            ),
          ),
        ),
        Container(height: 1, color: c.line),
      ],
    );
  }
}

class _UpcomingPill extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
      decoration: BoxDecoration(
        color: c.ink.withValues(alpha: 0.06),
        border: Border.all(color: c.line),
        borderRadius: BorderRadius.circular(9999),
      ),
      child: Text('UPCOMING', style: GoogleFonts.dmSans(fontSize: 10, fontWeight: FontWeight.w700,
        color: c.inkMute, letterSpacing: 0.1)),
    );
  }
}
