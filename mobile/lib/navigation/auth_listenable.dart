import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../features/auth/bloc/auth_bloc.dart';
import '../features/auth/bloc/auth_state.dart';

/// Adapts an AuthBloc into a [Listenable] that go_router refreshes on.
/// When the bloc transitions between authenticated/unauthenticated, the
/// router re-evaluates and runs its `redirect` callback.
class AuthListenable extends ChangeNotifier {
  AuthListenable(this._bloc) {
    _sub = _bloc.stream.listen((_) => notifyListeners());
  }

  final AuthBloc _bloc;
  late final StreamSubscription<AuthState> _sub;

  AuthStatus get status => _bloc.state.status;

  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }
}
