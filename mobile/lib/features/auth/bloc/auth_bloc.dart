import 'package:flutter_bloc/flutter_bloc.dart';
import '../repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc(this._repo) : super(const AuthState()) {
    on<AuthStarted>(_onStarted);
    on<AuthLoginRequested>(_onLogin);
    on<AuthRegisterRequested>(_onRegister);
    on<AuthLogoutRequested>(_onLogout);
  }

  final AuthRepository _repo;

  Future<void> _onStarted(AuthStarted _, Emitter<AuthState> emit) async {
    final signedIn = await _repo.isSignedIn;
    emit(state.copyWith(
      status: signedIn ? AuthStatus.authenticated : AuthStatus.unauthenticated,
    ));
  }

  Future<void> _onLogin(AuthLoginRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    try {
      await _repo.login(event.email, event.password);
      emit(state.copyWith(status: AuthStatus.authenticated));
    } catch (e) {
      emit(state.copyWith(
        status: AuthStatus.error,
        error: 'Sign-in failed. Check your credentials.',
      ));
    }
  }

  Future<void> _onRegister(
    AuthRegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading));
    try {
      await _repo.register(event.email, event.password, event.fullName);
      emit(state.copyWith(status: AuthStatus.authenticated));
    } catch (e) {
      emit(state.copyWith(
        status: AuthStatus.error,
        error: 'Registration failed. Try a different email.',
      ));
    }
  }

  Future<void> _onLogout(AuthLogoutRequested _, Emitter<AuthState> emit) async {
    await _repo.signOut();
    emit(state.copyWith(status: AuthStatus.unauthenticated));
  }
}
