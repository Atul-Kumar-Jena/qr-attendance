import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/theme_provider.dart';
import '../../theme/app_colors.dart';
import '../../widgets/avatar_circle.dart';
import '../../widgets/role_badge.dart';
import '../../widgets/status_pill.dart';
import '../../widgets/app_card.dart';
import '../../models/user_model.dart';

class StudentProfileScreen extends StatelessWidget {
  const StudentProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    final user = context.watch<AuthProvider>().user;
    final themeProvider = context.watch<ThemeProvider>();

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              Text('Profile', style: GoogleFonts.cormorantGaramond(
                fontSize: 32, fontWeight: FontWeight.w400, color: c.ink,
                height: 1.05, letterSpacing: 32 * -0.02,
              )),
              const SizedBox(height: 28),
              Row(
                children: [
                  AvatarCircle(initials: user?.initials ?? '?', size: 64),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user?.displayName ?? 'Student', style: GoogleFonts.dmSans(
                          fontSize: 17, fontWeight: FontWeight.w600, color: c.ink)),
                        const SizedBox(height: 4),
                        Text('21CS1108 · Computer Science', style: TextStyle(
                          fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                          fontSize: 11, color: c.inkMute)),
                        const SizedBox(height: 6),
                        RoleBadge(user?.role ?? Role.student),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),
              _SectionHeader(label: 'Bound Device'),
              const SizedBox(height: 8),
              AppCard(
                child: Column(
                  children: [
                    CardLabelRow(label: 'HWID', value: 'a4f3…8c2d', mono: true),
                    Container(height: 1, color: c.line),
                    CardLabelRow(label: 'Model', value: 'iPhone 15 Pro'),
                    Container(height: 1, color: c.line),
                    CardLabelRow(label: 'OS', value: 'iOS 18.2'),
                    Container(height: 1, color: c.line),
                    CardLabelRow(label: 'Bound on', value: 'Aug 12, 2025'),
                    Container(height: 1, color: c.line),
                    CardLabelRow(label: 'Last seen', value: '2m ago'),
                    Container(height: 1, color: c.line),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('ATTESTATION', style: TextStyle(fontFamily: 'Courier New',
                            fontFamilyFallback: const ['SF Mono', 'monospace'],
                            fontSize: 11, color: c.inkMute, letterSpacing: 0.18)),
                          Row(children: [
                            StatusPill(PillStatus.attested),
                            const SizedBox(width: 6),
                            Text('ed25519 ✓', style: TextStyle(fontFamily: 'Courier New',
                              fontFamilyFallback: const ['SF Mono', 'monospace'],
                              fontSize: 11, color: c.live)),
                          ]),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              _SectionHeader(label: 'Preferences'),
              const SizedBox(height: 8),
              AppCard(
                padding: EdgeInsets.zero,
                child: Column(
                  children: [
                    _ToggleRow(
                      label: 'Biometric unlock',
                      subtitle: 'Use Face ID or fingerprint',
                      value: true,
                      onChanged: (_) {},
                    ),
                    Container(height: 1, color: c.line, margin: const EdgeInsets.symmetric(horizontal: 16)),
                    _ToggleRow(
                      label: 'Dark mode',
                      subtitle: 'Currently: ${themeProvider.mode.name}',
                      value: themeProvider.mode == ThemeMode.dark,
                      onChanged: (_) => themeProvider.toggle(),
                    ),
                    Container(height: 1, color: c.line, margin: const EdgeInsets.symmetric(horizontal: 16)),
                    _ToggleRow(
                      label: 'Push notifications',
                      subtitle: 'Session alerts and reminders',
                      value: true,
                      onChanged: (_) {},
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
                ),
                child: const Text('Request Device Reset'),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  style: TextButton.styleFrom(
                    foregroundColor: c.error,
                    backgroundColor: c.error.withValues(alpha: 0.08),
                    minimumSize: const Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: c.error.withValues(alpha: 0.2)),
                    ),
                  ),
                  onPressed: () async {
                    await context.read<AuthProvider>().signOut();
                    if (context.mounted) context.go('/login');
                  },
                  child: const Text('Sign Out'),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String label;
  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(label, style: GoogleFonts.dmSans(
      fontSize: 17, fontWeight: FontWeight.w600, color: AppColors.of(context).ink));
  }
}

class _ToggleRow extends StatelessWidget {
  final String label, subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _ToggleRow({required this.label, required this.subtitle, required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return SizedBox(
      height: 56,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: GoogleFonts.dmSans(fontSize: 15, fontWeight: FontWeight.w500, color: c.ink)),
                  Text(subtitle, style: GoogleFonts.dmSans(fontSize: 12, color: c.inkMute)),
                ],
              ),
            ),
            Switch(value: value, onChanged: onChanged),
          ],
        ),
      ),
    );
  }
}
