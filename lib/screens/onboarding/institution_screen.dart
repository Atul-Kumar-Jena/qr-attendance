import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_colors.dart';

class InstitutionScreen extends StatefulWidget {
  const InstitutionScreen({super.key});

  @override
  State<InstitutionScreen> createState() => _InstitutionScreenState();
}

class _InstitutionScreenState extends State<InstitutionScreen> {
  final _ctrl = TextEditingController();
  bool _joining = false;
  String? _error;

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  Future<void> _join() async {
    if (_ctrl.text.trim().length != 4) {
      setState(() => _error = 'Enter a 4-character code');
      return;
    }
    setState(() { _joining = true; _error = null; });
    try {
      // In a real flow, this would call auth provider to join
      await Future.delayed(const Duration(milliseconds: 800));
      if (mounted) context.go('/onboarding/device');
    } catch (e) {
      setState(() => _error = 'Invalid code. Contact your institution admin.');
    } finally {
      if (mounted) setState(() => _joining = false);
    }
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
              const SizedBox(height: 12),
              _StepDots(current: 1),
              const SizedBox(height: 36),
              Text('Join your institution',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 32, fontWeight: FontWeight.w400, color: c.ink,
                  height: 1.05, letterSpacing: 32 * -0.02,
                )),
              const SizedBox(height: 8),
              Text('Enter the 4-character code from your institution.',
                style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute)),
              const SizedBox(height: 48),
              Center(
                child: SizedBox(
                  width: 140,
                  child: TextField(
                    controller: _ctrl,
                    textAlign: TextAlign.center,
                    textCapitalization: TextCapitalization.characters,
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp('[A-Za-z0-9]')),
                      LengthLimitingTextInputFormatter(4),
                      _UpperCaseFormatter(),
                    ],
                    style: TextStyle(
                      fontFamily: 'Courier New',
                      fontFamilyFallback: const ['SF Mono', 'monospace'],
                      fontSize: 28, fontWeight: FontWeight.w600,
                      color: c.ink, letterSpacing: 8,
                    ),
                    decoration: InputDecoration(
                      hintText: 'IITD',
                      hintStyle: TextStyle(
                        fontFamily: 'Courier New',
                        fontFamilyFallback: const ['SF Mono', 'monospace'],
                        fontSize: 28, color: c.inkMute.withValues(alpha: 0.5), letterSpacing: 8,
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    ),
                  ),
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Center(child: Text(_error!, style: GoogleFonts.dmSans(fontSize: 13, color: c.error))),
              ],
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _joining ? null : _join,
                  child: _joining
                      ? const SizedBox(width: 18, height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Join Institution'),
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

class _StepDots extends StatelessWidget {
  final int current;
  const _StepDots({required this.current});
  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Row(
      children: List.generate(3, (i) => Container(
        width: 24, height: 4, margin: const EdgeInsets.only(right: 6),
        decoration: BoxDecoration(
          color: i <= current ? c.accent : c.line,
          borderRadius: BorderRadius.circular(2),
        ),
      )),
    );
  }
}

class _UpperCaseFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue o, TextEditingValue n) =>
      n.copyWith(text: n.text.toUpperCase(), selection: n.selection);
}
