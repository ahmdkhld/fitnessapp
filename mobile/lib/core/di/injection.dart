import 'package:get_it/get_it.dart';
import '../api/api_client.dart';
import '../auth/token_manager.dart';

final getIt = GetIt.instance;

Future<void> setupDependencies() async {
  getIt.registerLazySingleton<TokenManager>(() => TokenManager());
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(getIt<TokenManager>()));
}
