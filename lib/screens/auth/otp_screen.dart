import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../theme/app_colors.dart';

class OtpScreen extends StatefulWidget {
  final String email;
  const OtpScreen({super.key, required this.email});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _ctrls = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _nodes = List.generate(6, (_) => FocusNode());
  int _resendSeconds = 60;
  Timer? _timer;
  bool _verifying = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_resendSeconds == 0) {
        t.cancel();
      } else {
        setState(() => _resendSeconds--);
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (final c in _ctrls) c.dispose();
    for (final n in _nodes) n.dispose();
    super.dispose();
  }

  String get _otp => _ctrls.map((c) => c.text).join();

  void _onDigit(int index, String value) {
    if (value.isEmpty) {
      if (index > 0) _nodes[index - 1].requestFocus();
      return;
    }
    if (index < 5) {
      _nodes[index + 1].requestFocus();
    } else {
      _nodes[index].unfocus();
      if (_otp.length == 6) _verify();
    }
  }

  Future<void> _verify() async {
    if (_otp.length < 6) return;
    setState(() => _verifying = true);
    await Future.delayed(const Duration(milliseconds: 600));
    if (mounted) {
      setState(() => _verifying = false);
      context.go('/onboarding/name');
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.bg,
      appBar: AppBar(
        backgroundColor: c.bg,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: c.ink, size: 24),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              Text(
                'Verify OTP',
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
                'Sent to ${widget.email}',
                style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute),
              ),
              const SizedBox(height: 40),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(6, (i) => _OtpBox(
                  controller: _ctrls[i],
                  focusNode: _nodes[i],
                  onChanged: (v) => _onDigit(i, v),
                )),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _verifying || _otp.length < 6 ? null : _verify,
                  child: _verifying
                      ? const SizedBox(
                          width: 18, height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Verify'),
                ),
              ),
              const SizedBox(height: 20),
              Center(
                child: _resendSeconds > 0
                    ? Text(
                        'Resend in ${_resendSeconds}s',
                        style: GoogleFonts.dmSans(fontSize: 13, color: c.inkMute),
                      )
                    : TextButton(
                        onPressed: () {
                          setState(() => _resendSeconds = 60);
                          _startTimer();
                        },
                        child: Text(
                          'Resend OTP',
                          style: GoogleFonts.dmSans(
                            fontSize: 13,
                            color: c.accent,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OtpBox extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final ValueChanged<String> onChanged;

  const _OtpBox({required this.controller, required this.focusNode, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return SizedBox(
      width: 44,
      height: 52,
      child: TextField(
        controller: controller,
        focusNode: focusNode,
        textAlign: TextAlign.center,
        keyboardType: TextInputType.number,
        inputFormatters: [
          FilteringTextInputFormatter.digitsOnly,
          LengthLimitingTextInputFormatter(1),
        ],
        style: GoogleFonts.cormorantGaramond(fontSize: 24, fontWeight: FontWeight.w500, color: c.ink),
        decoration: InputDecoration(
          contentPadding: EdgeInsets.zero,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(color: c.line),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: BorderSide(color: c.accent, width: 1.5),
          ),
          filled: true,
          fillColor: c.bg2,
        ),
        onChanged: onChanged,
      ),
    );
  }
}
