import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/themed_colors.dart';

class PlanSetupScreen extends StatelessWidget {
  const PlanSetupScreen({super.key, this.goal});

  final String? goal;

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Your plan')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (goal != null)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.badgePurpleBg,
                  borderRadius: BorderRadius.circular(9999),
                  border:
                      Border.all(color: AppColors.accentPurple.withAlpha(77)),
                ),
                child: Text(
                  'Goal: ${goal!.replaceAll("_", " ")}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: AppColors.accentPurple,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            const SizedBox(height: 24),
            Text(
              'How would you like to set up your diet and supplement plan?',
              style: TextStyle(color: c.muted, fontSize: 15),
            ),
            const SizedBox(height: 24),
            _PlanOption(
              icon: Icons.edit,
              iconColor: AppColors.accent,
              title: 'Build from scratch',
              subtitle: 'Add meals and supplements manually',
              onTap: () => context.go('/diet-plans'),
            ),
            const SizedBox(height: 12),
            _PlanOption(
              icon: Icons.upload_file,
              iconColor: AppColors.accentPurple,
              title: 'Import existing plan',
              subtitle: 'Paste text from your coach or PDF',
              onTap: () => context.go('/plan-import'),
            ),
            const SizedBox(height: 12),
            _PlanOption(
              icon: Icons.skip_next,
              iconColor: AppColors.muted,
              title: 'Skip for now',
              subtitle: "I'll set this up later",
              onTap: () => context.go('/timeline'),
            ),
          ],
        ),
      ),
    );
  }
}

class _PlanOption extends StatelessWidget {
  const _PlanOption({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: c.card,
          borderRadius: BorderRadius.circular(AppColors.radiusMd),
          border: Border.all(color: c.border),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconColor.withAlpha(38),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontWeight: FontWeight.w500, fontSize: 15)),
                  const SizedBox(height: 2),
                  Text(subtitle,
                      style: TextStyle(
                          color: c.muted, fontSize: 13)),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: c.border, size: 20),
          ],
        ),
      ),
    );
  }
}
