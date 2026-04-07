class ScheduleItem {
  ScheduleItem({
    required this.id,
    required this.itemType,
    required this.title,
    this.subtitle,
    required this.scheduledTime,
    required this.status,
    this.referenceId,
  });

  final String id;
  final String itemType; // meal | supplement | water | workout
  final String title;
  final String? subtitle;
  final DateTime scheduledTime;
  final String status;
  final String? referenceId;

  factory ScheduleItem.fromJson(Map<String, dynamic> json) => ScheduleItem(
        id: json['id'] as String,
        itemType: json['itemType'] as String,
        title: json['title'] as String,
        subtitle: json['subtitle'] as String?,
        scheduledTime: DateTime.parse(json['scheduledTime'] as String),
        status: json['status'] as String,
        referenceId: json['referenceId'] as String?,
      );
}
