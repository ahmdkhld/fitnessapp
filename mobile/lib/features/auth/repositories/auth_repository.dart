import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/auth/token_manager.dart';

class AuthRepository {
  AuthRepository(this._api, this._tokens);

  final ApiClient _api;
  final TokenManager _tokens;

  Future<void> login(String email, String password) async {
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    await _tokens.save(
      access: res.data!['accessToken'] as String,
      refresh: res.data!['refreshToken'] as String,
    );
  }

  Future<void> register(String email, String password, String fullName) async {
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/auth/register',
      data: {'email': email, 'password': password, 'fullName': fullName},
    );
    await _tokens.save(
      access: res.data!['accessToken'] as String,
      refresh: res.data!['refreshToken'] as String,
    );
  }

  Future<void> signOut() => _tokens.clear();

  Future<bool> get isSignedIn async => (await _tokens.accessToken) != null;
}
