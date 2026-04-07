import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../models/schedule_item.dart';

class TimelineCard extends StatelessWidget {
  const TimelineCard({
    super.key,
    required this.item,
    required this.onComplete,
    this.onTap,
  });

  final ScheduleItem item;
  final VoidCallback onComplete;
  final VoidCallback? onTap;

  IconData get _icon {
    switch (item.itemType) {
      case 'meal':
        return Icons.restaurant;
      case 'supplement':
        return Icons.medication;
      case 'water':
        return Icons.water_drop;
      case 'workout':
        return Icons.fitness_center;
    }
    return Icons.check_circle_outline;
  }

  @override
  Widget build(BuildContext context) {
    final done = item.status == 'completed';
    return Card(
      child: ListTile(
        leading: CircleAvatar(child: Icon(_icon)),
        title: Text(
          item.title,
          style: TextStyle(
            decoration: done ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Text(
          '${DateFormat.Hm().format(item.scheduledTime)}'
          '${item.subtitle != null ? ' · ${item.subtitle}' : ''}',
        ),
        trailing: IconButton(
          icon: Icon(done ? Icons.check_circle : Icons.radio_button_unchecked),
          color: done ? Colors.green : null,
          onPressed: onComplete,
        ),
        onTap: onTap,
      ),
    );
  }
}
