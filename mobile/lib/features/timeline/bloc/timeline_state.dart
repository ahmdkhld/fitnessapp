import 'package:equatable/equatable.dart';
import '../../../models/schedule_item.dart';

enum TimelineStatus { initial, loading, success, failure }

class TimelineState extends Equatable {
  const TimelineState({
    this.status = TimelineStatus.initial,
    this.items = const [],
    this.date,
    this.error,
  });

  final TimelineStatus status;
  final List<ScheduleItem> items;
  final DateTime? date;
  final String? error;

  TimelineState copyWith({
    TimelineStatus? status,
    List<ScheduleItem>? items,
    DateTime? date,
    String? error,
  }) {
    return TimelineState(
      status: status ?? this.status,
      items: items ?? this.items,
      date: date ?? this.date,
      error: error,
    );
  }

  @override
  List<Object?> get props => [status, items, date, error];
}
