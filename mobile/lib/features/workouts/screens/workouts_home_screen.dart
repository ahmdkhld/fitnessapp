import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
import '../models/workout_plan.dart';
import '../repositories/workout_analytics_repository.dart';
import '../repositories/workout_plans_repository.dart';

/// Landing screen for the Workouts tab. Shows today's prescribed workout
/// (if the active plan has a matching day) and recent PRs.
class WorkoutsHomeScreen extends StatefulWidget {
  const WorkoutsHomeScreen({super.key});

  @override
  State<WorkoutsHomeScreen> createState() => _WorkoutsHomeScreenState();
}

class _WorkoutsHomeScreenState extends State<WorkoutsHomeScreen> {
  final _plansRepo = getIt<WorkoutPlansRepository>();
  final _analyticsRepo = getIt<WorkoutAnalyticsRepository>();
  WorkoutPlan? _activePlan;
  WorkoutDay? _todayDay;
  List<PersonalRecord> _prs = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final plans = await _plansRepo.list();
      _activePlan = plans.where((p) => p.isActive).isEmpty
          ? null
          : plans.firstWhere((p) => p.isActive);
      if (_activePlan != null) {
        final detail = await _plansRepo.detail(_activePlan!.id);
        final today = DateTime.now().weekday;
        _todayDay = detail.days.where((d) => d.dayOfWeek == today).isEmpty
            ? null
            : detail.days.firstWhere((d) => d.dayOfWeek == today);
      }
      _prs = await _analyticsRepo.prs();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Workouts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            tooltip: 'History',
            onPressed: () => context.push('/workouts/history'),
          ),
          IconButton(
            icon: const Icon(Icons.list_alt),
            tooltip: 'Plans',
            onPressed: () => context.push('/workouts/plans'),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  if (_activePlan == null)
                    Card(
                      child: ListTile(
                        leading: const Icon(Icons.auto_awesome, size: 36),
                        title: const Text('Pick a plan to get started'),
                        subtitle: const Text(
                          'Browse proven templates like PPL, Upper/Lower, '
                          'Starting Strength or 5/3/1.',
                        ),
                        onTap: () => context.push('/workouts/templates'),
                      ),
                    )
                  else if (_todayDay != null)
                    Card(
                      color: Theme.of(context).colorScheme.primaryContainer,
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Today',
                                style: Theme.of(context)
                                    .textTheme
                                    .labelLarge),
                            const SizedBox(height: 4),
                            Text(
                              _todayDay!.name,
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineSmall,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${_todayDay!.exercises.length} exercises · '
                              '${_todayDay!.estimatedDurationMin ?? 60} min',
                            ),
                            const SizedBox(height: 16),
                            FilledButton.icon(
                              onPressed: () => context.push(
                                '/workouts/plans/${_activePlan!.id}',
                              ),
                              icon: const Icon(Icons.play_arrow),
                              label: const Text('View & start'),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    Card(
                      child: ListTile(
                        leading: const Icon(Icons.self_improvement, size: 36),
                        title: const Text('Rest day'),
                        subtitle: Text(
                          'No workout scheduled today in "${_activePlan!.name}".',
                        ),
                      ),
                    ),
                  const SizedBox(height: 24),
                  Text('Recent PRs',
                      style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  if (_prs.isEmpty)
                    const Text('Keep logging — PRs will show up here.'),
                  ..._prs.take(5).map((pr) => Card(
                        child: ListTile(
                          leading: const Icon(Icons.emoji_events,
                              color: Colors.amber),
                          title: Text(pr.exerciseName),
                          subtitle: Text(
                              '${pr.recordType.replaceAll("_", " ")} · '
                              '${pr.value} ${pr.unit}'),
                        ),
                      )),
                ],
              ),
            ),
    );
  }
}
