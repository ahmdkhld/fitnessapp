import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:nutritrack/core/api/api_client.dart';
import 'package:nutritrack/features/timeline/repositories/timeline_cache.dart';
import 'package:nutritrack/features/timeline/repositories/timeline_repository.dart';
import 'package:nutritrack/models/schedule_item.dart';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
class MockApiClient extends Mock implements ApiClient {}

class MockDio extends Mock implements Dio {}

class MockTimelineCache extends Mock implements TimelineCache {}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
final _date = DateTime(2026, 4, 8);

Map<String, dynamic> _rawItem({String id = '1', String status = 'pending'}) {
  return {
    'id': id,
    'itemType': 'meal',
    'title': 'Breakfast',
    'subtitle': 'oats',
    'scheduledTime': '2026-04-08T08:00:00Z',
    'status': status,
  };
}

ScheduleItem _item({String id = '1', String status = 'pending'}) {
  return ScheduleItem(
    id: id,
    itemType: 'meal',
    title: 'Breakfast',
    subtitle: 'oats',
    scheduledTime: DateTime.parse('2026-04-08T08:00:00Z'),
    status: status,
  );
}

void main() {
  late MockApiClient api;
  late MockDio dio;
  late MockTimelineCache cache;
  late TimelineRepository repo;

  setUp(() {
    api = MockApiClient();
    dio = MockDio();
    cache = MockTimelineCache();
    when(() => api.dio).thenReturn(dio);
    repo = TimelineRepository(api, cache);
  });

  setUpAll(() {
    registerFallbackValue(Uri());
    registerFallbackValue(_date);
    registerFallbackValue(<ScheduleItem>[]);
  });

  group('TimelineRepository', () {
    // ---------------------------------------------------------------
    // fetchDay
    // ---------------------------------------------------------------
    group('fetchDay', () {
      test('calls /schedule with formatted date and caches result', () async {
        when(() => dio.get<List<dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            )).thenAnswer((_) async => Response(
              data: [_rawItem()],
              statusCode: 200,
              requestOptions: RequestOptions(),
            ));
        when(() => cache.save(any(), any())).thenAnswer((_) async {});

        final items = await repo.fetchDay(_date);

        expect(items, hasLength(1));
        expect(items.first.id, '1');
        expect(items.first.title, 'Breakfast');

        verify(() => dio.get<List<dynamic>>(
              '/schedule',
              queryParameters: {'date': '2026-04-08'},
            )).called(1);
        verify(() => cache.save(_date, any())).called(1);
      });

      test('returns cached items on DioException', () async {
        when(() => dio.get<List<dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            )).thenThrow(DioException(
              requestOptions: RequestOptions(),
              type: DioExceptionType.connectionError,
            ));
        when(() => cache.load(any())).thenAnswer((_) async => [_item()]);

        final items = await repo.fetchDay(_date);

        expect(items, hasLength(1));
        verify(() => cache.load(_date)).called(1);
      });
    });

    // ---------------------------------------------------------------
    // updateStatus
    // ---------------------------------------------------------------
    group('updateStatus', () {
      test('patches the correct endpoint', () async {
        when(() => cache.updateLocalStatus(any(), any(), any()))
            .thenAnswer((_) async {});
        when(() => dio.patch<void>(any(), data: any(named: 'data')))
            .thenAnswer((_) async => Response(
                  statusCode: 200,
                  requestOptions: RequestOptions(),
                ));

        await repo.updateStatus('item-42', 'completed', date: _date);

        verify(() => cache.updateLocalStatus(_date, 'item-42', 'completed'))
            .called(1);
        verify(() => dio.patch<void>(
              '/schedule/item-42/status',
              data: {'status': 'completed'},
            )).called(1);
      });

      test('sends notes when provided', () async {
        when(() => cache.updateLocalStatus(any(), any(), any()))
            .thenAnswer((_) async {});
        when(() => dio.patch<void>(any(), data: any(named: 'data')))
            .thenAnswer((_) async => Response(
                  statusCode: 200,
                  requestOptions: RequestOptions(),
                ));

        await repo.updateStatus('item-42', 'skipped',
            date: _date, notes: 'not hungry');

        verify(() => dio.patch<void>(
              '/schedule/item-42/status',
              data: {'status': 'skipped', 'notes': 'not hungry'},
            )).called(1);
      });

      test('enqueues update when network fails', () async {
        when(() => cache.updateLocalStatus(any(), any(), any()))
            .thenAnswer((_) async {});
        when(() => dio.patch<void>(any(), data: any(named: 'data')))
            .thenThrow(DioException(
              requestOptions: RequestOptions(),
              type: DioExceptionType.connectionError,
            ));
        when(() => cache.enqueueStatusUpdate(any(), any()))
            .thenAnswer((_) async {});

        await repo.updateStatus('item-42', 'completed', date: _date);

        verify(() => cache.enqueueStatusUpdate('item-42', 'completed'))
            .called(1);
      });
    });

    // ---------------------------------------------------------------
    // flushQueue
    // ---------------------------------------------------------------
    group('flushQueue', () {
      test('drains queue and patches each entry', () async {
        when(() => cache.drainQueue()).thenAnswer((_) async => [
              {'itemId': 'a', 'status': 'completed'},
              {'itemId': 'b', 'status': 'skipped'},
            ]);
        when(() => dio.patch<void>(any(), data: any(named: 'data')))
            .thenAnswer((_) async => Response(
                  statusCode: 200,
                  requestOptions: RequestOptions(),
                ));

        final flushed = await repo.flushQueue();

        expect(flushed, 2);
        verify(() => dio.patch<void>(
              '/schedule/a/status',
              data: {'status': 'completed'},
            )).called(1);
        verify(() => dio.patch<void>(
              '/schedule/b/status',
              data: {'status': 'skipped'},
            )).called(1);
      });

      test('re-enqueues items that fail to flush', () async {
        when(() => cache.drainQueue()).thenAnswer((_) async => [
              {'itemId': 'c', 'status': 'completed'},
            ]);
        when(() => dio.patch<void>(any(), data: any(named: 'data')))
            .thenThrow(DioException(
              requestOptions: RequestOptions(),
              type: DioExceptionType.connectionError,
            ));
        when(() => cache.enqueueStatusUpdate(any(), any()))
            .thenAnswer((_) async {});

        final flushed = await repo.flushQueue();

        expect(flushed, 0);
        verify(() => cache.enqueueStatusUpdate('c', 'completed')).called(1);
      });

      test('returns 0 when queue is empty', () async {
        when(() => cache.drainQueue()).thenAnswer((_) async => []);

        final flushed = await repo.flushQueue();
        expect(flushed, 0);
      });
    });
  });
}
