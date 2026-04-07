import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Offline-first cache for in-progress workout sets. Mirrors the
/// pattern used by `TimelineCache`: any set that fails to POST while
/// the phone is offline gets queued here and is replayed by the bloc
/// on reconnect (or next session load).
///
/// Each entry is keyed by sessionId and holds the raw request payload
/// so `drainQueue` can fire them back at the API unchanged.
class SessionSetCache {
  static const _queueKey = 'workouts:queue';

  Future<SharedPreferences> get _prefs => SharedPreferences.getInstance();

  Future<void> enqueue({
    required String sessionId,
    required Map<String, dynamic> payload,
  }) async {
    final p = await _prefs;
    final raw = p.getString(_queueKey) ?? '[]';
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    list.add({
      'sessionId': sessionId,
      'payload': payload,
      'queuedAt': DateTime.now().toIso8601String(),
    });
    await p.setString(_queueKey, jsonEncode(list));
  }

  Future<List<Map<String, dynamic>>> drain() async {
    final p = await _prefs;
    final raw = p.getString(_queueKey) ?? '[]';
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    await p.setString(_queueKey, '[]');
    return list;
  }

  Future<int> pendingCount() async {
    final p = await _prefs;
    final raw = p.getString(_queueKey) ?? '[]';
    return (jsonDecode(raw) as List).length;
  }
}
