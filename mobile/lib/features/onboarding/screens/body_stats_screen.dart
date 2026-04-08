import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/di/injection.dart';

/// Optional onboarding step where the user fills in height, weight,
/// gender, DOB, activity level and unit system. Writes the goal +
/// unit system to `/users/me` and the body stats to
/// `/users/me/profile` so the rest of the app (calorie targets,
/// adherence calc, kg↔lbs display) has them.
class BodyStatsScreen extends StatefulWidget {
  const BodyStatsScreen({super.key, this.goal});

  /// Goal selected on the previous onboarding step. We persist it via
  /// `PATCH /users/me/goal` so it ends up on the user record — until
  /// this screen wired the call, the entire goal step was a no-op.
  final String? goal;

  @override
  State<BodyStatsScreen> createState() => _BodyStatsScreenState();
}

class _BodyStatsScreenState extends State<BodyStatsScreen> {
  final _form = GlobalKey<FormState>();
  final _height = TextEditingController();
  final _weight = TextEditingController();
  String _gender = 'unspecified';
  String _activity = 'moderate';
  String _unitSystem = 'metric';
  DateTime? _dob;
  bool _busy = false;

  Future<void> _pickDob() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(1995, 1, 1),
      firstDate: DateTime(1925),
      lastDate: DateTime.now(),
    );
    if (picked != null) setState(() => _dob = picked);
  }

  Future<void> _save() async {
    if (!_form.currentState!.validate()) return;
    setState(() => _busy = true);
    try {
      final api = getIt<ApiClient>();
      // Store unit preference on the user row
      await api.dio.patch<void>(
        '/users/me',
        data: {'unitSystem': _unitSystem},
      );
      // Persist the goal selected on the previous step. Until this
      // call existed the goal was being thrown on the floor.
      if (widget.goal != null && widget.goal!.isNotEmpty) {
        await api.dio.patch<void>(
          '/users/me/goal',
          data: {'goal': widget.goal},
        );
      }
      // Then the profile row
      await api.dio.post<void>(
        '/users/me/profile',
        data: {
          if (_height.text.isNotEmpty)
            'heightCm': double.tryParse(_height.text),
          if (_weight.text.isNotEmpty)
            'weightKg': double.tryParse(_weight.text),
          'gender': _gender,
          'activityLevel': _activity,
          if (_dob != null) 'dateOfBirth': _dob!.toIso8601String(),
        },
      );
      if (mounted) {
        // Forward the goal so the next screen can highlight it.
        final qs = widget.goal != null ? '?goal=${widget.goal}' : '';
        context.go('/onboarding/plan$qs');
      }
    } on DioException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Save failed: ${e.message}')),
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your stats'),
        actions: [
          TextButton(
            onPressed: () => context.go('/timeline'),
            child: const Text('Skip'),
          ),
        ],
      ),
      body: Form(
        key: _form,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Takes 30 seconds — helps calorie targets, volume charts and insights.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'metric', label: Text('Metric')),
                ButtonSegment(value: 'imperial', label: Text('Imperial')),
              ],
              selected: {_unitSystem},
              onSelectionChanged: (set) =>
                  setState(() => _unitSystem = set.first),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _height,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: _unitSystem == 'metric' ? 'Height (cm)' : 'Height (in)',
              ),
            ),
            TextFormField(
              controller: _weight,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: _unitSystem == 'metric' ? 'Weight (kg)' : 'Weight (lbs)',
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _gender,
              decoration: const InputDecoration(labelText: 'Gender'),
              items: const [
                DropdownMenuItem(value: 'unspecified', child: Text('Prefer not to say')),
                DropdownMenuItem(value: 'female', child: Text('Female')),
                DropdownMenuItem(value: 'male', child: Text('Male')),
                DropdownMenuItem(value: 'other', child: Text('Other')),
              ],
              onChanged: (v) => setState(() => _gender = v ?? 'unspecified'),
            ),
            DropdownButtonFormField<String>(
              value: _activity,
              decoration: const InputDecoration(labelText: 'Activity level'),
              items: const [
                DropdownMenuItem(value: 'sedentary', child: Text('Sedentary')),
                DropdownMenuItem(value: 'light', child: Text('Light')),
                DropdownMenuItem(value: 'moderate', child: Text('Moderate')),
                DropdownMenuItem(value: 'active', child: Text('Active')),
                DropdownMenuItem(value: 'very_active', child: Text('Very active')),
              ],
              onChanged: (v) => setState(() => _activity = v ?? 'moderate'),
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Date of birth'),
              subtitle: Text(
                _dob == null
                    ? 'Tap to select'
                    : '${_dob!.year}-${_dob!.month.toString().padLeft(2, '0')}-${_dob!.day.toString().padLeft(2, '0')}',
              ),
              trailing: const Icon(Icons.calendar_today),
              onTap: _pickDob,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _busy ? null : _save,
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
              ),
              child: Text(_busy ? 'Saving…' : 'Continue'),
            ),
          ],
        ),
      ),
    );
  }
}
