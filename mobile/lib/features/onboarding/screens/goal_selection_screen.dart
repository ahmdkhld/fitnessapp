import 'package:flutter/material.dart';
import 'package:nutritrack/l10n/app_localizations.dart';
import 'package:go_router/go_router.dart';

class GoalSelectionScreen extends StatefulWidget {
  const GoalSelectionScreen({super.key});

  @override
  State<GoalSelectionScreen> createState() => _GoalSelectionScreenState();
}

class _GoalSelectionScreenState extends State<GoalSelectionScreen> {
  String? _selected;

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    final goals = [
      ('fat_loss', l.goalFatLoss, Icons.local_fire_department),
      ('muscle_gain', l.goalMuscleGain, Icons.fitness_center),
      ('general_health', l.goalGeneralHealth, Icons.favorite),
      ('performance', l.goalPerformance, Icons.directions_run),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              l.goalHeadline,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: goals.map((g) {
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
                  : () => context.go('/onboarding/stats?goal=$_selected'),
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
              ),
              child: Text(l.continueLabel),
            ),
          ],
        ),
      ),
    );
  }
}
