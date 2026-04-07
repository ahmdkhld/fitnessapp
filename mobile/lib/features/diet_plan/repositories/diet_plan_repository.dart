import '../../../core/api/api_client.dart';

class DietPlan {
  const DietPlan({
    required this.id,
    required this.name,
    this.goal,
    this.description,
    required this.isActive,
  });

  final String id;
  final String name;
  final String? goal;
  final String? description;
  final bool isActive;

  factory DietPlan.fromJson(Map<String, dynamic> json) => DietPlan(
        id: json['id'] as String,
        name: json['name'] as String,
        goal: json['goal'] as String?,
        description: json['description'] as String?,
        isActive: json['isActive'] as bool? ?? false,
      );
}

class Meal {
  const Meal({
    required this.id,
    required this.name,
    required this.scheduledTime,
    this.calories,
    this.proteinG,
    this.carbsG,
    this.fatG,
    this.ingredients = const [],
  });

  final String id;
  final String name;
  final String scheduledTime;
  final int? calories;
  final double? proteinG;
  final double? carbsG;
  final double? fatG;
  final List<MealIngredient> ingredients;

  factory Meal.fromJson(Map<String, dynamic> json) {
    final time = json['scheduledTime']?.toString() ?? '';
    return Meal(
      id: json['id'] as String,
      name: json['name'] as String,
      scheduledTime: time.contains('T')
          ? time.substring(11, 16)
          : time.substring(0, 5),
      calories: json['calories'] as int?,
      proteinG: (json['proteinG'] as num?)?.toDouble(),
      carbsG: (json['carbsG'] as num?)?.toDouble(),
      fatG: (json['fatG'] as num?)?.toDouble(),
      ingredients: ((json['ingredients'] as List?) ?? [])
          .cast<Map<String, dynamic>>()
          .map(MealIngredient.fromJson)
          .toList(),
    );
  }
}

class MealIngredient {
  const MealIngredient({required this.name, this.quantity});
  final String name;
  final String? quantity;

  factory MealIngredient.fromJson(Map<String, dynamic> json) =>
      MealIngredient(
        name: json['name'] as String,
        quantity: json['quantity'] as String?,
      );
}

class DietPlanRepository {
  DietPlanRepository(this._api);
  final ApiClient _api;

  Future<List<DietPlan>> list() async {
    final res = await _api.dio.get<List<dynamic>>('/diet-plans');
    return (res.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(DietPlan.fromJson)
        .toList();
  }

  Future<DietPlan> create({
    required String name,
    String? goal,
    String? description,
  }) async {
    final res = await _api.dio.post<Map<String, dynamic>>('/diet-plans', data: {
      'name': name,
      if (goal != null) 'goal': goal,
      if (description != null) 'description': description,
    });
    return DietPlan.fromJson(res.data!);
  }

  Future<Map<String, dynamic>> detail(String id) async {
    final res = await _api.dio.get<Map<String, dynamic>>('/diet-plans/$id');
    return res.data!;
  }

  Future<void> delete(String id) async {
    await _api.dio.delete<void>('/diet-plans/$id');
  }

  Future<void> activate(String id) async {
    await _api.dio.post<void>('/diet-plans/$id/activate');
  }

  Future<void> addMeal({
    required String planId,
    required String name,
    required String scheduledTime, // HH:mm:ss
    int? calories,
    double? proteinG,
    double? carbsG,
    double? fatG,
    List<MealIngredient> ingredients = const [],
  }) async {
    await _api.dio.post<void>('/diet-plans/$planId/meals', data: {
      'name': name,
      'scheduledTime': scheduledTime,
      if (calories != null) 'calories': calories,
      if (proteinG != null) 'proteinG': proteinG,
      if (carbsG != null) 'carbsG': carbsG,
      if (fatG != null) 'fatG': fatG,
      'ingredients': ingredients
          .map((i) => {'name': i.name, if (i.quantity != null) 'quantity': i.quantity})
          .toList(),
    });
  }

  Future<void> deleteMeal({required String planId, required String mealId}) async {
    await _api.dio.delete<void>('/diet-plans/$planId/meals/$mealId');
  }
}
