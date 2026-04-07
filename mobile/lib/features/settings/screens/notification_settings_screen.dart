import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../repositories/notification_settings_repository.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() =>
      _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState extends State<NotificationSettingsScreen> {
  final _repo = getIt<NotificationSettingsRepository>();
  final _prefs = NotificationPrefs(
    pushEnabled: true,
    mealReminder: true,
    supplementReminder: true,
    waterReminder: true,
    overdueReminder: true,
    advanceMinutes: 5,
  );
  bool _saving = false;

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await _repo.updateSettings(_prefs);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Settings saved')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Save failed: $e')),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: ListView(
        children: [
          SwitchListTile(
            title: const Text('Push notifications'),
            value: _prefs.pushEnabled,
            onChanged: (v) => setState(() => _prefs.pushEnabled = v),
          ),
          const Divider(),
          SwitchListTile(
            title: const Text('Meal reminders'),
            value: _prefs.mealReminder,
            onChanged: (v) => setState(() => _prefs.mealReminder = v),
          ),
          SwitchListTile(
            title: const Text('Supplement reminders'),
            value: _prefs.supplementReminder,
            onChanged: (v) => setState(() => _prefs.supplementReminder = v),
          ),
          SwitchListTile(
            title: const Text('Water reminders'),
            value: _prefs.waterReminder,
            onChanged: (v) => setState(() => _prefs.waterReminder = v),
          ),
          SwitchListTile(
            title: const Text('Overdue alerts'),
            value: _prefs.overdueReminder,
            onChanged: (v) => setState(() => _prefs.overdueReminder = v),
          ),
          const Divider(),
          ListTile(
            title: const Text('Advance notice'),
            subtitle: Slider(
              value: _prefs.advanceMinutes.toDouble(),
              min: 0,
              max: 30,
              divisions: 6,
              label: '${_prefs.advanceMinutes} min',
              onChanged: (v) =>
                  setState(() => _prefs.advanceMinutes = v.round()),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: FilledButton(
              onPressed: _saving ? null : _save,
              child: Text(_saving ? 'Saving…' : 'Save'),
            ),
          ),
        ],
      ),
    );
  }
}
