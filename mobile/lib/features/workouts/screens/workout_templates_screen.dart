import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/themed_colors.dart';
import '../models/workout_plan.dart';
import '../repositories/workout_plans_repository.dart';

class WorkoutTemplatesScreen extends StatefulWidget {
  const WorkoutTemplatesScreen({super.key});

  @override
  State<WorkoutTemplatesScreen> createState() => _WorkoutTemplatesScreenState();
}

class _WorkoutTemplatesScreenState extends State<WorkoutTemplatesScreen> {
  final _repo = getIt<WorkoutPlansRepository>();
  List<WorkoutPlan> _templates = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _templates = await _repo.templates();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _clone(WorkoutPlan template) async {
    try {
      final copy = await _repo.cloneTemplate(template.id);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Added "${copy.name}" to your plans')),
      );
      context.go('/workouts/plans/${copy.id}');
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Plan templates')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _templates.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (_, i) {
                final t = _templates[i];
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: c.card,
                    borderRadius:
                        BorderRadius.circular(AppColors.radiusMd),
                    border: Border.all(color: c.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(t.name,
                          style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600)),
                      const SizedBox(height: 4),
                      Text(
                        [
                          if (t.splitType != null) t.splitType!,
                          if (t.daysPerWeek != null)
                            '${t.daysPerWeek}\u00d7/week',
                          if (t.goal != null) t.goal!,
                        ].join(' \u00b7 '),
                        style: TextStyle(
                            color: c.muted, fontSize: 13),
                      ),
                      if (t.description != null) ...[
                        const SizedBox(height: 8),
                        Text(t.description!,
                            style: TextStyle(
                                color: c.muted, fontSize: 14)),
                      ],
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 6,
                        children: t.days
                            .map((d) => Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.badgePurpleBg,
                                    borderRadius:
                                        BorderRadius.circular(9999),
                                    border: Border.all(
                                        color: AppColors.accentPurple
                                            .withAlpha(77)),
                                  ),
                                  child: Text(
                                    d.name,
                                    style: const TextStyle(
                                      color: AppColors.accentPurple,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ))
                            .toList(),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          FilledButton.icon(
                            onPressed: () => _clone(t),
                            icon: const Icon(Icons.add),
                            label: const Text('Use this plan'),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
