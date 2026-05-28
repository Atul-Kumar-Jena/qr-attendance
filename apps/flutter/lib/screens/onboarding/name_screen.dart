import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_colors.dart';

class NameScreen extends StatefulWidget {
  const NameScreen({super.key});

  @override
  State<NameScreen> createState() => _NameScreenState();
}

class _NameScreenState extends State<NameScreen> {
  final _ctrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 48),
                _StepIndicator(current: 0, total: 3),
                const SizedBox(height: 36),
                Text(
                  "What's your name?",
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 32, fontWeight: FontWeight.w400,
                    color: c.ink, height: 1.05, letterSpacing: 32 * -0.02,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'This will appear on your attendance record.',
                  style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute),
                ),
                const SizedBox(height: 40),
                Text(
                  'FULL NAME',
                  style: TextStyle(fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
                    fontSize: 11, color: c.inkMute, letterSpacing: 0.18),
                ),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _ctrl,
                  textCapitalization: TextCapitalization.words,
                  style: GoogleFonts.dmSans(fontSize: 15, color: c.ink),
                  decoration: InputDecoration(
                    hintText: 'Aarav Reddy',
                    hintStyle: GoogleFonts.dmSans(fontSize: 15, color: c.inkMute.withValues(alpha: 0.7)),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter your name' : null,
                ),
                const Spacer(),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        context.go('/onboarding/institution');
                      }
                    },
                    child: const Text('Continue'),
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _StepIndicator extends StatelessWidget {
  final int current;
  final int total;
  const _StepIndicator({required this.current, required this.total});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Row(
      children: List.generate(total, (i) => Container(
        width: 24, height: 4,
        margin: const EdgeInsets.only(right: 6),
        decoration: BoxDecoration(
          color: i <= current ? c.accent : c.line,
          borderRadius: BorderRadius.circular(2),
        ),
      )),
    );
  }
}
