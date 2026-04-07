import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
import '../../../core/notifications/local_notification_service.dart';
import '../models/workout_plan.dart';
import '../models/workout_session.dart';
import '../repositories/workout_plans_repository.dart';
import '../repositories/workout_sessions_repository.dart';

/// The actual "log a workout" experience. Shows each prescribed exercise
/// with an inline set logger, a persistent rest-timer and a complete
/// button that finalises the session.
class SessionActiveScreen extends StatefulWidget {
  const SessionActiveScreen({super.key, required this.sessionId});
  final String sessionId;

  @override
  State<SessionActiveScreen> createState() => _SessionActiveScreenState();
}

class _SessionActiveScreenState extends State<SessionActiveScreen> {
  final _sessionsRepo = getIt<WorkoutSessionsRepository>();
  final _plansRepo = getIt<WorkoutPlansRepository>();
  final _notifier = getIt<LocalNotificationService>();

  WorkoutSession? _session;
  WorkoutPlan? _plan;
  bool _loading = true;

  Timer? _restTimer;
  int _restRemaining = 0;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _restTimer?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final session = await _sessionsRepo.detail(widget.sessionId);
      _session = session;
      if (session.day?.id != null) {
        // Fetch the full day exercise prescription from the plan
        if (session.day?.exercises.isEmpty ?? true) {
          // Walk up via the plan id since `day.plan` was stripped
          // in the repository; skip if not present.
        }
      }
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  void _startRest(int seconds) {
    _restTimer?.cancel();
    setState(() => _restRemaining = seconds);
    _restTimer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) {
        t.cancel();
        return;
      }
      setState(() => _restRemaining--);
      if (_restRemaining <= 0) {
        t.cancel();
        _notifier.schedule(
          id: 900001,
          title: 'Rest done',
          body: 'Start your next set.',
          when: DateTime.now().add(const Duration(seconds: 1)),
        );
      }
    });
  }

  Future<void> _logSet({
    required String exerciseId,
    required int setNumber,
    int? reps,
    double? weightKg,
    int? restSeconds,
    bool isCardio = false,
    int? durationSec,
    double? distanceKm,
  }) async {
    try {
      await _sessionsRepo.logSet(
        sessionId: widget.sessionId,
        exerciseId: exerciseId,
        setNumber: setNumber,
        reps: reps,
        weightKg: weightKg,
        durationSec: durationSec,
        distanceKm: distanceKm,
      );
      if (!isCardio && restSeconds != null && restSeconds > 0) {
        _startRest(restSeconds);
      }
      await _load();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Set save failed: $e')),
      );
    }
  }

  Future<void> _complete() async {
    try {
      await _sessionsRepo.complete(widget.sessionId);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Session complete — nice work!')),
      );
      context.go('/workouts');
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Complete failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    final session = _session;
    if (session == null) {
      return const Scaffold(body: Center(child: Text('Session not found')));
    }

    final setsByExercise = <String, List<WorkoutSet>>{};
    for (final s in session.sets) {
      setsByExercise.putIfAbsent(s.exerciseId, () => []).add(s);
    }

    final prescribedExercises = session.day?.exercises ?? const [];

    return Scaffold(
      appBar: AppBar(
        title: Text(session.day?.name ?? 'Freeform workout'),
        actions: [
          TextButton(
            onPressed: _complete,
            child: const Text('Finish', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      bottomNavigationBar: _restRemaining > 0
          ? Container(
              color: Theme.of(context).colorScheme.primaryContainer,
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.timer),
                  const SizedBox(width: 8),
                  Text(
                    'Rest: ${_restRemaining}s',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(width: 16),
                  TextButton(
                    onPressed: () {
                      _restTimer?.cancel();
                      setState(() => _restRemaining = 0);
                    },
                    child: const Text('Skip'),
                  ),
                ],
              ),
            )
          : null,
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: prescribedExercises.length,
        itemBuilder: (_, i) {
          final px = prescribedExercises[i];
          final logged = setsByExercise[px.exercise.id] ?? const [];
          return _ExerciseLogger(
            prescription: px,
            loggedSets: logged,
            onLogSet: ({
              required int setNumber,
              int? reps,
              double? weightKg,
              int? durationSec,
              double? distanceKm,
            }) =>
                _logSet(
              exerciseId: px.exercise.id,
              setNumber: setNumber,
              reps: reps,
              weightKg: weightKg,
              restSeconds: px.restSeconds,
              isCardio: px.exercise.isCardio,
              durationSec: durationSec,
              distanceKm: distanceKm,
            ),
          );
        },
      ),
    );
  }
}

class _ExerciseLogger extends StatefulWidget {
  const _ExerciseLogger({
    required this.prescription,
    required this.loggedSets,
    required this.onLogSet,
  });

  final WorkoutDayExercise prescription;
  final List<WorkoutSet> loggedSets;
  final Future<void> Function({
    required int setNumber,
    int? reps,
    double? weightKg,
    int? durationSec,
    double? distanceKm,
  }) onLogSet;

  @override
  State<_ExerciseLogger> createState() => _ExerciseLoggerState();
}

class _ExerciseLoggerState extends State<_ExerciseLogger> {
  final _repsCtrl = TextEditingController();
  final _weightCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();
  final _distanceCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.prescription.targetWeightKg != null) {
      _weightCtrl.text = widget.prescription.targetWeightKg.toString();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isCardio = widget.prescription.exercise.isCardio;
    final nextSetNumber = widget.loggedSets.length + 1;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.prescription.exercise.name,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            Text(
              [
                '${widget.prescription.targetSets} × ${widget.prescription.targetReps ?? "?"}',
                if (widget.prescription.targetWeightKg != null)
                  '@ ${widget.prescription.targetWeightKg}kg',
                if (widget.prescription.restSeconds != null)
                  'rest ${widget.prescription.restSeconds}s',
              ].join(' · '),
              style: const TextStyle(color: Colors.grey, fontSize: 12),
            ),
            const SizedBox(height: 12),
            ...widget.loggedSets.map((s) => _SetRow(set: s)),
            const Divider(),
            if (isCardio)
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _durationCtrl,
                      keyboardType: TextInputType.number,
                      decoration:
                          const InputDecoration(labelText: 'Duration (sec)'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _distanceCtrl,
                      keyboardType:
                          const TextInputType.numberWithOptions(decimal: true),
                      decoration:
                          const InputDecoration(labelText: 'Distance (km)'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    icon: const Icon(Icons.add),
                    onPressed: () async {
                      await widget.onLogSet(
                        setNumber: nextSetNumber,
                        durationSec: int.tryParse(_durationCtrl.text),
                        distanceKm: double.tryParse(_distanceCtrl.text),
                      );
                    },
                  ),
                ],
              )
            else
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _weightCtrl,
                      keyboardType:
                          const TextInputType.numberWithOptions(decimal: true),
                      decoration: const InputDecoration(labelText: 'Weight kg'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: _repsCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Reps'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    icon: const Icon(Icons.add),
                    onPressed: () async {
                      await widget.onLogSet(
                        setNumber: nextSetNumber,
                        reps: int.tryParse(_repsCtrl.text),
                        weightKg: double.tryParse(_weightCtrl.text),
                      );
                      _repsCtrl.clear();
                    },
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}

class _SetRow extends StatelessWidget {
  const _SetRow({required this.set});
  final WorkoutSet set;

  @override
  Widget build(BuildContext context) {
    final parts = <String>[
      if (set.weightKg != null) '${set.weightKg!.toStringAsFixed(1)} kg',
      if (set.reps != null) '${set.reps} reps',
      if (set.durationSec != null) '${set.durationSec}s',
      if (set.distanceKm != null) '${set.distanceKm} km',
      if (set.rpe != null) 'RPE ${set.rpe}',
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          SizedBox(
            width: 28,
            child: Text('#${set.setNumber}',
                style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
          Expanded(child: Text(parts.join(' · '))),
          const Icon(Icons.check, size: 16, color: Colors.green),
        ],
      ),
    );
  }
}
