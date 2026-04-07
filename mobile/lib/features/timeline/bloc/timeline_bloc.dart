import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../models/schedule_item.dart';
import '../repositories/timeline_repository.dart';
import 'timeline_event.dart';
import 'timeline_state.dart';

class TimelineBloc extends Bloc<TimelineEvent, TimelineState> {
  TimelineBloc(this._repo) : super(const TimelineState()) {
    on<TimelineLoadRequested>(_onLoad);
    on<TimelineItemStatusChanged>(_onStatusChanged);
  }

  final TimelineRepository _repo;

  Future<void> _onLoad(
    TimelineLoadRequested event,
    Emitter<TimelineState> emit,
  ) async {
    emit(state.copyWith(status: TimelineStatus.loading, date: event.date));
    try {
      final items = await _repo.fetchDay(event.date);
      emit(state.copyWith(status: TimelineStatus.success, items: items));
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
    try {
      await _repo.updateStatus(event.itemId, event.status);
    } catch (_) {
      if (state.date != null) {
        add(TimelineLoadRequested(state.date!));
      }
    }
  }
}
