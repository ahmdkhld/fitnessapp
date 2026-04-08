import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

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
      ('fat_loss', l.goalFatLoss, Icons.local_fire_department, AppColors.dangerMuted),
      ('muscle_gain', l.goalMuscleGain, Icons.fitness_center, AppColors.accent),
      ('general_health', l.goalGeneralHealth, Icons.favorite, AppColors.accentGreen),
      ('performance', l.goalPerformance, Icons.directions_run, AppColors.accentPurple),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              l.goalHeadline,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.fg,
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: goals.map((g) {
                  final selected = _selected == g.$1;
                  return GestureDetector(
                    onTap: () => setState(() => _selected = g.$1),
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.card,
                        border: Border.all(
                          color: selected ? AppColors.accent : AppColors.border,
                          width: selected ? 2 : 1,
                        ),
                        borderRadius:
                            BorderRadius.circular(AppColors.radiusMd),
                        boxShadow: selected ? AppColors.glowBlueShadow : null,
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 56,
                            height: 56,
                            decoration: BoxDecoration(
                              color: g.$4.withAlpha(38),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(g.$3, size: 28, color: g.$4),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            g.$2,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: selected ? AppColors.fg : AppColors.muted,
                              fontWeight:
                                  selected ? FontWeight.w600 : FontWeight.w400,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _selected == null
                    ? null
                    : () =>
                        context.go('/onboarding/stats?goal=$_selected'),
                style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                ),
                child: Text(l.continueLabel),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
