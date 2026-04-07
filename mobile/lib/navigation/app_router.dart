import 'package:go_router/go_router.dart';
import '../features/auth/bloc/auth_state.dart';
import '../features/auth/screens/login_screen.dart';
import '../features/onboarding/screens/welcome_screen.dart';
import '../features/onboarding/screens/goal_selection_screen.dart';
import '../features/onboarding/screens/plan_setup_screen.dart';
import '../features/timeline/screens/daily_timeline_screen.dart';
import '../features/analytics/screens/dashboard_screen.dart';
import '../features/settings/screens/settings_screen.dart';
import '../features/settings/screens/notification_settings_screen.dart';
import '../features/tracking/screens/water_tracker_screen.dart';
import '../features/tracking/screens/body_log_screen.dart';
import '../features/diet_plan/screens/diet_plans_list_screen.dart';
import '../features/diet_plan/screens/diet_plan_detail_screen.dart';
import '../features/supplements/screens/supplement_plans_screen.dart';
import '../features/plan_import/screens/upload_screen.dart';
import 'auth_listenable.dart';
import 'bottom_nav_shell.dart';

class AppRouter {
  static GoRouter build(AuthListenable auth) {
    return GoRouter(
      initialLocation: '/timeline',
      refreshListenable: auth,
      redirect: (context, state) {
        final status = auth.status;
        final loc = state.matchedLocation;
        final onPublic = loc == '/welcome' ||
            loc == '/login' ||
            loc.startsWith('/onboarding');

        if (status == AuthStatus.unknown) return null;
        if (status == AuthStatus.unauthenticated && !onPublic) {
          return '/welcome';
        }
        if (status == AuthStatus.authenticated && onPublic) {
          return '/timeline';
        }
        return null;
      },
      routes: [
        GoRoute(path: '/welcome', builder: (_, __) => const WelcomeScreen()),
        GoRoute(
          path: '/onboarding/goal',
          builder: (_, __) => const GoalSelectionScreen(),
        ),
        GoRoute(
          path: '/onboarding/plan',
          builder: (_, state) =>
              PlanSetupScreen(goal: state.uri.queryParameters['goal']),
        ),
        GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
        GoRoute(path: '/water', builder: (_, __) => const WaterTrackerScreen()),
        GoRoute(path: '/body-log', builder: (_, __) => const BodyLogScreen()),
        GoRoute(
          path: '/diet-plans',
          builder: (_, __) => const DietPlansListScreen(),
        ),
        GoRoute(
          path: '/diet-plans/:id',
          builder: (_, state) =>
              DietPlanDetailScreen(planId: state.pathParameters['id']!),
        ),
        GoRoute(
          path: '/supplements',
          builder: (_, __) => const SupplementPlansScreen(),
        ),
        GoRoute(
          path: '/plan-import',
          builder: (_, __) => const UploadPlanScreen(),
        ),
        GoRoute(
          path: '/settings/notifications',
          builder: (_, __) => const NotificationSettingsScreen(),
        ),
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
}
