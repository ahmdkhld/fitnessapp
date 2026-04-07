import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
import '../models/workout_plan.dart';
import '../repositories/workout_plans_repository.dart';

class WorkoutPlansListScreen extends StatefulWidget {
  const WorkoutPlansListScreen({super.key});

  @override
  State<WorkoutPlansListScreen> createState() => _WorkoutPlansListScreenState();
}

class _WorkoutPlansListScreenState extends State<WorkoutPlansListScreen> {
  final _repo = getIt<WorkoutPlansRepository>();
  List<WorkoutPlan> _plans = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _plans = await _repo.list();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _activate(String id) async {
    await _repo.activate(id);
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Workout plans'),
        actions: [
          IconButton(
            icon: const Icon(Icons.library_books),
            tooltip: 'Browse templates',
            onPressed: () => context.push('/workouts/templates'),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: _plans.isEmpty
                  ? ListView(
                      children: [
                        const SizedBox(height: 120),
                        const Icon(Icons.fitness_center, size: 64),
                        const SizedBox(height: 16),
                        const Center(child: Text('No workout plans yet.')),
                        const SizedBox(height: 24),
                        Center(
                          child: FilledButton.icon(
                            onPressed: () => context.push('/workouts/templates'),
                            icon: const Icon(Icons.auto_awesome),
                            label: const Text('Browse templates'),
                          ),
                        ),
                      ],
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _plans.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (_, i) {
                        final plan = _plans[i];
                        return Card(
                          child: ListTile(
                            title: Text(plan.name),
                            subtitle: Text([
                              if (plan.splitType != null) plan.splitType!,
                              if (plan.daysPerWeek != null)
                                '${plan.daysPerWeek} days/week',
                              if (plan.goal != null) plan.goal!,
                            ].join(' · ')),
                            trailing: plan.isActive
                                ? const Chip(label: Text('Active'))
                                : TextButton(
                                    onPressed: () => _activate(plan.id),
                                    child: const Text('Activate'),
                                  ),
                            onTap: () =>
                                context.push('/workouts/plans/${plan.id}'),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
