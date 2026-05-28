import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/otp_screen.dart';
import 'screens/onboarding/name_screen.dart';
import 'screens/onboarding/institution_screen.dart';
import 'screens/onboarding/device_binding_screen.dart';
import 'screens/student/home_screen.dart';
import 'screens/student/class_list_screen.dart';
import 'screens/student/scanner_screen.dart';
import 'screens/student/scan_result_screen.dart';
import 'models/session_model.dart';
import 'screens/student/profile_screen.dart';
import 'screens/teacher/teacher_dashboard.dart';
import 'screens/teacher/create_session_screen.dart';
import 'screens/teacher/live_qr_screen.dart'; // exports LiveQrScreen
import 'screens/teacher/live_scans_screen.dart';
import 'screens/teacher/suspicious_scans_screen.dart';
import 'screens/teacher/reports_screen.dart';
import 'screens/developer/console_screen.dart';
import 'screens/developer/feature_flags_screen.dart';
import 'screens/developer/tenants_screen.dart';
import 'screens/developer/audit_log_screen.dart';
import 'theme/app_colors.dart';
import 'theme/app_typography.dart';

// ── Navigator keys ────────────────────────────────────────────────────────────

final _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final _studentShellKey = GlobalKey<NavigatorState>(debugLabel: 'student');
final _teacherShellKey = GlobalKey<NavigatorState>(debugLabel: 'teacher');
final _developerShellKey = GlobalKey<NavigatorState>(debugLabel: 'developer');

// ── Router builder ────────────────────────────────────────────────────────────

GoRouter buildRouter(BuildContext context) {
  final authProvider = Provider.of<AuthProvider>(context, listen: false);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    debugLogDiagnostics: false,

    // ── Route guard ─────────────────────────────────────────────────────────
    redirect: (context, state) {
      final auth = authProvider;
      final isLoading = auth.status == AuthStatus.loading;
      final isAuthenticated = auth.status == AuthStatus.authenticated;
      final isOnboarding = auth.status == AuthStatus.onboarding;

      // Don't redirect while loading auth state
      if (isLoading) return null;

      final loc = state.uri.path;
      final isOnPublicRoute = loc == '/' ||
          loc == '/login' ||
          loc.startsWith('/otp') ||
          loc.startsWith('/onboarding');

      if (!isAuthenticated && !isOnPublicRoute) return '/login';
      if (isOnboarding && !loc.startsWith('/onboarding')) {
        return '/onboarding/name';
      }
      return null;
    },

    refreshListenable: authProvider,

    routes: [
      // ── Splash ─────────────────────────────────────────────────────────────
      GoRoute(
        path: '/',
        builder: (ctx, state) => const SplashScreen(),
      ),

      // ── Auth ───────────────────────────────────────────────────────────────
      GoRoute(
        path: '/login',
        builder: (ctx, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/otp',
        builder: (ctx, state) {
          final email = state.uri.queryParameters['email'] ?? '';
          return OtpScreen(email: email);
        },
      ),

      // ── Onboarding ─────────────────────────────────────────────────────────
      GoRoute(
        path: '/onboarding/name',
        builder: (ctx, state) => const NameScreen(),
      ),
      GoRoute(
        path: '/onboarding/institution',
        builder: (ctx, state) => const InstitutionScreen(),
      ),
      GoRoute(
        path: '/onboarding/device',
        builder: (ctx, state) => const DeviceBindingScreen(),
      ),

      // ── Student shell ───────────────────────────────────────────────────────
      StatefulShellRoute.indexedStack(
        parentNavigatorKey: _rootNavigatorKey,
        builder: (ctx, state, navigationShell) {
          return ScaffoldWithNavBar(
            navigationShell: navigationShell,
            destinations: const [
              _NavDestination(icon: Icons.home_outlined, label: 'Home'),
              _NavDestination(icon: Icons.class_outlined, label: 'Classes'),
              _NavDestination(icon: Icons.qr_code_scanner_outlined, label: 'Scan'),
              _NavDestination(icon: Icons.person_outline, label: 'Profile'),
            ],
          );
        },
        branches: [
          StatefulShellBranch(
            navigatorKey: _studentShellKey,
            routes: [
              GoRoute(
                path: '/student',
                redirect: (ctx, state) => '/student/home',
              ),
              GoRoute(
                path: '/student/home',
                builder: (ctx, state) => const StudentHomeScreen(),
              ),
              GoRoute(
                path: '/student/classes',
                builder: (ctx, state) => const ClassListScreen(),
              ),
              GoRoute(
                path: '/student/scan',
                builder: (ctx, state) => const ScannerScreen(),
              ),
              GoRoute(
                path: '/student/result',
                builder: (ctx, state) {
                  // ScanResult is passed as a route extra from ScannerScreen.
                  // Fall back to a safe default if called without extra.
                  final extra = state.extra;
                  final result = extra is ScanResult
                      ? extra
                      : ScanResult.failure(code: 'UNKNOWN', message: 'Unknown error', details: {});
                  return ScanResultScreen(result: result);
                },
              ),
              GoRoute(
                path: '/student/profile',
                builder: (ctx, state) => const StudentProfileScreen(),
              ),
            ],
          ),
          StatefulShellBranch(routes: [
            GoRoute(path: '/student/_b1', builder: (_, __) => const SizedBox()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/student/_b2', builder: (_, __) => const SizedBox()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/student/_b3', builder: (_, __) => const SizedBox()),
          ]),
        ],
      ),

      // ── Teacher shell ───────────────────────────────────────────────────────
      StatefulShellRoute.indexedStack(
        parentNavigatorKey: _rootNavigatorKey,
        builder: (ctx, state, navigationShell) {
          return ScaffoldWithNavBar(
            navigationShell: navigationShell,
            destinations: const [
              _NavDestination(icon: Icons.dashboard_outlined, label: 'Dashboard'),
              _NavDestination(icon: Icons.play_circle_outline, label: 'Sessions'),
              _NavDestination(icon: Icons.bar_chart_outlined, label: 'Reports'),
              _NavDestination(icon: Icons.person_outline, label: 'Profile'),
            ],
          );
        },
        branches: [
          StatefulShellBranch(
            navigatorKey: _teacherShellKey,
            routes: [
              GoRoute(
                path: '/teacher',
                redirect: (ctx, state) => '/teacher/dashboard',
              ),
              GoRoute(
                path: '/teacher/dashboard',
                builder: (ctx, state) => const TeacherDashboard(),
              ),
              GoRoute(
                path: '/teacher/create-session',
                parentNavigatorKey: _rootNavigatorKey,
                builder: (ctx, state) => const CreateSessionScreen(),
              ),
              GoRoute(
                path: '/teacher/live-qr/:sessionId',
                parentNavigatorKey: _rootNavigatorKey,
                builder: (ctx, state) {
                  final sessionId = state.pathParameters['sessionId']!;
                  return LiveQrScreen(sessionId: sessionId);
                },
              ),
              GoRoute(
                path: '/teacher/scans/:sessionId',
                parentNavigatorKey: _rootNavigatorKey,
                builder: (ctx, state) {
                  final sessionId = state.pathParameters['sessionId']!;
                  return LiveScansScreen(sessionId: sessionId);
                },
              ),
              GoRoute(
                path: '/teacher/suspicious',
                parentNavigatorKey: _rootNavigatorKey,
                builder: (ctx, state) => const SuspiciousScansScreen(),
              ),
            ],
          ),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/teacher/sessions',
              builder: (ctx, state) => const TeacherDashboard(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/teacher/reports',
              builder: (ctx, state) => const ReportsScreen(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/teacher/profile',
              builder: (ctx, state) => const _TeacherProfilePlaceholder(),
            ),
          ]),
        ],
      ),

      // ── Developer shell ─────────────────────────────────────────────────────
      StatefulShellRoute.indexedStack(
        parentNavigatorKey: _rootNavigatorKey,
        builder: (ctx, state, navigationShell) {
          return ScaffoldWithNavBar(
            navigationShell: navigationShell,
            destinations: const [
              _NavDestination(icon: Icons.terminal_outlined, label: 'Console'),
              _NavDestination(icon: Icons.toggle_on_outlined, label: 'Flags'),
              _NavDestination(icon: Icons.business_outlined, label: 'Tenants'),
              _NavDestination(icon: Icons.receipt_long_outlined, label: 'Audit'),
            ],
          );
        },
        branches: [
          StatefulShellBranch(
            navigatorKey: _developerShellKey,
            routes: [
              GoRoute(
                path: '/developer',
                redirect: (ctx, state) => '/developer/console',
              ),
              GoRoute(
                path: '/developer/console',
                builder: (ctx, state) => const ConsoleScreen(),
              ),
            ],
          ),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/developer/flags',
              builder: (ctx, state) => const FeatureFlagsScreen(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/developer/tenants',
              builder: (ctx, state) => const TenantsScreen(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/developer/audit',
              builder: (ctx, state) => const AuditLogScreen(),
            ),
          ]),
        ],
      ),
    ],
  );
}

// ── ScaffoldWithNavBar shell widget ──────────────────────────────────────────

class ScaffoldWithNavBar extends StatelessWidget {
  const ScaffoldWithNavBar({
    super.key,
    required this.navigationShell,
    required this.destinations,
  });

  final StatefulNavigationShell navigationShell;
  final List<_NavDestination> destinations;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: colors.bg,
          border: Border(top: BorderSide(color: colors.line)),
        ),
        child: SafeArea(
          top: false,
          child: SizedBox(
            height: 64,
            child: Row(
              children: destinations.asMap().entries.map((entry) {
                final idx = entry.key;
                final dest = entry.value;
                final isSelected = navigationShell.currentIndex == idx;
                return Expanded(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () => navigationShell.goBranch(
                      idx,
                      initialLocation: idx == navigationShell.currentIndex,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          dest.icon,
                          size: 22,
                          color: isSelected ? colors.accent : colors.inkMute,
                        ),
                        const SizedBox(height: 3),
                        Text(
                          dest.label,
                          style: TextStyle(
                            fontFamily: AppTypography.sansFamily,
                            fontSize: 10,
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                            color: isSelected ? colors.accent : colors.inkMute,
                            letterSpacing: 0.2,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}

// ── Nav destination data ──────────────────────────────────────────────────────

class _NavDestination {
  const _NavDestination({required this.icon, required this.label});
  final IconData icon;
  final String label;
}

// ── Placeholder screens (profile etc.) ───────────────────────────────────────

class _TeacherProfilePlaceholder extends StatelessWidget {
  const _TeacherProfilePlaceholder();

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.bg,
        elevation: 0,
        title: Text('Profile',
            style: AppTypography.displayMedium.copyWith(
              color: colors.ink,
              fontSize: 32,
            )),
      ),
      body: Center(
        child: Text('Profile',
            style: AppTypography.bodyLarge.copyWith(color: colors.inkMute)),
      ),
    );
  }
}
