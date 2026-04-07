import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/connectivity/connectivity_monitor.dart';
import '../../../core/di/injection.dart';
import '../../../core/notifications/local_notification_service.dart';
import '../../../models/schedule_item.dart';
import '../../workouts/repositories/workout_sessions_repository.dart';
import '../bloc/timeline_bloc.dart';
import '../bloc/timeline_event.dart';
import '../bloc/timeline_state.dart';
import '../repositories/timeline_repository.dart';
import '../widgets/timeline_card.dart';

class DailyTimelineScreen extends StatelessWidget {
  const DailyTimelineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => TimelineBloc(
        getIt<TimelineRepository>(),
        getIt<LocalNotificationService>(),
        getIt<ConnectivityMonitor>(),
      )..add(TimelineLoadRequested(DateTime.now())),
      child: const _TimelineView(),
    );
  }
}

class _TimelineView extends StatelessWidget {
  const _TimelineView();

  Future<void> _onTap(BuildContext context, ScheduleItem item) async {
    if (item.itemType != 'workout' || item.referenceId == null) return;
    try {
      final session = await getIt<WorkoutSessionsRepository>().start(
        workoutDayId: item.referenceId,
      );
      if (!context.mounted) return;
      context.push('/workouts/sessions/${session.id}/active');
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not start workout: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(DateFormat.yMMMMEEEEd().format(DateTime.now()))),
      body: BlocBuilder<TimelineBloc, TimelineState>(
        builder: (context, state) {
          switch (state.status) {
            case TimelineStatus.initial:
            case TimelineStatus.loading:
              return const Center(child: CircularProgressIndicator());
            case TimelineStatus.failure:
              return _ErrorView(
                error: state.error ?? 'Unknown error',
                onRetry: () => context
                    .read<TimelineBloc>()
                    .add(TimelineLoadRequested(DateTime.now())),
              );
            case TimelineStatus.success:
              if (state.items.isEmpty) {
                return const Center(child: Text('Nothing scheduled today.'));
              }
              return RefreshIndicator(
                onRefresh: () async {
                  context
                      .read<TimelineBloc>()
                      .add(TimelineLoadRequested(DateTime.now()));
                },
                child: ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: state.items.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (_, i) {
                    final item = state.items[i];
                    return TimelineCard(
                      item: item,
                      onTap: item.itemType == 'workout'
                          ? () => _onTap(context, item)
                          : null,
                      onComplete: () => context.read<TimelineBloc>().add(
                            TimelineItemStatusChanged(
                              itemId: item.id,
                              status: item.status == 'completed'
                                  ? 'pending'
                                  : 'completed',
                            ),
                          ),
                    );
                  },
                ),
              );
          }
        },
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.error, required this.onRetry});
  final String error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 48),
          const SizedBox(height: 12),
          Text(error, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          FilledButton(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}
