import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nutritrack/features/timeline/widgets/timeline_card.dart';
import 'package:nutritrack/models/schedule_item.dart';

ScheduleItem _make({
  String status = 'pending',
  String type = 'meal',
  String? subtitle,
  String? referenceId,
}) {
  return ScheduleItem(
    id: 's1',
    itemType: type,
    title: 'Breakfast',
    subtitle: subtitle,
    scheduledTime: DateTime.parse('2026-04-08T08:00:00'),
    status: status,
    referenceId: referenceId,
  );
}

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  testWidgets('renders the title and time', (tester) async {
    await tester.pumpWidget(
      _wrap(
        TimelineCard(
          item: _make(subtitle: 'oats and eggs'),
          onComplete: () {},
        ),
      ),
    );
    expect(find.text('Breakfast'), findsOneWidget);
    expect(find.textContaining('08:00'), findsOneWidget);
    expect(find.textContaining('oats and eggs'), findsOneWidget);
  });

  testWidgets('uses the workout icon for workout items', (tester) async {
    await tester.pumpWidget(
      _wrap(
        TimelineCard(
          item: _make(type: 'workout', referenceId: 'd1'),
          onComplete: () {},
        ),
      ),
    );
    expect(find.byIcon(Icons.fitness_center), findsOneWidget);
  });

  testWidgets('marks completed items with a strike-through', (tester) async {
    await tester.pumpWidget(
      _wrap(
        TimelineCard(
          item: _make(status: 'completed'),
          onComplete: () {},
        ),
      ),
    );
    final title = tester.widget<Text>(find.text('Breakfast'));
    expect(title.style?.decoration, TextDecoration.lineThrough);
    expect(find.byIcon(Icons.check_circle), findsOneWidget);
  });

  testWidgets('fires the complete callback when the trailing icon is tapped',
      (tester) async {
    var calls = 0;
    await tester.pumpWidget(
      _wrap(
        TimelineCard(
          item: _make(),
          onComplete: () => calls++,
        ),
      ),
    );
    await tester.tap(find.byIcon(Icons.radio_button_unchecked));
    expect(calls, 1);
  });
}
