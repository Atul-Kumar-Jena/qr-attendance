import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

class FeatureFlagsScreen extends StatefulWidget {
  const FeatureFlagsScreen({super.key});

  @override
  State<FeatureFlagsScreen> createState() => _FeatureFlagsScreenState();
}

class _FeatureFlagsScreenState extends State<FeatureFlagsScreen> {
  final List<_FeatureFlag> _flags = [
    _FeatureFlag(
      key: 'geo_fencing_v2',
      description: 'Improved geofence algorithm with sensor fusion and network triangulation fallback.',
      enabled: true,
      rolloutPercent: null,
      tenantScope: null,
    ),
    _FeatureFlag(
      key: 'qr_rotation_dynamic',
      description: 'Dynamically adjust QR rotation interval based on detected scan load.',
      enabled: true,
      rolloutPercent: 85,
      tenantScope: 'IIT Delhi',
    ),
    _FeatureFlag(
      key: 'biometric_auth',
      description: 'Require biometric authentication before marking attendance.',
      enabled: false,
      rolloutPercent: 30,
      tenantScope: null,
    ),
    _FeatureFlag(
      key: 'merkle_audit',
      description: 'Enable Merkle-chain audit log with per-record integrity hashing.',
      enabled: true,
      rolloutPercent: null,
      tenantScope: null,
    ),
    _FeatureFlag(
      key: 'ai_anomaly_detection',
      description: 'Use ML-based anomaly scoring to detect unusual attendance patterns.',
      enabled: false,
      rolloutPercent: 10,
      tenantScope: 'IIT Bombay',
    ),
    _FeatureFlag(
      key: 'export_google_sheets',
      description: 'Allow direct export of attendance reports to Google Sheets.',
      enabled: true,
      rolloutPercent: 60,
      tenantScope: null,
    ),
  ];

  void _toggleFlag(int idx) {
    setState(() => _flags[idx] = _FeatureFlag(
          key: _flags[idx].key,
          description: _flags[idx].description,
          enabled: !_flags[idx].enabled,
          rolloutPercent: _flags[idx].rolloutPercent,
          tenantScope: _flags[idx].tenantScope,
        ));
  }

  void _showAddFlag() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _AddFlagSheet(
        colors: AppColors.of(ctx),
        onAdd: (flag) {
          setState(() => _flags.add(flag));
          Navigator.pop(ctx);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.bg,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleSpacing: 20,
        title: Text(
          'Feature Flags',
          style: AppTypography.displayMedium.copyWith(color: colors.ink, fontSize: 32),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        children: [
          const SizedBox(height: 4),
          ..._flags.asMap().entries.map((entry) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: _FlagCard(
                  flag: entry.value,
                  colors: colors,
                  onToggle: () => _toggleFlag(entry.key),
                ),
              )),
          const SizedBox(height: 16),
          // Add flag ghost button
          OutlinedButton.icon(
            onPressed: _showAddFlag,
            icon: Icon(Icons.add, size: 18, color: colors.ink),
            label: Text(
              'Add flag',
              style: AppTypography.labelLarge.copyWith(color: colors.ink),
            ),
            style: OutlinedButton.styleFrom(
              foregroundColor: colors.ink,
              side: BorderSide(color: colors.line),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

// ── Flag card ─────────────────────────────────────────────────────────────────

class _FlagCard extends StatelessWidget {
  const _FlagCard({
    required this.flag,
    required this.colors,
    required this.onToggle,
  });

  final _FeatureFlag flag;
  final AppColors colors;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colors.bg2,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Top row ───────────────────────────────────────────────────────
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      flag.key,
                      style: TextStyle(
                        fontFamily: AppTypography.monoFamily,
                        fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                        fontSize: 13,
                        color: colors.ink,
                        fontWeight: FontWeight.w500,
                        letterSpacing: -0.1,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      flag.description,
                      style: AppTypography.bodySmall.copyWith(
                        color: colors.inkMute,
                        fontSize: 13,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Switch(
                value: flag.enabled,
                onChanged: (_) => onToggle(),
                activeColor: colors.live,
                activeTrackColor: colors.live.withOpacity(0.3),
                inactiveThumbColor: colors.inkMute,
                inactiveTrackColor: colors.line,
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
            ],
          ),

          const SizedBox(height: 10),

          // ── Bottom badge row ──────────────────────────────────────────────
          Row(
            children: [
              // Enabled/disabled badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: flag.enabled
                      ? colors.live.withOpacity(0.1)
                      : colors.error.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  flag.enabled ? 'ENABLED' : 'DISABLED',
                  style: TextStyle(
                    fontFamily: AppTypography.monoFamily,
                    fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                    fontSize: 10,
                    color: flag.enabled ? colors.live : colors.error,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.4,
                  ),
                ),
              ),

              const SizedBox(width: 6),

              // Rollout % badge
              if (flag.rolloutPercent != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: colors.warning.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    '${flag.rolloutPercent}%',
                    style: AppTypography.labelSmall.copyWith(
                      color: colors.warning,
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),

              if (flag.tenantScope != null) ...[
                const SizedBox(width: 6),
                Text(
                  flag.tenantScope!,
                  style: AppTypography.bodySmall.copyWith(
                    color: colors.inkMute,
                    fontSize: 11,
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

// ── Add flag bottom sheet ─────────────────────────────────────────────────────

class _AddFlagSheet extends StatefulWidget {
  const _AddFlagSheet({required this.colors, required this.onAdd});
  final AppColors colors;
  final void Function(_FeatureFlag) onAdd;

  @override
  State<_AddFlagSheet> createState() => _AddFlagSheetState();
}

class _AddFlagSheetState extends State<_AddFlagSheet> {
  final _keyController = TextEditingController();
  final _descController = TextEditingController();
  bool _enabled = false;

  @override
  void dispose() {
    _keyController.dispose();
    _descController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = widget.colors;
    return Container(
      decoration: BoxDecoration(
        color: colors.bg,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.fromLTRB(
        20, 20, 20, MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Add Flag',
              style: AppTypography.headlineMedium.copyWith(color: colors.ink)),
          const SizedBox(height: 16),
          TextField(
            controller: _keyController,
            style: TextStyle(
              fontFamily: AppTypography.monoFamily,
              fontFamilyFallback: AppTypography.monoFontFamilyFallback,
              fontSize: 13,
              color: colors.ink,
            ),
            decoration: _inputDecoration('flag_key_name', colors),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _descController,
            style: AppTypography.bodyMedium.copyWith(color: colors.ink),
            decoration: _inputDecoration('Description', colors),
            maxLines: 2,
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Text('Enabled by default',
                  style: AppTypography.bodyMedium.copyWith(color: colors.ink)),
              const Spacer(),
              Switch(
                value: _enabled,
                onChanged: (v) => setState(() => _enabled = v),
                activeColor: colors.live,
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                if (_keyController.text.trim().isEmpty) return;
                widget.onAdd(_FeatureFlag(
                  key: _keyController.text.trim(),
                  description: _descController.text.trim(),
                  enabled: _enabled,
                  rolloutPercent: null,
                  tenantScope: null,
                ));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.accent,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              child: Text('Create Flag',
                  style: AppTypography.labelLarge.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  )),
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String hint, AppColors colors) {
    return InputDecoration(
      hintText: hint,
      hintStyle: AppTypography.bodyMedium.copyWith(color: colors.inkMute),
      filled: true,
      fillColor: colors.bg2,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: colors.line),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: colors.line),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: colors.accent),
      ),
    );
  }
}

// ── Data class ────────────────────────────────────────────────────────────────

class _FeatureFlag {
  const _FeatureFlag({
    required this.key,
    required this.description,
    required this.enabled,
    required this.rolloutPercent,
    required this.tenantScope,
  });

  final String key;
  final String description;
  final bool enabled;
  final int? rolloutPercent;
  final String? tenantScope;
}
