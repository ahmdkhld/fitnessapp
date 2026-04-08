import 'dart:async';

import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:nutritrack/core/connectivity/connectivity_monitor.dart';
import 'package:nutritrack/core/notifications/local_notification_service.dart';
import 'package:nutritrack/features/timeline/bloc/timeline_bloc.dart';
import 'package:nutritrack/features/timeline/bloc/timeline_event.dart';
import 'package:nutritrack/features/timeline/bloc/timeline_state.dart';
import 'package:nutritrack/features/timeline/repositories/timeline_repository.dart';
import 'package:nutritrack/models/schedule_item.dart';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
class MockTimelineRepository extends Mock implements TimelineRepository {}

class MockLocalNotificationService extends Mock
    implements LocalNotificationService {}

class MockConnectivityMonitor extends Mock implements ConnectivityMonitor {}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
final _testDate = DateTime(2026, 4, 8);

ScheduleItem _item({String id = '1', String status = 'pending'}) {
  return ScheduleItem(
    id: id,
    itemType: 'meal',
    title: 'Breakfast',
    subtitle: 'oats',
    scheduledTime: DateTime(2026, 4, 8, 8, 0),
    status: status,
  );
}

void main() {
  late MockTimelineRepository repo;
  late MockLocalNotificationService notifier;
  late MockConnectivityMonitor connectivity;
  late StreamController<bool> connectivityController;

  setUp(() {
    repo = MockTimelineRepository();
    notifier = MockLocalNotificationService();
    connectivity = MockConnectivityMonitor();
    connectivityController = StreamController<bool>.broadcast();

    when(() => connectivity.onChanged)
        .thenAnswer((_) => connectivityController.stream);

    // Default stubs for the notification service so the bloc never throws
    // on scheduled-reminder logic.
    when(() => notifier.cancelAll()).thenAnswer((_) async {});
    when(() => notifier.cancel(any())).thenAnswer((_) async {});
    when(() => notifier.schedule(
          id: any(named: 'id'),
          title: any(named: 'title'),
          body: any(named: 'body'),
          when: any(named: 'when'),
        )).thenAnswer((_) async {});
  });

  tearDown(() {
    connectivityController.close();
  });

  group('TimelineBloc', () {
    test('initial state', () {
      final bloc = TimelineBloc(repo, notifier, connectivity);
      expect(bloc.state, const TimelineState());
      expect(bloc.state.status, TimelineStatus.initial);
      expect(bloc.state.items, isEmpty);
      bloc.close();
    });

    // ---------------------------------------------------------------
    // TimelineLoadRequested
    // ---------------------------------------------------------------
    group('TimelineLoadRequested', () {
      blocTest<TimelineBloc, TimelineState>(
        'emits loading then success with items',
        build: () {
          when(() => repo.flushQueue()).thenAnswer((_) async => 0);
          when(() => repo.fetchDay(any()))
              .thenAnswer((_) async => [_item()]);
          return TimelineBloc(repo, notifier, connectivity);
        },
        act: (bloc) => bloc.add(TimelineLoadRequested(_testDate)),
        expect: () => [
          TimelineState(status: TimelineStatus.loading, date: _testDate),
          TimelineState(
            status: TimelineStatus.success,
            date: _testDate,
            items: [_item()],
          ),
        ],
        verify: (_) {
          verify(() => repo.flushQueue()).called(1);
          verify(() => repo.fetchDay(_testDate)).called(1);
        },
      );

      blocTest<TimelineBloc, TimelineState>(
        'emits loading then failure on error',
        build: () {
          when(() => repo.flushQueue()).thenAnswer((_) async => 0);
          when(() => repo.fetchDay(any())).thenThrow(Exception('offline'));
          return TimelineBloc(repo, notifier, connectivity);
        },
        act: (bloc) => bloc.add(TimelineLoadRequested(_testDate)),
        expect: () => [
          TimelineState(status: TimelineStatus.loading, date: _testDate),
          isA<TimelineState>()
              .having((s) => s.status, 'status', TimelineStatus.failure)
              .having((s) => s.error, 'error', isNotNull),
        ],
      );

      blocTest<TimelineBloc, TimelineState>(
        'emits success with empty list when no items',
        build: () {
          when(() => repo.flushQueue()).thenAnswer((_) async => 0);
          when(() => repo.fetchDay(any())).thenAnswer((_) async => []);
          return TimelineBloc(repo, notifier, connectivity);
        },
        act: (bloc) => bloc.add(TimelineLoadRequested(_testDate)),
        expect: () => [
          TimelineState(status: TimelineStatus.loading, date: _testDate),
          TimelineState(
            status: TimelineStatus.success,
            date: _testDate,
            items: const [],
          ),
        ],
      );
    });

    // ---------------------------------------------------------------
    // TimelineItemStatusChanged
    // ---------------------------------------------------------------
    group('TimelineItemStatusChanged', () {
      blocTest<TimelineBloc, TimelineState>(
        'optimistically updates item status in list',
        build: () {
          when(() => repo.updateStatus(any(), any()))
              .thenAnswer((_) async {});
          return TimelineBloc(repo, notifier, connectivity);
        },
        seed: () => TimelineState(
          status: TimelineStatus.success,
          date: _testDate,
          items: [_item(id: 'a'), _item(id: 'b')],
        ),
        act: (bloc) => bloc.add(
          const TimelineItemStatusChanged(itemId: 'a', status: 'completed'),
        ),
        expect: () => [
          isA<TimelineState>().having(
            (s) => s.items.firstWhere((i) => i.id == 'a').status,
            'updated item status',
            'completed',
          ),
        ],
        verify: (_) {
          verify(() => repo.updateStatus('a', 'completed')).called(1);
        },
      );

      blocTest<TimelineBloc, TimelineState>(
        'cancels notification when status is completed',
        build: () {
          when(() => repo.updateStatus(any(), any()))
              .thenAnswer((_) async {});
          return TimelineBloc(repo, notifier, connectivity);
        },
        seed: () => TimelineState(
          status: TimelineStatus.success,
          date: _testDate,
          items: [_item(id: 'x')],
        ),
        act: (bloc) => bloc.add(
          const TimelineItemStatusChanged(itemId: 'x', status: 'completed'),
        ),
        verify: (_) {
          verify(() => notifier.cancel(any())).called(1);
        },
      );

      blocTest<TimelineBloc, TimelineState>(
        'does not cancel notification for non-completed status',
        build: () {
          when(() => repo.updateStatus(any(), any()))
              .thenAnswer((_) async {});
          return TimelineBloc(repo, notifier, connectivity);
        },
        seed: () => TimelineState(
          status: TimelineStatus.success,
          date: _testDate,
          items: [_item(id: 'x')],
        ),
        act: (bloc) => bloc.add(
          const TimelineItemStatusChanged(itemId: 'x', status: 'skipped'),
        ),
        verify: (_) {
          verifyNever(() => notifier.cancel(any()));
        },
      );
    });
  });
}
