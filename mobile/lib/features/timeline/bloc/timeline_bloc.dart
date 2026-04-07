import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/notifications/local_notification_service.dart';
import '../../../models/schedule_item.dart';
import '../repositories/timeline_repository.dart';
import 'timeline_event.dart';
import 'timeline_state.dart';

class TimelineBloc extends Bloc<TimelineEvent, TimelineState> {
  TimelineBloc(this._repo, this._notifier) : super(const TimelineState()) {
    on<TimelineLoadRequested>(_onLoad);
    on<TimelineItemStatusChanged>(_onStatusChanged);
  }

  final TimelineRepository _repo;
  final LocalNotificationService _notifier;

  Future<void> _onLoad(
    TimelineLoadRequested event,
    Emitter<TimelineState> emit,
  ) async {
    emit(state.copyWith(status: TimelineStatus.loading, date: event.date));
    try {
      // Flush any queued offline updates first (best-effort).
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

    // Cancel the reminder for completed items so the user isn't pinged.
    if (event.status == 'completed') {
      await _notifier.cancel(_notificationId(event.itemId));
    }
  }

  Future<void> _scheduleReminders(List<ScheduleItem> items) async {
    await _notifier.cancelAll();
    final now = DateTime.now();
    for (final item in items) {
      if (item.status == 'completed') continue;
      // Fold today's calendar date onto the scheduled HH:mm
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

  /// Deterministic int ID derived from the item's UUID.
  int _notificationId(String itemId) {
    int hash = 0;
    for (final codeUnit in itemId.codeUnits) {
      hash = (hash * 31 + codeUnit) & 0x7fffffff;
    }
    return hash;
  }
}
