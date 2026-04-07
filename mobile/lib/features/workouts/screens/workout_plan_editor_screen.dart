import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../models/exercise.dart';
import '../models/workout_plan.dart';
import '../repositories/workout_plans_repository.dart';
import 'exercises_library_screen.dart';

/// Edit mode for a personal (non-template) workout plan. Lets the user
/// add/remove days and add/remove exercises in each day, reaching into
/// the exercise library browser as a picker.
class WorkoutPlanEditorScreen extends StatefulWidget {
  const WorkoutPlanEditorScreen({super.key, required this.planId});
  final String planId;

  @override
  State<WorkoutPlanEditorScreen> createState() =>
      _WorkoutPlanEditorScreenState();
}

class _WorkoutPlanEditorScreenState extends State<WorkoutPlanEditorScreen> {
  final _repo = getIt<WorkoutPlansRepository>();
  WorkoutPlan? _plan;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _plan = await _repo.detail(widget.planId);
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _addDay() async {
    final nameCtrl = TextEditingController();
    int? dayOfWeek;
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add day'),
        content: StatefulBuilder(
          builder: (ctx, setSt) => Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: 'Day name'),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<int?>(
                decoration: const InputDecoration(labelText: 'Day of week'),
                value: dayOfWeek,
                items: [
                  const DropdownMenuItem(value: null, child: Text('Flexible')),
                  ...List.generate(7, (i) {
                    const names = [
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ];
                    return DropdownMenuItem(value: i + 1, child: Text(names[i]));
                  }),
                ],
                onChanged: (v) => setSt(() => dayOfWeek = v),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Add'),
          ),
        ],
      ),
    );
    if (ok == true && nameCtrl.text.isNotEmpty) {
      await _repo.addDay(
        planId: widget.planId,
        name: nameCtrl.text,
        dayOfWeek: dayOfWeek,
        sortOrder: _plan?.days.length ?? 0,
      );
      await _load();
    }
  }

  Future<void> _addExercise(String dayId) async {
    final picked = await Navigator.of(context).push<Exercise>(
      MaterialPageRoute(
        builder: (_) => ExercisesLibraryScreen(
          onPick: (e) => Navigator.pop(context, e),
        ),
      ),
    );
    if (picked == null) return;

    final setsCtrl = TextEditingController(text: '3');
    final repsCtrl = TextEditingController(text: '8-12');
    final weightCtrl = TextEditingController();
    final restCtrl = TextEditingController(text: '90');
    final progCtrl = TextEditingController(text: '2.5');

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(picked.name),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: setsCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Sets'),
              ),
              TextField(
                controller: repsCtrl,
                decoration: const InputDecoration(labelText: 'Reps'),
              ),
              if (!picked.isCardio) ...[
                TextField(
                  controller: weightCtrl,
                  keyboardType:
                      const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(labelText: 'Target kg'),
                ),
                TextField(
                  controller: progCtrl,
                  keyboardType:
                      const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(
                    labelText: 'Auto-progress kg per success',
                  ),
                ),
              ],
              TextField(
                controller: restCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Rest sec'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Add'),
          ),
        ],
      ),
    );

    if (ok == true) {
      await _repo.addExerciseToDay(
        dayId: dayId,
        exerciseId: picked.id,
        targetSets: int.tryParse(setsCtrl.text) ?? 3,
        targetReps: repsCtrl.text.isEmpty ? null : repsCtrl.text,
        targetWeightKg: double.tryParse(weightCtrl.text),
        restSeconds: int.tryParse(restCtrl.text),
        progressionKg: double.tryParse(progCtrl.text) ?? 0,
      );
      await _load();
    }
  }

  Future<void> _removeDayExercise(String rowId) async {
    await _repo.removeDayExercise(rowId);
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    final plan = _plan;
    return Scaffold(
      appBar: AppBar(
        title: Text(plan?.name ?? 'Edit plan'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Add day',
            onPressed: _addDay,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : plan == null
              ? const Center(child: Text('Failed to load'))
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: plan.days.map((day) {
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    day.name,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleMedium,
                                  ),
                                ),
                                TextButton.icon(
                                  icon: const Icon(Icons.add),
                                  label: const Text('Exercise'),
                                  onPressed: () => _addExercise(day.id),
                                ),
                              ],
                            ),
                            ...day.exercises.map(
                              (e) => ListTile(
                                dense: true,
                                contentPadding: EdgeInsets.zero,
                                leading: Icon(
                                  e.exercise.isCardio
                                      ? Icons.directions_run
                                      : Icons.fitness_center,
                                ),
                                title: Text(e.exercise.name),
                                subtitle: Text(
                                  [
                                    '${e.targetSets} × ${e.targetReps ?? "?"}',
                                    if (e.targetWeightKg != null)
                                      '@ ${e.targetWeightKg}kg',
                                    if (e.progressionKg > 0)
                                      '+${e.progressionKg}kg',
                                  ].join(' · '),
                                ),
                                trailing: IconButton(
                                  icon: const Icon(Icons.close),
                                  onPressed: () => _removeDayExercise(e.id),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
    );
  }
}
