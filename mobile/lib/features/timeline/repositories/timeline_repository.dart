import 'package:intl/intl.dart';
import '../../../core/api/api_client.dart';
import '../../../models/schedule_item.dart';

class TimelineRepository {
  TimelineRepository(this._api);
  final ApiClient _api;

  Future<List<ScheduleItem>> fetchDay(DateTime date) async {
    final res = await _api.dio.get<List<dynamic>>(
      '/schedule',
      queryParameters: {'date': DateFormat('yyyy-MM-dd').format(date)},
    );
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(ScheduleItem.fromJson)
        .toList();
  }

  Future<void> updateStatus(String itemId, String status, {String? notes}) async {
    await _api.dio.patch<void>(
      '/schedule/$itemId/status',
      data: {'status': status, if (notes != null) 'notes': notes},
    );
  }
}
