import 'package:intl/intl.dart';
import '../../../core/api/api_client.dart';

class WaterDay {
  const WaterDay({required this.totalMl, required this.logs});
  final int totalMl;
  final List<Map<String, dynamic>> logs;
}

class WaterRepository {
  WaterRepository(this._api);
  final ApiClient _api;

  Future<WaterDay> fetch(DateTime date) async {
    final res = await _api.dio.get<Map<String, dynamic>>(
      '/water',
      queryParameters: {'date': DateFormat('yyyy-MM-dd').format(date)},
    );
    return WaterDay(
      totalMl: (res.data?['totalMl'] as int?) ?? 0,
      logs: ((res.data?['logs'] as List?) ?? [])
          .cast<Map<String, dynamic>>(),
    );
  }

  Future<void> log(int amountMl) async {
    await _api.dio.post<void>('/water', data: {'amountMl': amountMl});
  }
}
