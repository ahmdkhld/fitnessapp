import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/di/injection.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/themed_colors.dart';
import '../models/workout_session.dart';
import '../repositories/workout_sessions_repository.dart';

class SessionHistoryScreen extends StatefulWidget {
  const SessionHistoryScreen({super.key});

  @override
  State<SessionHistoryScreen> createState() => _SessionHistoryScreenState();
}

class _SessionHistoryScreenState extends State<SessionHistoryScreen> {
  final _repo = getIt<WorkoutSessionsRepository>();
  List<WorkoutSession> _sessions = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _sessions = await _repo.list();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Workout history')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: _sessions.isEmpty
                  ? Center(
                      child: Text('No sessions logged yet.',
                          style: TextStyle(color: c.muted)))
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _sessions.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (_, i) {
                        final s = _sessions[i];
                        final completed = s.status == 'completed';
                        final totalVolume =
                            s.sets.fold<double>(0, (sum, set) {
                          if (set.weightKg == null || set.reps == null) {
                            return sum;
                          }
                          return sum + set.weightKg! * set.reps!;
                        });
                        return Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: c.card,
                            borderRadius:
                                BorderRadius.circular(AppColors.radiusMd),
                            border: Border.all(color: c.border),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: completed
                                      ? AppColors.badgeGreenBg
                                      : c.border,
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  completed
                                      ? Icons.check
                                      : Icons.pending,
                                  color: completed
                                      ? AppColors.accentGreen
                                      : c.muted,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      s.day?.name ?? 'Freeform workout',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w500,
                                        fontSize: 15,
                                        color: c.fg,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      [
                                        DateFormat.yMMMd().format(s.date),
                                        if (s.durationMin != null)
                                          '${s.durationMin} min',
                                        '${s.sets.length} sets',
                                        if (totalVolume > 0)
                                          '${totalVolume.round()} kg vol',
                                      ].join(' \u00b7 '),
                                      style: TextStyle(
                                        color: c.muted,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              if (!completed)
                                TextButton(
                                  onPressed: () => context.push(
                                    '/workouts/sessions/${s.id}/active',
                                  ),
                                  child: const Text('Resume'),
                                ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
