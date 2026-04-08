import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/themed_colors.dart';
import '../../auth/bloc/auth_bloc.dart';
import '../../auth/bloc/auth_event.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  Future<void> _signOut(BuildContext context) async {
    final l = AppLocalizations.of(context)!;
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(l.logoutConfirmTitle),
        content: Text(l.logoutConfirmBody),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(l.cancel),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text(l.signOut),
          ),
        ],
      ),
    );
    if (confirm == true && context.mounted) {
      context.read<AuthBloc>().add(const AuthLogoutRequested());
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l.settingsTitle)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Account section
          const _SectionLabel('ACCOUNT'),
          const SizedBox(height: 8),
          _SettingsGroup(
            children: [
              _SettingsTile(
                icon: Icons.person,
                label: l.profileTitle,
                onTap: () => context.push('/settings/profile'),
              ),
              _SettingsTile(
                icon: Icons.lock,
                label: l.changePasswordTitle,
                onTap: () => context.push('/settings/change-password'),
              ),
              _SettingsTile(
                icon: Icons.notifications,
                label: l.notifications,
                onTap: () => context.push('/settings/notifications'),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Plans & tracking section
          const _SectionLabel('PLANS & TRACKING'),
          const SizedBox(height: 8),
          _SettingsGroup(
            children: [
              _SettingsTile(
                icon: Icons.restaurant_menu,
                label: l.diet,
                onTap: () => context.push('/diet-plans'),
              ),
              _SettingsTile(
                icon: Icons.medication,
                label: l.supplementPlans,
                onTap: () => context.push('/supplements'),
              ),
              _SettingsTile(
                icon: Icons.water_drop,
                label: l.waterTracker,
                onTap: () => context.push('/water'),
              ),
              _SettingsTile(
                icon: Icons.monitor_weight,
                label: l.bodyLog,
                onTap: () => context.push('/body-log'),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Tools section
          const _SectionLabel('TOOLS'),
          const SizedBox(height: 8),
          _SettingsGroup(
            children: [
              _SettingsTile(
                icon: Icons.upload_file,
                label: l.importPlan,
                onTap: () => context.push('/plan-import'),
              ),
              _SettingsTile(
                icon: Icons.summarize,
                label: l.coachReportTitle,
                subtitle: l.coachReportSubtitle,
                onTap: () => context.push('/coach-report'),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Sign out
          _SettingsGroup(
            children: [
              _SettingsTile(
                icon: Icons.logout,
                label: l.signOut,
                iconColor: AppColors.dangerMuted,
                labelColor: AppColors.dangerMuted,
                onTap: () => _signOut(context),
              ),
            ],
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.label);
  final String label;

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    return Text(
      label,
      style: TextStyle(
        color: c.muted,
        fontSize: 11,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.5,
      ),
    );
  }
}

/// Groups tiles in a single dark card (matches web .list-card grouped look)
class _SettingsGroup extends StatelessWidget {
  const _SettingsGroup({required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    return Container(
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(AppColors.radiusMd),
        border: Border.all(color: c.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          for (int i = 0; i < children.length; i++) ...[
            children[i],
            if (i < children.length - 1)
              const Divider(height: 1, indent: 52, endIndent: 16),
          ],
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({
    required this.icon,
    required this.label,
    this.subtitle,
    this.iconColor,
    this.labelColor,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final String? subtitle;
  final Color? iconColor;
  final Color? labelColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    return ListTile(
      leading: Icon(icon, color: iconColor ?? c.muted, size: 22),
      title: Text(
        label,
        style: TextStyle(
          color: labelColor ?? c.fg,
          fontSize: 15,
          fontWeight: FontWeight.w400,
        ),
      ),
      subtitle: subtitle != null
          ? Text(subtitle!,
              style: TextStyle(color: c.muted, fontSize: 13))
          : null,
      trailing: Icon(Icons.chevron_right, color: c.border, size: 20),
      onTap: onTap,
    );
  }
}
