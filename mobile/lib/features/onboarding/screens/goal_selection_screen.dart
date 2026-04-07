import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class GoalSelectionScreen extends StatefulWidget {
  const GoalSelectionScreen({super.key});

  @override
  State<GoalSelectionScreen> createState() => _GoalSelectionScreenState();
}

class _GoalSelectionScreenState extends State<GoalSelectionScreen> {
  String? _selected;

  static const _goals = [
    ('fat_loss', 'Fat loss', Icons.local_fire_department),
    ('muscle_gain', 'Muscle gain', Icons.fitness_center),
    ('general_health', 'General health', Icons.favorite),
    ('performance', 'Athletic performance', Icons.directions_run),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Your goal')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              'What are you working towards?',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: _goals.map((g) {
                  final selected = _selected == g.$1;
                  return InkWell(
                    onTap: () => setState(() => _selected = g.$1),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      decoration: BoxDecoration(
                        color: selected
                            ? Theme.of(context).colorScheme.primaryContainer
                            : Theme.of(context).colorScheme.surface,
                        border: Border.all(
                          color: selected
                              ? Theme.of(context).colorScheme.primary
                              : Theme.of(context).dividerColor,
                          width: selected ? 2 : 1,
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(g.$3, size: 48),
                          const SizedBox(height: 12),
                          Text(g.$2, textAlign: TextAlign.center),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            FilledButton(
              onPressed: _selected == null
                  ? null
                  : () => context.go('/onboarding/plan?goal=$_selected'),
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
              ),
              child: const Text('Continue'),
            ),
          ],
        ),
      ),
    );
  }
}
