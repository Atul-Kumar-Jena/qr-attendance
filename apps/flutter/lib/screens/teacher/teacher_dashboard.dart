import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_colors.dart';
import '../../widgets/avatar_circle.dart';
import '../../widgets/status_pill.dart';
import '../../widgets/app_card.dart';

class TeacherDashboard extends StatelessWidget {
  const TeacherDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              pinned: true,
              backgroundColor: c.bg,
              surfaceTintColor: Colors.transparent,
              title: Text('Dashboard', style: GoogleFonts.cormorantGaramond(
                fontSize: 22, fontWeight: FontWeight.w500, color: c.ink, height: 1.1)),
              titleSpacing: 20,
              actions: [
                Padding(
                  padding: const EdgeInsets.only(right: 20),
                  child: AvatarCircle(initials: user?.initials ?? 'T', size: 32),
                ),
              ],
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _StatTile(value: '42', label: 'MARKED TODAY', color: null),
                      const SizedBox(width: 8),
                      _StatTile(value: '14', label: 'PENDING', color: null),
                      const SizedBox(width: 8),
                      _StatTile(value: '2', label: 'SUSPICIOUS', color: null),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text('Active Sessions', style: GoogleFonts.dmSans(
                    fontSize: 17, fontWeight: FontWeight.w600, color: c.ink)),
                  const SizedBox(height: 12),
                  ..._mockSessions.map((s) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _SessionCard(session: s),
                  )),
                  const SizedBox(height: 80),
                ]),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/teacher/create-session'),
        backgroundColor: c.accent,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: const Icon(Icons.add, size: 28),
      ),
    );
  }

  static const _mockSessions = [
    _MockSession('S-9F2A·CS301·24', 'Operating Systems', 42, 56, '10:14'),
    _MockSession('S-7B1C·CS302·12', 'Computer Networks', 28, 45, '12:00'),
  ];
}

class _MockSession {
  final String id, name;
  final int marked, total;
  final String startedAt;
  const _MockSession(this.id, this.name, this.marked, this.total, this.startedAt);
}

class _StatTile extends StatelessWidget {
  final String value, label;
  final Color? color;
  const _StatTile({required this.value, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Expanded(
      child: AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value, style: GoogleFonts.cormorantGaramond(
              fontSize: 32, fontWeight: FontWeight.w500, color: color ?? c.ink, height: 1.0)),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(fontFamily: 'Courier New',
              fontFamilyFallback: const ['SF Mono', 'monospace'],
              fontSize: 10, color: c.inkMute, letterSpacing: 0.18)),
          ],
        ),
      ),
    );
  }
}

class _SessionCard extends StatelessWidget {
  final _MockSession session;
  const _SessionCard({super.key, required this.session});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return AppCard(
      onTap: () => context.push('/teacher/live-qr/${session.id}'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(session.id, style: TextStyle(fontFamily: 'Courier New',
                fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11, color: c.inkMute)),
              Text('Started ${session.startedAt}', style: TextStyle(fontFamily: 'Courier New',
                fontFamilyFallback: const ['SF Mono', 'monospace'],
                fontSize: 11, color: c.inkMute)),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(session.name, style: GoogleFonts.dmSans(
                fontSize: 15, fontWeight: FontWeight.w600, color: c.ink)),
              Row(children: [
                StatusPill(PillStatus.live),
                const SizedBox(width: 8),
                Text('${session.marked}/${session.total}', style: GoogleFonts.dmSans(
                  fontSize: 13, color: c.inkMute)),
              ]),
            ],
          ),
        ],
      ),
    );
  }
}
