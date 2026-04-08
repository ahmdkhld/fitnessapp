import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'core/api/api_client.dart';
import 'core/di/injection.dart';
import 'core/notifications/push_notification_service.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/bloc/auth_bloc.dart';
import 'features/auth/bloc/auth_event.dart';
import 'features/auth/repositories/auth_repository.dart';
import 'navigation/app_router.dart';
import 'navigation/auth_listenable.dart';

class NutriTrackApp extends StatefulWidget {
  const NutriTrackApp({super.key});

  @override
  State<NutriTrackApp> createState() => _NutriTrackAppState();
}

class _NutriTrackAppState extends State<NutriTrackApp> {
  late final AuthBloc _authBloc;
  late final AuthListenable _listenable;
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _authBloc = AuthBloc(getIt<AuthRepository>())..add(const AuthStarted());
    _listenable = AuthListenable(_authBloc);
    _router = AppRouter.build(_listenable);

    // Route API client 401 failures through the bloc so the router
    // refresh listener redirects to /welcome.
    getIt<ApiClient>().onUnauthorized = () {
      _authBloc.add(const AuthLogoutRequested());
    };

    // Wire push-notification taps to GoRouter navigation.
    // The FCM data payload is expected to contain a `route` key
    // (e.g. {"route": "/timeline"} or {"route": "/diet-plans/42"}).
    try {
      getIt<PushNotificationService>().onNotificationTap = (data) {
        final route = data['route'] as String?;
        if (route != null && route.startsWith('/')) {
          _router.go(route);
        }
      };
    } catch (_) {
      // PushNotificationService may not be initialised (e.g. missing Firebase
      // config during development).
    }
  }

  @override
  void dispose() {
    _listenable.dispose();
    _authBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _authBloc,
      child: MaterialApp.router(
        title: 'NutriTrack',
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        themeMode: ThemeMode.system,
        routerConfig: _router,
        debugShowCheckedModeBanner: false,
        supportedLocales: AppLocalizations.supportedLocales,
        localizationsDelegates: const [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
      ),
    );
  }
}
