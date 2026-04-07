import 'package:equatable/equatable.dart';

enum AuthStatus { unknown, authenticated, unauthenticated, loading, error }

class AuthState extends Equatable {
  const AuthState({this.status = AuthStatus.unknown, this.error});

  final AuthStatus status;
  final String? error;

  AuthState copyWith({AuthStatus? status, String? error}) =>
      AuthState(status: status ?? this.status, error: error);

  @override
  List<Object?> get props => [status, error];
}
