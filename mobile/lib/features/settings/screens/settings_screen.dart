import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: const [
          ListTile(leading: Icon(Icons.person), title: Text('Profile')),
          ListTile(leading: Icon(Icons.notifications), title: Text('Notifications')),
          ListTile(leading: Icon(Icons.fitness_center), title: Text('Diet plans')),
          ListTile(leading: Icon(Icons.medication), title: Text('Supplement plans')),
          ListTile(leading: Icon(Icons.logout), title: Text('Sign out')),
        ],
      ),
    );
  }
}
