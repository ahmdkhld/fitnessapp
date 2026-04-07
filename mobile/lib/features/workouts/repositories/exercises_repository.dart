import '../../../core/api/api_client.dart';
import '../models/exercise.dart';

class ExercisesRepository {
  ExercisesRepository(this._api);
  final ApiClient _api;

  Future<List<Exercise>> list({
    String? category,
    String? search,
    bool? isCardio,
  }) async {
    final res = await _api.dio.get<List<dynamic>>(
      '/exercises',
      queryParameters: {
        if (category != null) 'category': category,
        if (search != null && search.isNotEmpty) 'search': search,
        if (isCardio != null) 'isCardio': isCardio,
      },
    );
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(Exercise.fromJson)
        .toList();
  }

  Future<Exercise> create({
    required String name,
    String? category,
    String? primaryMuscle,
    String? equipment,
    bool isCardio = false,
  }) async {
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/exercises',
      data: {
        'name': name,
        if (category != null) 'category': category,
        if (primaryMuscle != null) 'primaryMuscle': primaryMuscle,
        if (equipment != null) 'equipment': equipment,
        'isCardio': isCardio,
      },
    );
    return Exercise.fromJson(res.data!);
  }
}
