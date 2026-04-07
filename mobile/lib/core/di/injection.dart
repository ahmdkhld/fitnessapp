import 'package:get_it/get_it.dart';
import '../../features/auth/repositories/auth_repository.dart';
import '../../features/timeline/repositories/timeline_repository.dart';
import '../../features/tracking/repositories/water_repository.dart';
import '../../features/analytics/repositories/analytics_repository.dart';
import '../api/api_client.dart';
import '../auth/token_manager.dart';

final getIt = GetIt.instance;

Future<void> setupDependencies() async {
  getIt.registerLazySingleton<TokenManager>(() => TokenManager());
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(getIt<TokenManager>()));

  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepository(getIt<ApiClient>(), getIt<TokenManager>()),
  );
  getIt.registerLazySingleton<TimelineRepository>(
    () => TimelineRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<WaterRepository>(
    () => WaterRepository(getIt<ApiClient>()),
  );
  getIt.registerLazySingleton<AnalyticsRepository>(
    () => AnalyticsRepository(getIt<ApiClient>()),
  );
}
