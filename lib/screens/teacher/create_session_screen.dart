import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/session_provider.dart';
import '../../theme/app_colors.dart';

class CreateSessionScreen extends StatefulWidget {
  const CreateSessionScreen({super.key});

  @override
  State<CreateSessionScreen> createState() => _CreateSessionScreenState();
}

class _CreateSessionScreenState extends State<CreateSessionScreen> {
  String _selectedClass = 'CS-301';
  final _roomCtrl = TextEditingController(text: 'LH-2, Block C');
  double _geofenceRadius = 50;
  int _rotationInterval = 7;
  int _duration = 60;
  bool _creating = false;

  final _classes = ['CS-301', 'CS-302', 'CS-303', 'CS-311'];
  final _intervals = [3, 5, 7, 10, 15];
  final _durations = [30, 45, 60, 90, 120];

  @override
  void dispose() { _roomCtrl.dispose(); super.dispose(); }

  Future<void> _startSession() async {
    setState(() => _creating = true);
    try {
      final id = await context.read<SessionProvider>().createSession(
        classId: _selectedClass,
        className: _selectedClass == 'CS-301' ? 'Operating Systems' : _selectedClass,
        instructorId: 'current-uid',
        instructorName: 'Dr. N. Iyer',
        latitude: 28.5355,
        longitude: 77.1945,
        address: _roomCtrl.text,
        geofenceRadius: _geofenceRadius.toInt(),
        qrRotationInterval: _rotationInterval,
        expectedDuration: _duration,
        maxStudents: 56,
      );
      if (mounted) context.pushReplacement('/teacher/live-qr/$id');
    } finally {
      if (mounted) setState(() => _creating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = AppColors.of(context);
    return Scaffold(
      backgroundColor: c.bg,
      appBar: AppBar(
        backgroundColor: c.bg, elevation: 0,
        leading: IconButton(icon: Icon(Icons.arrow_back, color: c.ink), onPressed: () => context.pop()),
        title: Text('Create Session', style: GoogleFonts.cormorantGaramond(
          fontSize: 22, color: c.ink, fontWeight: FontWeight.w500)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 8),
              _FieldLabel('CLASS'),
              const SizedBox(height: 6),
              Container(
                decoration: BoxDecoration(
                  color: c.bg2,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: c.line),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedClass,
                    isExpanded: true,
                    style: GoogleFonts.dmSans(fontSize: 15, color: c.ink),
                    dropdownColor: c.bg2,
                    items: _classes.map((cls) => DropdownMenuItem(
                      value: cls,
                      child: Text(cls, style: GoogleFonts.dmSans(fontSize: 15, color: c.ink)),
                    )).toList(),
                    onChanged: (v) => setState(() => _selectedClass = v!),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              _FieldLabel('ROOM / LOCATION'),
              const SizedBox(height: 6),
              TextFormField(
                controller: _roomCtrl,
                style: GoogleFonts.dmSans(fontSize: 15, color: c.ink),
                decoration: InputDecoration(
                  hintText: 'LH-2, Block C',
                  hintStyle: GoogleFonts.dmSans(fontSize: 15, color: c.inkMute.withValues(alpha: 0.7)),
                ),
              ),
              const SizedBox(height: 20),
              _FieldLabel('GEOFENCE RADIUS'),
              const SizedBox(height: 4),
              Row(
                children: [
                  Expanded(
                    child: Slider(
                      value: _geofenceRadius,
                      min: 25,
                      max: 200,
                      divisions: 7,
                      activeColor: c.accent,
                      inactiveColor: c.line,
                      onChanged: (v) => setState(() => _geofenceRadius = v),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: c.accent.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(9999),
                    ),
                    child: Text('${_geofenceRadius.toInt()}m', style: GoogleFonts.dmSans(
                      fontSize: 12, fontWeight: FontWeight.w600, color: c.accent)),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              _FieldLabel('QR ROTATION INTERVAL'),
              const SizedBox(height: 8),
              Row(
                children: _intervals.map((s) => Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: GestureDetector(
                      onTap: () => setState(() => _rotationInterval = s),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _rotationInterval == s ? c.accent : c.bg2,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: _rotationInterval == s ? c.accent : c.line),
                        ),
                        child: Text('${s}s', textAlign: TextAlign.center,
                          style: GoogleFonts.dmSans(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: _rotationInterval == s ? Colors.white : c.inkMute,
                          )),
                      ),
                    ),
                  ),
                )).toList(),
              ),
              const SizedBox(height: 20),
              _FieldLabel('DURATION (MINUTES)'),
              const SizedBox(height: 8),
              Row(
                children: _durations.map((d) => Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: GestureDetector(
                      onTap: () => setState(() => _duration = d),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _duration == d ? c.accent : c.bg2,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: _duration == d ? c.accent : c.line),
                        ),
                        child: Text('$d', textAlign: TextAlign.center,
                          style: GoogleFonts.dmSans(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: _duration == d ? Colors.white : c.inkMute,
                          )),
                      ),
                    ),
                  ),
                )).toList(),
              ),
              const SizedBox(height: 36),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _creating ? null : _startSession,
                  child: _creating
                      ? const SizedBox(width: 18, height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Start Session'),
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

class _FieldLabel extends StatelessWidget {
  final String text;
  const _FieldLabel(this.text);
  @override
  Widget build(BuildContext context) => Text(text, style: TextStyle(
    fontFamily: 'Courier New', fontFamilyFallback: const ['SF Mono', 'monospace'],
    fontSize: 11, color: AppColors.of(context).inkMute, letterSpacing: 0.18));
}
