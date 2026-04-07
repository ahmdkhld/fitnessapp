import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../models/schedule_item.dart';
import '../widgets/timeline_card.dart';

class DailyTimelineScreen extends StatefulWidget {
  const DailyTimelineScreen({super.key});

  @override
  State<DailyTimelineScreen> createState() => _DailyTimelineScreenState();
}

class _DailyTimelineScreenState extends State<DailyTimelineScreen> {
  // Demo placeholder data; replace with TimelineBloc fetching from API.
  late final List<ScheduleItem> _items = [
    ScheduleItem(
      id: '1',
      itemType: 'meal',
      title: 'Breakfast',
      subtitle: 'Oats, berries, whey',
      scheduledTime: DateTime.now().copyWith(hour: 8, minute: 0),
      status: 'completed',
    ),
    ScheduleItem(
      id: '2',
      itemType: 'supplement',
      title: 'Vitamin D3',
      subtitle: '5000 IU · with food',
      scheduledTime: DateTime.now().copyWith(hour: 8, minute: 30),
      status: 'pending',
    ),
    ScheduleItem(
      id: '3',
      itemType: 'meal',
      title: 'Lunch',
      subtitle: 'Chicken, rice, veg',
      scheduledTime: DateTime.now().copyWith(hour: 13, minute: 0),
      status: 'pending',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final today = DateFormat.yMMMMEEEEd().format(DateTime.now());
    return Scaffold(
      appBar: AppBar(title: Text(today)),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _items.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (_, i) => TimelineCard(
          item: _items[i],
          onComplete: () => setState(() {}),
        ),
      ),
    );
  }
}
