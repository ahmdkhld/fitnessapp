import 'package:flutter_test/flutter_test.dart';
import 'package:nutritrack/core/units/unit_system.dart';

void main() {
  group('UnitConverter', () {
    test('metric passes kg through', () {
      final c = UnitConverter(UnitSystem.metric);
      expect(c.displayWeight(100), 100);
      expect(c.weightLabel(100), '100.0 kg');
      expect(c.parseWeight('80.5'), 80.5);
    });

    test('imperial converts to lbs on display and back on parse', () {
      final c = UnitConverter(UnitSystem.imperial);
      expect(c.displayWeight(100), closeTo(220.5, 0.1));
      expect(c.weightLabel(100), contains('lbs'));
      final parsed = c.parseWeight('220.5');
      expect(parsed, closeTo(100, 0.1));
    });

    test('distance conversion', () {
      final metric = UnitConverter(UnitSystem.metric);
      final imperial = UnitConverter(UnitSystem.imperial);
      expect(metric.displayDistance(10), 10);
      expect(imperial.displayDistance(10), closeTo(6.21, 0.01));
    });

    test('parses invalid input as null', () {
      expect(UnitConverter(UnitSystem.metric).parseWeight('nope'), isNull);
    });
  });
}
