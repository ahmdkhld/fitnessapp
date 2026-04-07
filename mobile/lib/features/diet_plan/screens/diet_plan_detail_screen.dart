import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../repositories/diet_plan_repository.dart';
import 'meal_editor_screen.dart';

class DietPlanDetailScreen extends StatefulWidget {
  const DietPlanDetailScreen({super.key, required this.planId});

  final String planId;

  @override
  State<DietPlanDetailScreen> createState() => _DietPlanDetailScreenState();
}

class _DietPlanDetailScreenState extends State<DietPlanDetailScreen> {
  final _repo = getIt<DietPlanRepository>();
  Map<String, dynamic>? _plan;
  List<Meal> _meals = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final plan = await _repo.detail(widget.planId);
      setState(() {
        _plan = plan;
        _meals = ((plan['meals'] as List?) ?? [])
            .cast<Map<String, dynamic>>()
            .map(Meal.fromJson)
            .toList();
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _addMeal() async {
    final result = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => MealEditorScreen(planId: widget.planId),
      ),
    );
    if (result == true) await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_plan?['name']?.toString() ?? 'Diet plan')),
      floatingActionButton: FloatingActionButton(
        onPressed: _addMeal,
        child: const Icon(Icons.add),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: _meals.isEmpty
                  ? const Center(child: Text('No meals yet.'))
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _meals.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (_, i) {
                        final m = _meals[i];
                        final ingredients = m.ingredients
                            .map((x) =>
                                x.quantity != null ? '${x.name} (${x.quantity})' : x.name)
                            .join(', ');
                        return Card(
                          child: ListTile(
                            title: Text('${m.scheduledTime}  ·  ${m.name}'),
                            subtitle: Text(
                              [
                                if (m.calories != null) '${m.calories} kcal',
                                if (ingredients.isNotEmpty) ingredients,
                              ].join(' — '),
                            ),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete_outline),
                              onPressed: () async {
                                await _repo.deleteMeal(
                                  planId: widget.planId,
                                  mealId: m.id,
                                );
                                await _load();
                              },
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
