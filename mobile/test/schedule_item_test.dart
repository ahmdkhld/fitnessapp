import 'package:flutter_test/flutter_test.dart';
import 'package:nutritrack/models/schedule_item.dart';

void main() {
  group('ScheduleItem.fromJson', () {
    test('parses required fields', () {
      final item = ScheduleItem.fromJson({
        'id': '1',
        'itemType': 'meal',
        'title': 'Breakfast',
        'subtitle': 'oats',
        'scheduledTime': '1970-01-01T08:00:00Z',
        'status': 'pending',
      });
      expect(item.id, '1');
      expect(item.itemType, 'meal');
      expect(item.title, 'Breakfast');
      expect(item.status, 'pending');
    });

    test('tolerates null subtitle', () {
      final item = ScheduleItem.fromJson({
        'id': '2',
        'itemType': 'supplement',
        'title': 'Vitamin D',
        'subtitle': null,
        'scheduledTime': '1970-01-01T09:00:00Z',
        'status': 'completed',
      });
      expect(item.subtitle, isNull);
      expect(item.status, 'completed');
    });
  });
}
