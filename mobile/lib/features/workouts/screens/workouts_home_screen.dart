import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
import '../../../core/theme/app_colors.dart';
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
    final l = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(l.workoutsTab),
        actions: [
          IconButton(
            icon: const Icon(Icons.bar_chart),
            tooltip: l.workoutAnalyticsTitle,
            onPressed: () => context.push('/workouts/analytics'),
          ),
          IconButton(
            icon: const Icon(Icons.library_books),
            tooltip: l.workoutLibrary,
            onPressed: () => context.push('/workouts/library'),
          ),
          IconButton(
            icon: const Icon(Icons.history),
            tooltip: l.workoutHistory,
            onPressed: () => context.push('/workouts/history'),
          ),
          IconButton(
            icon: const Icon(Icons.list_alt),
            tooltip: l.workoutPlans,
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
                    // No active plan — prompt to pick one
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.card,
                        borderRadius:
                            BorderRadius.circular(AppColors.radiusMd),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: const BoxDecoration(
                              color: AppColors.badgePurpleBg,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.auto_awesome,
                                color: AppColors.accentPurple),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(l.pickPlanPrompt,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 15)),
                                const SizedBox(height: 2),
                                Text(l.browseTemplates,
                                    style: const TextStyle(
                                        color: AppColors.muted, fontSize: 13)),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.chevron_right,
                                color: AppColors.muted),
                            onPressed: () =>
                                context.push('/workouts/templates'),
                          ),
                        ],
                      ),
                    )
                  else if (_todayDay != null)
                    // Today's workout — accent card with glow
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.card,
                        borderRadius:
                            BorderRadius.circular(AppColors.radiusMd),
                        border: Border.all(
                            color: AppColors.accent.withAlpha(100)),
                        boxShadow: AppColors.glowBlueShadow,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            l.workoutsToday.toUpperCase(),
                            style: const TextStyle(
                              color: AppColors.muted,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            _todayDay!.name,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: AppColors.fg,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${_todayDay!.exercises.length} ${l.exercises} \u00b7 '
                            '${_todayDay!.estimatedDurationMin ?? 60} min',
                            style: const TextStyle(
                                color: AppColors.muted, fontSize: 14),
                          ),
                          const SizedBox(height: 16),
                          FilledButton.icon(
                            onPressed: () => context.push(
                              '/workouts/plans/${_activePlan!.id}',
                            ),
                            icon: const Icon(Icons.play_arrow),
                            label: Text(l.startWorkout),
                          ),
                        ],
                      ),
                    )
                  else
                    // Rest day
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.card,
                        borderRadius:
                            BorderRadius.circular(AppColors.radiusMd),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: const BoxDecoration(
                              color: AppColors.badgeGreenBg,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.self_improvement,
                                size: 28, color: AppColors.accentGreen),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(l.restDay,
                                    style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600)),
                                Text('"${_activePlan!.name}"',
                                    style: const TextStyle(
                                        color: AppColors.muted, fontSize: 13)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 24),
                  const Text(
                    'PERSONAL RECORDS',
                    style: TextStyle(
                      color: AppColors.muted,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 10),
                  if (_prs.isEmpty)
                    Text(l.noPrsYet,
                        style: const TextStyle(
                            color: AppColors.muted, fontSize: 14)),
                  ..._prs.take(5).map((pr) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: AppColors.card,
                            borderRadius:
                                BorderRadius.circular(AppColors.radiusMd),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 36,
                                height: 36,
                                decoration: const BoxDecoration(
                                  color: AppColors.badgeAmberBg,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.emoji_events,
                                    size: 18, color: AppColors.badgeAmber),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(pr.exerciseName,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 14)),
                                    Text(
                                      '${pr.recordType.replaceAll("_", " ")} \u00b7 '
                                      '${pr.value} ${pr.unit}',
                                      style: const TextStyle(
                                          color: AppColors.muted,
                                          fontSize: 13),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      )),
                ],
              ),
            ),
    );
  }
}
