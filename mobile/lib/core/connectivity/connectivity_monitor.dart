import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';

/// Wraps connectivity_plus into a simple online/offline stream, deduping
/// consecutive identical states so subscribers only wake on real changes.
class ConnectivityMonitor {
  ConnectivityMonitor() {
    _sub = Connectivity().onConnectivityChanged.listen((results) {
      final online = results.any((r) => r != ConnectivityResult.none);
      if (online != _online) {
        _online = online;
        _controller.add(online);
      }
    });
  }

  bool _online = true;
  final StreamController<bool> _controller = StreamController<bool>.broadcast();
  late final StreamSubscription<List<ConnectivityResult>> _sub;

  Stream<bool> get onChanged => _controller.stream;
  bool get isOnline => _online;

  Future<void> dispose() async {
    await _sub.cancel();
    await _controller.close();
  }
}
