import 'dart:convert';

import '../../../core/database/app_database.dart';

/// Offline-first cache for in-progress workout sets.  Any set that fails
/// to POST while the device is offline gets queued here and is replayed by
/// the bloc on reconnect (or next session load).
///
/// Backed by Drift (SQLite) via [AppDatabase].  The public API is
/// unchanged so existing blocs continue to work without modification.
class SessionSetCache {
  SessionSetCache(this._db);

  final AppDatabase _db;

  /// Push a failed set-recording request onto the offline queue.
  Future<void> enqueue({
    required String sessionId,
    required Map<String, dynamic> payload,
  }) async {
    final body = jsonEncode({
      'sessionId': sessionId,
      'payload': payload,
      'queuedAt': DateTime.now().toIso8601String(),
    });
    await _db.enqueueOffline(
      endpoint: '/api/v1/workout-sessions/$sessionId/sets',
      method: 'POST',
      body: body,
    );
  }

  /// Drain all pending workout-set entries from the queue, returning the
  /// raw payloads in FIFO order and removing them from the database.
  Future<List<Map<String, dynamic>>> drain() async {
    // Only return entries whose endpoint matches workout sessions.
    final all = await _db.pendingQueueEntries();
    final workoutEntries = all
        .where((e) => e.endpoint.contains('workout-sessions'))
        .toList();

    final results = <Map<String, dynamic>>[];
    for (final e in workoutEntries) {
      results.add(jsonDecode(e.body) as Map<String, dynamic>);
      await _db.deleteQueueEntry(e.id);
    }
    return results;
  }

  /// Number of pending workout-set entries waiting to be synced.
  Future<int> pendingCount() async {
    final all = await _db.pendingQueueEntries();
    return all.where((e) => e.endpoint.contains('workout-sessions')).length;
  }
}
