import 'package:dio/dio.dart';
import '../auth/token_manager.dart';

/// Dio client with access-token injection and automatic refresh on 401.
///
/// When a request fails with 401, the interceptor tries exactly once to
/// call `/auth/refresh` with the stored refresh token; on success the
/// original request is retried, on failure the tokens are cleared and
/// the caller can redirect to login.
class ApiClient {
  ApiClient(this._tokens) {
    dio = Dio(BaseOptions(
      baseUrl: const String.fromEnvironment(
        'API_BASE_URL',
        defaultValue: 'http://10.0.2.2:3000/api',
      ),
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _tokens.accessToken;
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (err, handler) async {
        if (err.response?.statusCode == 401 &&
            err.requestOptions.extra['retried'] != true) {
          final refreshed = await _attemptRefresh();
          if (refreshed) {
            err.requestOptions.extra['retried'] = true;
            final token = await _tokens.accessToken;
            err.requestOptions.headers['Authorization'] = 'Bearer $token';
            try {
              final retry = await dio.fetch<dynamic>(err.requestOptions);
              return handler.resolve(retry);
            } catch (e) {
              return handler.next(e is DioException ? e : err);
            }
          }
          await _tokens.clear();
          onUnauthorized?.call();
        }
        handler.next(err);
      },
    ));
  }

  late final Dio dio;
  final TokenManager _tokens;

  /// Callback the app sets to redirect the user to the login screen when
  /// the refresh flow fails.
  void Function()? onUnauthorized;

  bool _refreshing = false;

  Future<bool> _attemptRefresh() async {
    if (_refreshing) return false;
    _refreshing = true;
    try {
      final refresh = await _tokens.refreshToken;
      if (refresh == null) return false;
      final res = await Dio(BaseOptions(baseUrl: dio.options.baseUrl)).post<
          Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refreshToken': refresh},
      );
      final access = res.data?['accessToken'] as String?;
      final newRefresh = res.data?['refreshToken'] as String?;
      if (access != null && newRefresh != null) {
        await _tokens.save(access: access, refresh: newRefresh);
        return true;
      }
      return false;
    } catch (_) {
      return false;
    } finally {
      _refreshing = false;
    }
  }
}
