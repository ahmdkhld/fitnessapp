import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
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

  Color get _iconBgColor {
    switch (item.itemType) {
      case 'meal':
        return AppColors.badgeAmberBg;
      case 'supplement':
        return AppColors.badgePurpleBg;
      case 'water':
        return AppColors.badgeCyanBg;
      case 'workout':
        return AppColors.badgeGreenBg;
    }
    return AppColors.border;
  }

  Color get _iconColor {
    switch (item.itemType) {
      case 'meal':
        return AppColors.badgeAmber;
      case 'supplement':
        return AppColors.accentPurple;
      case 'water':
        return AppColors.badgeCyan;
      case 'workout':
        return AppColors.accentGreen;
    }
    return AppColors.muted;
  }

  @override
  Widget build(BuildContext context) {
    final done = item.status == 'completed';

    // Web-style timeline card: dark bg + left gradient border (blue→purple)
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(AppColors.radiusMd),
          border: Border.all(color: AppColors.border),
        ),
        clipBehavior: Clip.antiAlias,
        child: IntrinsicHeight(
          child: Row(
            children: [
              // Gradient left accent bar (matches web .timeline-card::before)
              Container(
                width: 3,
                decoration: const BoxDecoration(
                  gradient: AppColors.accentGradient,
                ),
              ),
              // Content
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      // Icon circle
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: _iconBgColor,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(_icon, size: 20, color: _iconColor),
                      ),
                      const SizedBox(width: 14),
                      // Text
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              item.title,
                              style: TextStyle(
                                color: done
                                    ? AppColors.muted
                                    : AppColors.fg,
                                fontWeight: FontWeight.w500,
                                fontSize: 15,
                                decoration:
                                    done ? TextDecoration.lineThrough : null,
                                decorationColor: AppColors.muted,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${DateFormat.Hm().format(item.scheduledTime)}'
                              '${item.subtitle != null ? ' \u00b7 ${item.subtitle}' : ''}',
                              style: const TextStyle(
                                color: AppColors.muted,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Complete toggle
                      GestureDetector(
                        onTap: onComplete,
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: done
                                ? AppColors.badgeGreenBg
                                : Colors.transparent,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: done
                                  ? AppColors.accentGreen
                                  : AppColors.border,
                              width: 1.5,
                            ),
                          ),
                          child: done
                              ? const Icon(Icons.check,
                                  size: 18, color: AppColors.accentGreen)
                              : null,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
