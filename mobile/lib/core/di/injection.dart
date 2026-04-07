import 'package:get_it/get_it.dart';
import '../../features/auth/repositories/auth_repository.dart';
import '../../features/diet_plan/repositories/diet_plan_repository.dart';
import '../../features/plan_import/repositories/plan_import_repository.dart';
import '../../features/settings/repositories/notification_settings_repository.dart';
import '../../features/supplements/repositories/supplement_repository.dart';
import '../../features/timeline/repositories/timeline_repository.dart';
import '../../features/tracking/repositories/body_log_repository.dart';
import '../../features/tracking/repositories/water_repository.dart';
import '../../features/analytics/repositories/analytics_repository.dart';
import '../api/api_client.dart';
import '../auth/token_manager.dart';
import '../notifications/local_notification_service.dart';

final getIt = GetIt.instance;

Future<void> setupDependencies() async {
  getIt.registerLazySingleton<TokenManager>(() => TokenManager());
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(getIt<TokenManager>()));

  // Core services
  getIt.registerLazySingleton<LocalNotificationService>(
    () => LocalNotificationService(),
  );
  await getIt<LocalNotificationService>().init();

  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepository(getIt<ApiClient>(), getIt<TokenManager>()),
  );
  getIt.registerLazySingleton<TimelineRepository>(
    () => TimelineRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<WaterRepository>(
    () => WaterRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<BodyLogRepository>(
    () => BodyLogRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<AnalyticsRepository>(
    () => AnalyticsRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<DietPlanRepository>(
    () => DietPlanRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<SupplementRepository>(
    () => SupplementRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<PlanImportRepository>(
    () => PlanImportRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<NotificationSettingsRepository>(
    () => NotificationSettingsRepository(getIt<ApiClient>()),
  );
}
