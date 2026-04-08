import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:nutritrack/features/auth/bloc/auth_bloc.dart';
import 'package:nutritrack/features/auth/bloc/auth_event.dart';
import 'package:nutritrack/features/auth/bloc/auth_state.dart';
import 'package:nutritrack/features/auth/repositories/auth_repository.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late MockAuthRepository repo;

  setUp(() {
    repo = MockAuthRepository();
  });

  group('AuthBloc', () {
    test('initial state is unknown', () {
      final bloc = AuthBloc(repo);
      expect(bloc.state, const AuthState());
      expect(bloc.state.status, AuthStatus.unknown);
      bloc.close();
    });

    // ---------------------------------------------------------------
    // AuthStarted
    // ---------------------------------------------------------------
    group('AuthStarted', () {
      blocTest<AuthBloc, AuthState>(
        'emits authenticated when token exists',
        build: () {
          when(() => repo.isSignedIn).thenAnswer((_) async => true);
          return AuthBloc(repo);
        },
        act: (bloc) => bloc.add(const AuthStarted()),
        expect: () => [
          const AuthState(status: AuthStatus.authenticated),
        ],
        verify: (_) {
          verify(() => repo.isSignedIn).called(1);
        },
      );

      blocTest<AuthBloc, AuthState>(
        'emits unauthenticated when no token',
        build: () {
          when(() => repo.isSignedIn).thenAnswer((_) async => false);
          return AuthBloc(repo);
        },
        act: (bloc) => bloc.add(const AuthStarted()),
        expect: () => [
          const AuthState(status: AuthStatus.unauthenticated),
        ],
      );
    });

    // ---------------------------------------------------------------
    // AuthLoginRequested
    // ---------------------------------------------------------------
    group('AuthLoginRequested', () {
      blocTest<AuthBloc, AuthState>(
        'emits loading then authenticated on success',
        build: () {
          when(() => repo.login(any(), any())).thenAnswer((_) async {});
          return AuthBloc(repo);
        },
        act: (bloc) => bloc.add(
          const AuthLoginRequested(email: 'a@b.com', password: 'pw'),
        ),
        expect: () => [
          const AuthState(status: AuthStatus.loading),
          const AuthState(status: AuthStatus.authenticated),
        ],
        verify: (_) {
          verify(() => repo.login('a@b.com', 'pw')).called(1);
        },
      );

      blocTest<AuthBloc, AuthState>(
        'emits loading then error on failure',
        build: () {
          when(() => repo.login(any(), any()))
              .thenThrow(Exception('bad creds'));
          return AuthBloc(repo);
        },
        act: (bloc) => bloc.add(
          const AuthLoginRequested(email: 'a@b.com', password: 'wrong'),
        ),
        expect: () => [
          const AuthState(status: AuthStatus.loading),
          const AuthState(
            status: AuthStatus.error,
            error: 'Sign-in failed. Check your credentials.',
          ),
        ],
      );
    });

    // ---------------------------------------------------------------
    // AuthRegisterRequested
    // ---------------------------------------------------------------
    group('AuthRegisterRequested', () {
      blocTest<AuthBloc, AuthState>(
        'emits loading then authenticated on success',
        build: () {
          when(() => repo.register(any(), any(), any()))
              .thenAnswer((_) async {});
          return AuthBloc(repo);
        },
        act: (bloc) => bloc.add(
          const AuthRegisterRequested(
            email: 'a@b.com',
            password: 'pw',
            fullName: 'Test User',
          ),
        ),
        expect: () => [
          const AuthState(status: AuthStatus.loading),
          const AuthState(status: AuthStatus.authenticated),
        ],
      );

      blocTest<AuthBloc, AuthState>(
        'emits loading then error on failure',
        build: () {
          when(() => repo.register(any(), any(), any()))
              .thenThrow(Exception('dup'));
          return AuthBloc(repo);
        },
        act: (bloc) => bloc.add(
          const AuthRegisterRequested(
            email: 'a@b.com',
            password: 'pw',
            fullName: 'Test User',
          ),
        ),
        expect: () => [
          const AuthState(status: AuthStatus.loading),
          const AuthState(
            status: AuthStatus.error,
            error: 'Registration failed. Try a different email.',
          ),
        ],
      );
    });

    // ---------------------------------------------------------------
    // AuthLogoutRequested
    // ---------------------------------------------------------------
    group('AuthLogoutRequested', () {
      blocTest<AuthBloc, AuthState>(
        'emits unauthenticated',
        build: () {
          when(() => repo.signOut()).thenAnswer((_) async {});
          return AuthBloc(repo);
        },
        act: (bloc) => bloc.add(const AuthLogoutRequested()),
        expect: () => [
          const AuthState(status: AuthStatus.unauthenticated),
        ],
        verify: (_) {
          verify(() => repo.signOut()).called(1);
        },
      );
    });
  });
}
