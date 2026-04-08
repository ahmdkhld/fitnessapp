import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
import '../../../core/theme/app_colors.dart';
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
                        const Icon(Icons.fitness_center,
                            size: 64, color: AppColors.muted),
                        const SizedBox(height: 16),
                        const Center(
                          child: Text('No workout plans yet.',
                              style: TextStyle(color: AppColors.muted)),
                        ),
                        const SizedBox(height: 24),
                        Center(
                          child: FilledButton.icon(
                            onPressed: () =>
                                context.push('/workouts/templates'),
                            icon: const Icon(Icons.auto_awesome),
                            label: const Text('Browse templates'),
                          ),
                        ),
                      ],
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _plans.length,
                      separatorBuilder: (_, __) =>
                          const SizedBox(height: 8),
                      itemBuilder: (_, i) {
                        final plan = _plans[i];
                        return Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: AppColors.card,
                            borderRadius:
                                BorderRadius.circular(AppColors.radiusMd),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: InkWell(
                            borderRadius:
                                BorderRadius.circular(AppColors.radiusMd),
                            onTap: () => context
                                .push('/workouts/plans/${plan.id}'),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        plan.name,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w500,
                                          fontSize: 15,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        [
                                          if (plan.splitType != null)
                                            plan.splitType!,
                                          if (plan.daysPerWeek != null)
                                            '${plan.daysPerWeek} days/week',
                                          if (plan.goal != null) plan.goal!,
                                        ].join(' \u00b7 '),
                                        style: const TextStyle(
                                          color: AppColors.muted,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                if (plan.isActive)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 10, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppColors.badgeGreenBg,
                                      borderRadius:
                                          BorderRadius.circular(9999),
                                      border: Border.all(
                                          color: AppColors.accentGreen
                                              .withAlpha(77)),
                                    ),
                                    child: const Text(
                                      'Active',
                                      style: TextStyle(
                                        color: AppColors.accentGreen,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  )
                                else
                                  TextButton(
                                    onPressed: () => _activate(plan.id),
                                    child: const Text('Activate'),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
