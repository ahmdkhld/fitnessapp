import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/di/injection.dart';
import '../../../core/theme/app_colors.dart';

/// Optional onboarding step where the user fills in height, weight,
/// gender, DOB, activity level and unit system. Writes the goal +
/// unit system to `/users/me` and the body stats to
/// `/users/me/profile` so the rest of the app (calorie targets,
/// adherence calc, kg/lbs display) has them.
class BodyStatsScreen extends StatefulWidget {
  const BodyStatsScreen({super.key, this.goal});

  /// Goal selected on the previous onboarding step. We persist it via
  /// `PATCH /users/me/goal` so it ends up on the user record.
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
      await api.dio.patch<void>(
        '/users/me',
        data: {'unitSystem': _unitSystem},
      );
      if (widget.goal != null && widget.goal!.isNotEmpty) {
        await api.dio.patch<void>(
          '/users/me/goal',
          data: {'goal': widget.goal},
        );
      }
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
            const Text(
              'Takes 30 seconds \u2014 helps calorie targets, volume charts and insights.',
              style: TextStyle(color: AppColors.muted, fontSize: 14),
            ),
            const SizedBox(height: 24),

            // Unit system toggle
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'metric', label: Text('Metric')),
                ButtonSegment(value: 'imperial', label: Text('Imperial')),
              ],
              selected: {_unitSystem},
              onSelectionChanged: (set) =>
                  setState(() => _unitSystem = set.first),
              style: SegmentedButton.styleFrom(
                backgroundColor: AppColors.card,
                foregroundColor: AppColors.muted,
                selectedForegroundColor: AppColors.fg,
                selectedBackgroundColor: AppColors.accent,
              ),
            ),
            const SizedBox(height: 20),

            // Form card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(AppColors.radiusMd),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextFormField(
                    controller: _height,
                    keyboardType:
                        const TextInputType.numberWithOptions(decimal: true),
                    decoration: InputDecoration(
                      labelText: _unitSystem == 'metric'
                          ? 'Height (cm)'
                          : 'Height (in)',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _weight,
                    keyboardType:
                        const TextInputType.numberWithOptions(decimal: true),
                    decoration: InputDecoration(
                      labelText: _unitSystem == 'metric'
                          ? 'Weight (kg)'
                          : 'Weight (lbs)',
                    ),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _gender,
                    decoration: const InputDecoration(labelText: 'Gender'),
                    dropdownColor: AppColors.card,
                    items: const [
                      DropdownMenuItem(
                          value: 'unspecified',
                          child: Text('Prefer not to say')),
                      DropdownMenuItem(
                          value: 'female', child: Text('Female')),
                      DropdownMenuItem(value: 'male', child: Text('Male')),
                      DropdownMenuItem(value: 'other', child: Text('Other')),
                    ],
                    onChanged: (v) =>
                        setState(() => _gender = v ?? 'unspecified'),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _activity,
                    decoration:
                        const InputDecoration(labelText: 'Activity level'),
                    dropdownColor: AppColors.card,
                    items: const [
                      DropdownMenuItem(
                          value: 'sedentary', child: Text('Sedentary')),
                      DropdownMenuItem(
                          value: 'light', child: Text('Light')),
                      DropdownMenuItem(
                          value: 'moderate', child: Text('Moderate')),
                      DropdownMenuItem(
                          value: 'active', child: Text('Active')),
                      DropdownMenuItem(
                          value: 'very_active', child: Text('Very active')),
                    ],
                    onChanged: (v) =>
                        setState(() => _activity = v ?? 'moderate'),
                  ),
                  const SizedBox(height: 12),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Date of birth'),
                    subtitle: Text(
                      _dob == null
                          ? 'Tap to select'
                          : '${_dob!.year}-${_dob!.month.toString().padLeft(2, '0')}-${_dob!.day.toString().padLeft(2, '0')}',
                      style: TextStyle(
                        color: _dob == null ? AppColors.muted : AppColors.fg,
                      ),
                    ),
                    trailing:
                        const Icon(Icons.calendar_today, color: AppColors.muted),
                    onTap: _pickDob,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _busy ? null : _save,
                style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                ),
                child: Text(_busy ? 'Saving\u2026' : 'Continue'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
