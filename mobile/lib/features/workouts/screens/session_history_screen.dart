import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/di/injection.dart';
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
    return Scaffold(
      appBar: AppBar(title: const Text('Workout history')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: _sessions.isEmpty
                  ? const Center(child: Text('No sessions logged yet.'))
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _sessions.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (_, i) {
                        final s = _sessions[i];
                        final totalVolume = s.sets.fold<double>(0, (sum, set) {
                          if (set.weightKg == null || set.reps == null) {
                            return sum;
                          }
                          return sum + set.weightKg! * set.reps!;
                        });
                        return Card(
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: s.status == 'completed'
                                  ? Colors.green
                                  : Colors.grey,
                              child: Icon(
                                s.status == 'completed'
                                    ? Icons.check
                                    : Icons.pending,
                                color: Colors.white,
                              ),
                            ),
                            title: Text(s.day?.name ?? 'Freeform workout'),
                            subtitle: Text([
                              DateFormat.yMMMd().format(s.date),
                              if (s.durationMin != null)
                                '${s.durationMin} min',
                              '${s.sets.length} sets',
                              if (totalVolume > 0)
                                '${totalVolume.round()} kg volume',
                            ].join(' · ')),
                            onTap: s.status == 'in_progress'
                                ? () => context.push(
                                      '/workouts/sessions/${s.id}/active',
                                    )
                                : null,
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
