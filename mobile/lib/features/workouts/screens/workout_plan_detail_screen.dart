import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
import '../models/workout_plan.dart';
import '../repositories/workout_plans_repository.dart';
import '../repositories/workout_sessions_repository.dart';

class WorkoutPlanDetailScreen extends StatefulWidget {
  const WorkoutPlanDetailScreen({super.key, required this.planId});
  final String planId;

  @override
  State<WorkoutPlanDetailScreen> createState() =>
      _WorkoutPlanDetailScreenState();
}

class _WorkoutPlanDetailScreenState extends State<WorkoutPlanDetailScreen> {
  final _plansRepo = getIt<WorkoutPlansRepository>();
  final _sessionsRepo = getIt<WorkoutSessionsRepository>();
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
      _plan = await _plansRepo.detail(widget.planId);
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _startSession(WorkoutDay day) async {
    try {
      final session =
          await _sessionsRepo.start(workoutDayId: day.id);
      if (!mounted) return;
      context.push('/workouts/sessions/${session.id}/active');
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Start failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final plan = _plan;
    return Scaffold(
      appBar: AppBar(
        title: Text(plan?.name ?? 'Plan'),
        actions: [
          if (plan != null && !plan.isActive)
            TextButton(
              onPressed: () async {
                await _plansRepo.activate(plan.id);
                await _load();
              },
              child: const Text('Activate'),
            ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : plan == null
              ? const Center(child: Text('Failed to load'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: plan.days.length,
                  itemBuilder: (_, i) {
                    final d = plan.days[i];
                    return Card(
                      child: ExpansionTile(
                        title: Text(d.name),
                        subtitle: Text(
                          [
                            if (d.dayOfWeek != null)
                              _dayName(d.dayOfWeek!),
                            if (d.estimatedDurationMin != null)
                              '${d.estimatedDurationMin} min',
                            '${d.exercises.length} exercises',
                          ].join(' · '),
                        ),
                        trailing: FilledButton(
                          onPressed: () => _startSession(d),
                          child: const Text('Start'),
                        ),
                        children: [
                          ...d.exercises.map((e) => ListTile(
                                dense: true,
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
                                    if (e.restSeconds != null)
                                      'rest ${e.restSeconds}s',
                                  ].join(' · '),
                                ),
                              )),
                        ],
                      ),
                    );
                  },
                ),
    );
  }

  String _dayName(int d) =>
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1];
}
