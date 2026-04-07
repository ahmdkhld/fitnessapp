import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../auth/bloc/auth_bloc.dart';
import '../../auth/bloc/auth_event.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  void _signOut(BuildContext context) {
    context.read<AuthBloc>().add(const AuthLogoutRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.notifications),
            title: const Text('Notifications'),
            onTap: () => context.push('/settings/notifications'),
          ),
          ListTile(
            leading: const Icon(Icons.restaurant_menu),
            title: const Text('Diet plans'),
            onTap: () => context.push('/diet-plans'),
          ),
          ListTile(
            leading: const Icon(Icons.medication),
            title: const Text('Supplement plans'),
            onTap: () => context.push('/supplements'),
          ),
          ListTile(
            leading: const Icon(Icons.water_drop),
            title: const Text('Water tracker'),
            onTap: () => context.push('/water'),
          ),
          ListTile(
            leading: const Icon(Icons.monitor_weight),
            title: const Text('Body log'),
            onTap: () => context.push('/body-log'),
          ),
          ListTile(
            leading: const Icon(Icons.upload_file),
            title: const Text('Import plan'),
            onTap: () => context.push('/plan-import'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Sign out'),
            onTap: () => _signOut(context),
          ),
        ],
      ),
    );
  }
}
