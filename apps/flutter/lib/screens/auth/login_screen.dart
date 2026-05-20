import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_colors.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _sending = false;

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _sending = true);
    try {
      await context.read<AuthProvider>().sendOtp(_emailCtrl.text.trim());
      if (mounted) context.push('/otp', extra: _emailCtrl.text.trim());
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 80),
                Text(
                  'Sign in',
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 32,
                    fontWeight: FontWeight.w400,
                    color: c.ink,
                    height: 1.05,
                    letterSpacing: 32 * -0.02,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Verified institutions only.',
                  style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute),
                ),
                const SizedBox(height: 40),
                Text(
                  'INSTITUTION EMAIL',
                  style: TextStyle(
                    fontFamily: 'Courier New',
                    fontFamilyFallback: const ['SF Mono', 'monospace'],
                    fontSize: 11,
                    color: c.inkMute,
                    letterSpacing: 0.18,
                  ),
                ),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  autocorrect: false,
                  style: GoogleFonts.dmSans(fontSize: 15, color: c.ink),
                  decoration: InputDecoration(
                    hintText: 'you@iit.ac.in',
                    hintStyle: GoogleFonts.dmSans(fontSize: 15, color: c.inkMute.withValues(alpha: 0.7)),
                  ),
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'Enter your email';
                    if (!v.contains('@')) return 'Enter a valid email';
                    return null;
                  },
                ),
                const SizedBox(height: 28),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _sending ? null : _submit,
                    child: _sending
                        ? SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white.withValues(alpha: 0.8),
                            ),
                          )
                        : const Text('Send OTP'),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Your email domain must be registered with Attendly. Contact your institution admin if you cannot sign in.',
                  style: GoogleFonts.dmSans(fontSize: 12, color: c.inkMute, height: 1.6),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
