import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nutritrack/l10n/app_localizations.dart';
import 'package:go_router/go_router.dart';
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
        children: [
          ListTile(
            leading: const Icon(Icons.person),
            title: Text(l.profileTitle),
            onTap: () => context.push('/settings/profile'),
          ),
          ListTile(
            leading: const Icon(Icons.lock),
            title: Text(l.changePasswordTitle),
            onTap: () => context.push('/settings/change-password'),
          ),
          ListTile(
            leading: const Icon(Icons.notifications),
            title: Text(l.notifications),
            onTap: () => context.push('/settings/notifications'),
          ),
          ListTile(
            leading: const Icon(Icons.restaurant_menu),
            title: Text(l.diet),
            onTap: () => context.push('/diet-plans'),
          ),
          ListTile(
            leading: const Icon(Icons.medication),
            title: Text(l.supplementPlans),
            onTap: () => context.push('/supplements'),
          ),
          ListTile(
            leading: const Icon(Icons.water_drop),
            title: Text(l.waterTracker),
            onTap: () => context.push('/water'),
          ),
          ListTile(
            leading: const Icon(Icons.monitor_weight),
            title: Text(l.bodyLog),
            onTap: () => context.push('/body-log'),
          ),
          ListTile(
            leading: const Icon(Icons.upload_file),
            title: Text(l.importPlan),
            onTap: () => context.push('/plan-import'),
          ),
          ListTile(
            leading: const Icon(Icons.summarize),
            title: Text(l.coachReportTitle),
            subtitle: Text(l.coachReportSubtitle),
            onTap: () => context.push('/coach-report'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: Text(l.signOut),
            onTap: () => _signOut(context),
          ),
        ],
      ),
    );
  }
}
