import 'package:flutter/material.dart';

import '../../theme/app_colors.dart';
import '../../theme/app_typography.dart';

class AuditLogScreen extends StatefulWidget {
  const AuditLogScreen({super.key});

  @override
  State<AuditLogScreen> createState() => _AuditLogScreenState();
}

class _AuditLogScreenState extends State<AuditLogScreen> {
  int _tabIndex = 0; // 0=All, 1=Auth, 2=Admin, 3=Crypto
  bool _isLoading = false;

  static const _tabLabels = ['All', 'Auth', 'Admin', 'Crypto'];

  static const List<_AuditEntry> _allEntries = [
    _AuditEntry(
      timestamp: '2026-05-20 10:14:38 UTC',
      actionType: 'attendance.accept',
      subject: 'Aarav Reddy (21CS1108)',
      object: 'S-9F2A·CS301·24',
      hash: 'a3f4…8b2c',
      category: _AuditCategory.attendance,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:14:35 UTC',
      actionType: 'auth.login',
      subject: 'dr.sharma@iitd.ac.in',
      object: 'session:web-4f2a',
      hash: 'c8e1…3d7f',
      category: _AuditCategory.auth,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:14:29 UTC',
      actionType: 'attendance.reject',
      subject: 'Rahul Verma (21CS1132)',
      object: 'S-9F2A·CS301·24',
      hash: 'f2b9…1a0c',
      category: _AuditCategory.security,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:13:51 UTC',
      actionType: 'admin.session_create',
      subject: 'Prof. A. Sharma',
      object: 'CS301·session·7',
      hash: '9d3e…f5b8',
      category: _AuditCategory.admin,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:13:44 UTC',
      actionType: 'crypto.token_rotate',
      subject: 'system',
      object: 'S-9F2A  v=0023→0024',
      hash: '2a7c…4e91',
      category: _AuditCategory.crypto,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:12:11 UTC',
      actionType: 'attendance.accept',
      subject: 'Priya Sharma (21CS1042)',
      object: 'S-9F2A·CS301·24',
      hash: 'b6f0…9c2d',
      category: _AuditCategory.attendance,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:11:58 UTC',
      actionType: 'auth.logout',
      subject: 'admin@system',
      object: 'session:api-9e1b',
      hash: '3c5a…7d4f',
      category: _AuditCategory.auth,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:10:22 UTC',
      actionType: 'admin.flag_update',
      subject: 'dev@attendly.io',
      object: 'flag:geo_fencing_v2',
      hash: '8e2f…0b6a',
      category: _AuditCategory.admin,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:09:17 UTC',
      actionType: 'crypto.key_derive',
      subject: 'system',
      object: 'tenant:T-IIT-DEL  kid=k-7f2a',
      hash: 'd1b4…5c93',
      category: _AuditCategory.crypto,
    ),
    _AuditEntry(
      timestamp: '2026-05-20 10:08:04 UTC',
      actionType: 'security.anomaly_flag',
      subject: 'Sneha Kapoor (21CS1089)',
      object: 'S-7C1B·CS201·12',
      hash: '7a9d…e3f1',
      category: _AuditCategory.security,
    ),
  ];

  List<_AuditEntry> get _filteredEntries {
    switch (_tabIndex) {
      case 1:
        return _allEntries.where((e) => e.category == _AuditCategory.auth).toList();
      case 2:
        return _allEntries.where((e) => e.category == _AuditCategory.admin).toList();
      case 3:
        return _allEntries.where((e) => e.category == _AuditCategory.crypto).toList();
      default:
        return _allEntries;
    }
  }

  Future<void> _loadMore() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final entries = _filteredEntries;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.bg,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleSpacing: 20,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Audit Log',
              style: AppTypography.displayMedium.copyWith(color: colors.ink, fontSize: 32),
            ),
            Text(
              'Merkle-chained · Immutable',
              style: TextStyle(
                fontFamily: AppTypography.monoFamily,
                fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                fontSize: 11,
                color: colors.inkMute,
                letterSpacing: 0.3,
              ),
            ),
          ],
        ),
        toolbarHeight: 72,
      ),
      body: Column(
        children: [
          // ── Filter tabs ──────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
            child: Row(
              children: _tabLabels.asMap().entries.map((e) {
                final selected = e.key == _tabIndex;
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: GestureDetector(
                    onTap: () => setState(() => _tabIndex = e.key),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: selected ? colors.accent.withOpacity(0.1) : Colors.transparent,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: selected ? colors.accent.withOpacity(0.4) : colors.line,
                        ),
                      ),
                      child: Text(
                        e.value,
                        style: AppTypography.labelMedium.copyWith(
                          color: selected ? colors.accent : colors.inkMute,
                          fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          Divider(height: 1, color: colors.line),

          // ── Audit list ───────────────────────────────────────────────────
          Expanded(
            child: NotificationListener<ScrollNotification>(
              onNotification: (n) {
                if (n is ScrollEndNotification &&
                    n.metrics.pixels >= n.metrics.maxScrollExtent - 100 &&
                    !_isLoading) {
                  _loadMore();
                }
                return false;
              },
              child: ListView.builder(
                itemCount: entries.length + 1,
                itemBuilder: (ctx, i) {
                  if (i == entries.length) {
                    return _isLoading
                        ? Padding(
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            child: Center(
                              child: SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: colors.accent,
                                ),
                              ),
                            ),
                          )
                        : const SizedBox(height: 40);
                  }
                  return _AuditEntryRow(entry: entries[i], colors: colors);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Audit entry row ───────────────────────────────────────────────────────────

class _AuditEntryRow extends StatelessWidget {
  const _AuditEntryRow({required this.entry, required this.colors});
  final _AuditEntry entry;
  final AppColors colors;

  Color _dotColor() {
    return switch (entry.category) {
      _AuditCategory.attendance => colors.live,
      _AuditCategory.auth => const Color(0xFF3B82F6),
      _AuditCategory.admin => colors.warning,
      _AuditCategory.security => colors.error,
      _AuditCategory.crypto => const Color(0xFFA855F7),
    };
  }

  Color _actionColor() {
    return switch (entry.category) {
      _AuditCategory.attendance => colors.live,
      _AuditCategory.auth => const Color(0xFF3B82F6),
      _AuditCategory.admin => colors.warning,
      _AuditCategory.security => colors.error,
      _AuditCategory.crypto => const Color(0xFFA855F7),
    };
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Colored dot
              Padding(
                padding: const EdgeInsets.only(top: 4, right: 12),
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _dotColor(),
                    shape: BoxShape.circle,
                  ),
                ),
              ),

              // Main content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Timestamp
                    Text(
                      entry.timestamp,
                      style: TextStyle(
                        fontFamily: AppTypography.monoFamily,
                        fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                        fontSize: 11,
                        color: colors.inkMute,
                        letterSpacing: 0.2,
                      ),
                    ),
                    const SizedBox(height: 3),
                    // Action type
                    Text(
                      entry.actionType,
                      style: TextStyle(
                        fontFamily: AppTypography.monoFamily,
                        fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                        fontSize: 13,
                        color: _actionColor(),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 3),
                    // Subject
                    Text(
                      entry.subject,
                      style: AppTypography.bodySmall.copyWith(
                        color: colors.ink,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 2),
                    // Object
                    Text(
                      entry.object,
                      style: TextStyle(
                        fontFamily: AppTypography.monoFamily,
                        fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                        fontSize: 11,
                        color: colors.inkMute,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ],
                ),
              ),

              // Hash
              Padding(
                padding: const EdgeInsets.only(left: 8, top: 2),
                child: Text(
                  '✓ ${entry.hash}',
                  style: TextStyle(
                    fontFamily: AppTypography.monoFamily,
                    fontFamilyFallback: AppTypography.monoFontFamilyFallback,
                    fontSize: 10,
                    color: colors.inkMute.withOpacity(0.7),
                    letterSpacing: 0.2,
                  ),
                ),
              ),
            ],
          ),
        ),
        Divider(height: 1, indent: 40, color: colors.line),
      ],
    );
  }
}

// ── Data classes ──────────────────────────────────────────────────────────────

enum _AuditCategory { attendance, auth, admin, security, crypto }

class _AuditEntry {
  const _AuditEntry({
    required this.timestamp,
    required this.actionType,
    required this.subject,
    required this.object,
    required this.hash,
    required this.category,
  });

  final String timestamp;
  final String actionType;
  final String subject;
  final String object;
  final String hash;
  final _AuditCategory category;
}
