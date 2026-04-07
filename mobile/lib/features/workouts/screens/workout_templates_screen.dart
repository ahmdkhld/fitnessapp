import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
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
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(t.name,
                            style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 4),
                        Text(
                          [
                            if (t.splitType != null) t.splitType!,
                            if (t.daysPerWeek != null) '${t.daysPerWeek}×/week',
                            if (t.goal != null) t.goal!,
                          ].join(' · '),
                          style: const TextStyle(color: Colors.grey),
                        ),
                        if (t.description != null) ...[
                          const SizedBox(height: 8),
                          Text(t.description!),
                        ],
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          children: t.days
                              .map((d) => Chip(label: Text(d.name)))
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
                  ),
                );
              },
            ),
    );
  }
}
