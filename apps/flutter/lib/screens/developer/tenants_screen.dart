import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

class TenantsScreen extends StatefulWidget {
  const TenantsScreen({super.key});

  @override
  State<TenantsScreen> createState() => _TenantsScreenState();
}

class _TenantsScreenState extends State<TenantsScreen> {
  final _searchController = TextEditingController();
  String _query = '';

  static const List<_TenantItem> _allTenants = [
    _TenantItem(
      id: 'T-IIT-DEL',
      name: 'IIT Delhi',
      userCount: 12840,
      liveSessionCount: 4,
      uptimePercent: 99.8,
    ),
    _TenantItem(
      id: 'T-IIT-BOM',
      name: 'IIT Bombay',
      userCount: 14200,
      liveSessionCount: 2,
      uptimePercent: 99.5,
    ),
    _TenantItem(
      id: 'T-NIT-TRI',
      name: 'NIT Trichy',
      userCount: 8760,
      liveSessionCount: 1,
      uptimePercent: 97.3,
    ),
    _TenantItem(
      id: 'T-BITS-PIL',
      name: 'BITS Pilani',
      userCount: 9100,
      liveSessionCount: 0,
      uptimePercent: 99.9,
    ),
    _TenantItem(
      id: 'T-VIT-VEL',
      name: 'VIT Vellore',
      userCount: 22000,
      liveSessionCount: 7,
      uptimePercent: 95.1,
    ),
    _TenantItem(
      id: 'T-AMU-ALG',
      name: 'Aligarh Muslim University',
      userCount: 11500,
      liveSessionCount: 0,
      uptimePercent: 88.4,
    ),
  ];

  List<_TenantItem> get _filtered => _query.isEmpty
      ? _allTenants
      : _allTenants
          .where((t) =>
              t.name.toLowerCase().contains(_query.toLowerCase()) ||
              t.id.toLowerCase().contains(_query.toLowerCase()))
          .toList();

  int get _totalUsers => _allTenants.fold(0, (sum, t) => sum + t.userCount);
  int get _totalLive => _allTenants.fold(0, (sum, t) => sum + t.liveSessionCount);

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final tenants = _filtered;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.bg,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleSpacing: 20,
        title: Text(
          'Tenants',
          style: AppTypography.displayMedium.copyWith(color: colors.ink, fontSize: 32),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
            child: Column(
              children: [
                // ── Stats row ──────────────────────────────────────────────
                Row(
                  children: [
                    Expanded(
                      child: _StatTile(
                        label: 'TOTAL INSTITUTIONS',
                        value: '${_allTenants.length}',
                        colors: colors,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _StatTile(
                        label: 'TOTAL USERS',
                        value: _formatCount(_totalUsers),
                        colors: colors,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _StatTile(
                        label: 'LIVE SESSIONS',
                        value: '$_totalLive',
                        colors: colors,
                        valueColor: _totalLive > 0 ? colors.live : null,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // ── Search input ───────────────────────────────────────────
                TextField(
                  controller: _searchController,
                  style: AppTypography.bodyMedium.copyWith(color: colors.ink),
                  onChanged: (v) => setState(() => _query = v),
                  decoration: InputDecoration(
                    hintText: 'Search institutions…',
                    hintStyle:
                        AppTypography.bodyMedium.copyWith(color: colors.inkMute),
                    prefixIcon: Icon(Icons.search, color: colors.inkMute, size: 18),
                    filled: true,
                    fillColor: colors.bg2,
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
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
                  ),
                ),
              ],
            ),
          ),

          // ── Tenant list ──────────────────────────────────────────────────
          Expanded(
            child: tenants.isEmpty
                ? Center(
                    child: Text(
                      'No results',
                      style: AppTypography.bodyMedium.copyWith(color: colors.inkMute),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: tenants.length,
                    itemBuilder: (ctx, i) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: _TenantCard(tenant: tenants[i], colors: colors),
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  String _formatCount(int count) {
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}k';
    return '$count';
  }
}

// ── Stat tile ─────────────────────────────────────────────────────────────────

class _StatTile extends StatelessWidget {
  const _StatTile({
    required this.label,
    required this.value,
    required this.colors,
    this.valueColor,
  });

  final String label;
  final String value;
  final AppColors colors;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
      decoration: BoxDecoration(
        color: colors.bg2,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: AppTypography.displaySmall.copyWith(
              fontFamily: AppTypography.displayFamily,
              color: valueColor ?? colors.ink,
              fontSize: 28,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontFamily: AppTypography.monoFamily,
              fontFamilyFallback: AppTypography.monoFontFamilyFallback,
              fontSize: 9,
              color: colors.inkMute,
              letterSpacing: 0.4,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Tenant card ───────────────────────────────────────────────────────────────

class _TenantCard extends StatelessWidget {
  const _TenantCard({required this.tenant, required this.colors});
  final _TenantItem tenant;
  final AppColors colors;

  @override
  Widget build(BuildContext context) {
    final isUptimeGood = tenant.uptimePercent >= 99.0;
    final isUptimeFair = tenant.uptimePercent >= 95.0;
    final uptimeColor = isUptimeGood
        ? colors.live
        : isUptimeFair
            ? colors.warning
            : colors.error;

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
                      tenant.id,
                      style: TextStyle(
                        fontFamily: AppTypography.monoFamily,
                        fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                        fontSize: 11,
                        color: colors.inkMute,
                        letterSpacing: 0.4,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      tenant.name,
                      style: AppTypography.titleMedium.copyWith(
                        color: colors.ink,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              // Uptime pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: uptimeColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '${tenant.uptimePercent.toStringAsFixed(1)}%',
                  style: AppTypography.labelMedium.copyWith(
                    color: uptimeColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 8),

          // ── Stats ─────────────────────────────────────────────────────────
          Row(
            children: [
              Text(
                '${_formatCount(tenant.userCount)} users',
                style: AppTypography.bodySmall.copyWith(
                  color: colors.inkMute,
                  fontSize: 13,
                ),
              ),
              const SizedBox(width: 6),
              Text('·', style: AppTypography.bodySmall.copyWith(color: colors.inkMute)),
              const SizedBox(width: 6),
              if (tenant.liveSessionCount > 0) ...[
                Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: colors.live,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 4),
              ],
              Text(
                '${tenant.liveSessionCount} live session${tenant.liveSessionCount != 1 ? 's' : ''}',
                style: AppTypography.bodySmall.copyWith(
                  color: tenant.liveSessionCount > 0 ? colors.live : colors.inkMute,
                  fontSize: 13,
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // ── Action row ────────────────────────────────────────────────────
          Row(
            children: [
              _ActionButton(
                label: 'Inspect',
                colors: colors,
                style: _ButtonStyle.ghost,
                onTap: () {},
              ),
              const SizedBox(width: 8),
              _ActionButton(
                label: 'Suspend',
                colors: colors,
                style: _ButtonStyle.amber,
                onTap: () {},
              ),
              const SizedBox(width: 8),
              _ActionButton(
                label: 'Impersonate',
                colors: colors,
                style: _ButtonStyle.ghost,
                onTap: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatCount(int count) {
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}k';
    return '$count';
  }
}

// ── Action button ─────────────────────────────────────────────────────────────

enum _ButtonStyle { ghost, amber }

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.label,
    required this.colors,
    required this.style,
    required this.onTap,
  });

  final String label;
  final AppColors colors;
  final _ButtonStyle style;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = style == _ButtonStyle.amber ? colors.warning : colors.ink;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: style == _ButtonStyle.amber
              ? colors.warning.withOpacity(0.08)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: style == _ButtonStyle.amber
                ? colors.warning.withOpacity(0.3)
                : colors.line,
          ),
        ),
        child: Text(
          label,
          style: AppTypography.labelMedium.copyWith(
            color: color,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}

// ── Data class ────────────────────────────────────────────────────────────────

class _TenantItem {
  const _TenantItem({
    required this.id,
    required this.name,
    required this.userCount,
    required this.liveSessionCount,
    required this.uptimePercent,
  });

  final String id;
  final String name;
  final int userCount;
  final int liveSessionCount;
  final double uptimePercent;
}
