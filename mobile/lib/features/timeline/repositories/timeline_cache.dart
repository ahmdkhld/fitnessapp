import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../models/schedule_item.dart';

/// Lightweight offline-first cache for the daily timeline plus a queue
/// of status updates that the app couldn't deliver because it was offline.
///
/// Storage layout (in SharedPreferences):
///   timeline:items:<yyyy-mm-dd>  → JSON list of ScheduleItem
///   timeline:queue                → JSON list of queued status updates
class TimelineCache {
  static const _itemsPrefix = 'timeline:items:';
  static const _queueKey = 'timeline:queue';

  Future<SharedPreferences> get _prefs async => SharedPreferences.getInstance();

  String _key(DateTime d) =>
      '$_itemsPrefix${d.toIso8601String().substring(0, 10)}';

  Future<List<ScheduleItem>> load(DateTime date) async {
    final p = await _prefs;
    final raw = p.getString(_key(date));
    if (raw == null) return const [];
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    return list.map(ScheduleItem.fromJson).toList();
  }

  Future<void> save(DateTime date, List<ScheduleItem> items) async {
    final p = await _prefs;
    final encoded = jsonEncode(items
        .map((i) => {
              'id': i.id,
              'itemType': i.itemType,
              'title': i.title,
              'subtitle': i.subtitle,
              'scheduledTime': i.scheduledTime.toIso8601String(),
              'status': i.status,
            })
        .toList());
    await p.setString(_key(date), encoded);
  }

  Future<void> updateLocalStatus(
    DateTime date,
    String itemId,
    String status,
  ) async {
    final items = await load(date);
    final updated = items.map((i) {
      if (i.id != itemId) return i;
      return ScheduleItem(
        id: i.id,
        itemType: i.itemType,
        title: i.title,
        subtitle: i.subtitle,
        scheduledTime: i.scheduledTime,
        status: status,
      );
    }).toList();
    await save(date, updated);
  }

  Future<void> enqueueStatusUpdate(String itemId, String status) async {
    final p = await _prefs;
    final raw = p.getString(_queueKey) ?? '[]';
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    list.add({
      'itemId': itemId,
      'status': status,
      'queuedAt': DateTime.now().toIso8601String(),
    });
    await p.setString(_queueKey, jsonEncode(list));
  }

  Future<List<Map<String, dynamic>>> drainQueue() async {
    final p = await _prefs;
    final raw = p.getString(_queueKey) ?? '[]';
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    await p.setString(_queueKey, '[]');
    return list;
  }
}
