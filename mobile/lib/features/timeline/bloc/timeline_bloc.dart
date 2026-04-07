import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/connectivity/connectivity_monitor.dart';
import '../../../core/notifications/local_notification_service.dart';
import '../../../models/schedule_item.dart';
import '../repositories/timeline_repository.dart';
import 'timeline_event.dart';
import 'timeline_state.dart';

class TimelineBloc extends Bloc<TimelineEvent, TimelineState> {
  TimelineBloc(this._repo, this._notifier, this._connectivity)
      : super(const TimelineState()) {
    on<TimelineLoadRequested>(_onLoad);
    on<TimelineItemStatusChanged>(_onStatusChanged);

    // Auto-flush queued offline updates the moment the device is online.
    _connectivitySub = _connectivity.onChanged.listen((online) {
      if (online) {
        _repo.flushQueue();
        if (state.date != null) {
          add(TimelineLoadRequested(state.date!));
        }
      }
    });
  }

  final TimelineRepository _repo;
  final LocalNotificationService _notifier;
  final ConnectivityMonitor _connectivity;
  late final StreamSubscription<bool> _connectivitySub;

  @override
  Future<void> close() {
    _connectivitySub.cancel();
    return super.close();
  }

  Future<void> _onLoad(
    TimelineLoadRequested event,
    Emitter<TimelineState> emit,
  ) async {
    emit(state.copyWith(status: TimelineStatus.loading, date: event.date));
    try {
      await _repo.flushQueue();
      final items = await _repo.fetchDay(event.date);
      emit(state.copyWith(status: TimelineStatus.success, items: items));
      await _scheduleReminders(items);
    } catch (e) {
      emit(state.copyWith(status: TimelineStatus.failure, error: e.toString()));
    }
  }

  Future<void> _onStatusChanged(
    TimelineItemStatusChanged event,
    Emitter<TimelineState> emit,
  ) async {
    final updated = state.items.map((i) {
      if (i.id == event.itemId) {
        return ScheduleItem(
          id: i.id,
          itemType: i.itemType,
          title: i.title,
          subtitle: i.subtitle,
          scheduledTime: i.scheduledTime,
          status: event.status,
        );
      }
      return i;
    }).toList();
    emit(state.copyWith(items: updated));
    await _repo.updateStatus(event.itemId, event.status);

    if (event.status == 'completed') {
      await _notifier.cancel(_notificationId(event.itemId));
    }
  }

  Future<void> _scheduleReminders(List<ScheduleItem> items) async {
    await _notifier.cancelAll();
    final now = DateTime.now();
    for (final item in items) {
      if (item.status == 'completed') continue;
      final when = DateTime(
        now.year,
        now.month,
        now.day,
        item.scheduledTime.toLocal().hour,
        item.scheduledTime.toLocal().minute,
      );
      if (when.isBefore(now)) continue;
      await _notifier.schedule(
        id: _notificationId(item.id),
        title: item.title,
        body: item.subtitle ?? 'Time for your ${item.itemType}',
        when: when,
      );
    }
  }

  int _notificationId(String itemId) {
    int hash = 0;
    for (final codeUnit in itemId.codeUnits) {
      hash = (hash * 31 + codeUnit) & 0x7fffffff;
    }
    return hash;
  }
}
