import 'package:equatable/equatable.dart';

abstract class TimelineEvent extends Equatable {
  const TimelineEvent();
  @override
  List<Object?> get props => [];
}

class TimelineLoadRequested extends TimelineEvent {
  const TimelineLoadRequested(this.date);
  final DateTime date;
  @override
  List<Object?> get props => [date];
}

class TimelineItemStatusChanged extends TimelineEvent {
  const TimelineItemStatusChanged({
    required this.itemId,
    required this.status,
  });
  final String itemId;
  final String status;
  @override
  List<Object?> get props => [itemId, status];
}
