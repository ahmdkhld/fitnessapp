import 'package:flutter/material.dart';
import 'package:nutritrack/l10n/app_localizations.dart';
import '../../../core/di/injection.dart';
import '../repositories/profile_repository.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _repo = getIt<ProfileRepository>();

  bool _loading = true;
  bool _saving = false;
  String? _error;

  UserInfo? _user;
  UserProfile _profile = UserProfile();

  // Account controllers
  final _fullNameCtrl = TextEditingController();
  String _goal = '';
  String _unitSystem = 'metric';

  // Profile controllers
  final _heightCtrl = TextEditingController();
  final _weightCtrl = TextEditingController();
  final _bodyFatCtrl = TextEditingController();
  final _waistCtrl = TextEditingController();
  final _dobCtrl = TextEditingController();
  String _gender = '';
  String _activityLevel = '';
  final _waterGoalCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final user = await _repo.getUser();
      final profile = await _repo.getProfile() ?? UserProfile();
      if (!mounted) return;
      setState(() {
        _user = user;
        _profile = profile;
        _fullNameCtrl.text = user.fullName ?? '';
        _goal = user.goal ?? '';
        _unitSystem = user.unitSystem;
        _heightCtrl.text = profile.heightCm?.toString() ?? '';
        _weightCtrl.text = profile.weightKg?.toString() ?? '';
        _bodyFatCtrl.text = profile.bodyFatPct?.toString() ?? '';
        _waistCtrl.text = profile.waistCm?.toString() ?? '';
        _dobCtrl.text = profile.dateOfBirth?.substring(0, 10) ?? '';
        _gender = profile.gender ?? '';
        _activityLevel = profile.activityLevel ?? '';
        _waterGoalCtrl.text = profile.dailyWaterGoalMl.toString();
        _loading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _loading = false;
        });
      }
    }
  }

  Future<void> _saveAccount() async {
    setState(() => _saving = true);
    try {
      await _repo.updateUser(
        fullName: _fullNameCtrl.text.trim().isEmpty ? null : _fullNameCtrl.text.trim(),
        goal: _goal.isEmpty ? null : _goal,
        unitSystem: _unitSystem,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Account updated')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Save failed: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _saveProfile() async {
    setState(() => _saving = true);
    try {
      final profile = UserProfile(
        heightCm: double.tryParse(_heightCtrl.text),
        weightKg: double.tryParse(_weightCtrl.text),
        bodyFatPct: double.tryParse(_bodyFatCtrl.text),
        waistCm: double.tryParse(_waistCtrl.text),
        dateOfBirth: _dobCtrl.text.trim().isEmpty ? null : _dobCtrl.text.trim(),
        gender: _gender.isEmpty ? null : _gender,
        activityLevel: _activityLevel.isEmpty ? null : _activityLevel,
        dailyWaterGoalMl: int.tryParse(_waterGoalCtrl.text) ?? 2500,
      );
      await _repo.upsertProfile(profile);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile saved')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Save failed: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.tryParse(_dobCtrl.text) ?? DateTime(now.year - 25),
      firstDate: DateTime(1920),
      lastDate: now,
    );
    if (picked != null) {
      setState(() {
        _dobCtrl.text =
            '${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
      });
    }
  }

  @override
  void dispose() {
    _fullNameCtrl.dispose();
    _heightCtrl.dispose();
    _weightCtrl.dispose();
    _bodyFatCtrl.dispose();
    _waistCtrl.dispose();
    _dobCtrl.dispose();
    _waterGoalCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(title: Text(l.profileTitle)),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(_error!, style: const TextStyle(color: Colors.red)),
                      const SizedBox(height: 16),
                      FilledButton(onPressed: _load, child: Text(l.retry)),
                    ],
                  ),
                )
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // Email header
                    if (_user != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Text(
                          _user!.email,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ),

                    // Account section
                    Text(l.profileAccountSection,
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _fullNameCtrl,
                      decoration: InputDecoration(
                        labelText: l.profileFullName,
                        border: const OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _goal.isEmpty ? null : _goal,
                      decoration: InputDecoration(
                        labelText: l.profileGoal,
                        border: const OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'fat_loss', child: Text('Fat loss')),
                        DropdownMenuItem(value: 'muscle_gain', child: Text('Muscle gain')),
                        DropdownMenuItem(value: 'general_health', child: Text('General health')),
                        DropdownMenuItem(value: 'performance', child: Text('Athletic performance')),
                      ],
                      onChanged: (v) => setState(() => _goal = v ?? ''),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _unitSystem,
                      decoration: InputDecoration(
                        labelText: l.profileUnitSystem,
                        border: const OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'metric', child: Text('Metric')),
                        DropdownMenuItem(value: 'imperial', child: Text('Imperial')),
                      ],
                      onChanged: (v) => setState(() => _unitSystem = v ?? 'metric'),
                    ),
                    const SizedBox(height: 12),
                    FilledButton(
                      onPressed: _saving ? null : _saveAccount,
                      child: Text(_saving ? '...' : l.profileSaveAccount),
                    ),

                    const SizedBox(height: 24),
                    const Divider(),
                    const SizedBox(height: 16),

                    // Body profile section
                    Text(l.profileBodySection,
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _heightCtrl,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            decoration: InputDecoration(
                              labelText: l.profileHeight,
                              border: const OutlineInputBorder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _weightCtrl,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            decoration: InputDecoration(
                              labelText: l.weightKg,
                              border: const OutlineInputBorder(),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _bodyFatCtrl,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            decoration: InputDecoration(
                              labelText: l.bodyFatPct,
                              border: const OutlineInputBorder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _waistCtrl,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            decoration: InputDecoration(
                              labelText: l.waistCm,
                              border: const OutlineInputBorder(),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _dobCtrl,
                      readOnly: true,
                      onTap: _pickDate,
                      decoration: InputDecoration(
                        labelText: l.profileDateOfBirth,
                        border: const OutlineInputBorder(),
                        suffixIcon: const Icon(Icons.calendar_today),
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _gender.isEmpty ? null : _gender,
                      decoration: InputDecoration(
                        labelText: l.profileGender,
                        border: const OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'male', child: Text('Male')),
                        DropdownMenuItem(value: 'female', child: Text('Female')),
                        DropdownMenuItem(value: 'other', child: Text('Other')),
                      ],
                      onChanged: (v) => setState(() => _gender = v ?? ''),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: _activityLevel.isEmpty ? null : _activityLevel,
                      decoration: InputDecoration(
                        labelText: l.profileActivityLevel,
                        border: const OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'sedentary', child: Text('Sedentary')),
                        DropdownMenuItem(value: 'lightly_active', child: Text('Lightly active')),
                        DropdownMenuItem(value: 'moderately_active', child: Text('Moderately active')),
                        DropdownMenuItem(value: 'very_active', child: Text('Very active')),
                        DropdownMenuItem(value: 'extremely_active', child: Text('Extremely active')),
                      ],
                      onChanged: (v) => setState(() => _activityLevel = v ?? ''),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _waterGoalCtrl,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: l.profileWaterGoal,
                        border: const OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 12),
                    FilledButton(
                      onPressed: _saving ? null : _saveProfile,
                      child: Text(_saving ? '...' : l.profileSaveBody),
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
    );
  }
}
