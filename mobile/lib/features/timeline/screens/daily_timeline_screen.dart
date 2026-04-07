import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import '../../../core/di/injection.dart';
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
      create: (_) => TimelineBloc(getIt<TimelineRepository>())
        ..add(TimelineLoadRequested(DateTime.now())),
      child: const _TimelineView(),
    );
  }
}

class _TimelineView extends StatelessWidget {
  const _TimelineView();

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
