import '../../../core/api/api_client.dart';

class PlanImportRepository {
  PlanImportRepository(this._api);
  final ApiClient _api;

  Future<Map<String, dynamic>> uploadText(String text) async {
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/plan-parser/upload',
      data: {'text': text},
    );
    return res.data!;
  }

  Future<void> confirm({required String id, required String name}) async {
    await _api.dio.post<void>(
      '/plan-parser/$id/confirm',
      data: {'name': name},
    );
  }
}
