import 'package:go_router/go_router.dart';
import '../features/auth/screens/login_screen.dart';
import '../features/timeline/screens/daily_timeline_screen.dart';
import '../features/analytics/screens/dashboard_screen.dart';
import '../features/settings/screens/settings_screen.dart';
import '../features/tracking/screens/water_tracker_screen.dart';
import 'bottom_nav_shell.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/timeline',
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/water', builder: (_, __) => const WaterTrackerScreen()),
      ShellRoute(
        builder: (_, __, child) => BottomNavShell(child: child),
        routes: [
          GoRoute(
            path: '/timeline',
            builder: (_, __) => const DailyTimelineScreen(),
          ),
          GoRoute(
            path: '/dashboard',
            builder: (_, __) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/settings',
            builder: (_, __) => const SettingsScreen(),
          ),
        ],
      ),
    ],
  );
}
