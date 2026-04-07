import 'dart:async';
import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../models/exercise.dart';
import '../repositories/exercises_repository.dart';

class ExercisesLibraryScreen extends StatefulWidget {
  const ExercisesLibraryScreen({super.key, this.onPick});

  /// Optional picker callback. When provided, tapping a row pops with
  /// the selected exercise instead of showing details.
  final ValueChanged<Exercise>? onPick;

  @override
  State<ExercisesLibraryScreen> createState() => _ExercisesLibraryScreenState();
}

class _ExercisesLibraryScreenState extends State<ExercisesLibraryScreen> {
  final _repo = getIt<ExercisesRepository>();
  final _searchCtrl = TextEditingController();
  List<Exercise> _exercises = const [];
  bool _loading = true;
  String? _category;
  Timer? _debounce;

  static const _categories = [
    ('all', 'All'),
    ('push', 'Push'),
    ('pull', 'Pull'),
    ('legs', 'Legs'),
    ('core', 'Core'),
    ('cardio', 'Cardio'),
    ('full_body', 'Full body'),
    ('mobility', 'Mobility'),
  ];

  @override
  void initState() {
    super.initState();
    _load();
    _searchCtrl.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchCtrl.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 250), _load);
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _exercises = await _repo.list(
        category: _category == 'all' ? null : _category,
        search: _searchCtrl.text,
      );
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _createCustom() async {
    final nameCtrl = TextEditingController();
    String? muscleChoice;
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create custom exercise'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Primary muscle'),
              items: const [
                'chest',
                'back',
                'quads',
                'hamstrings',
                'glutes',
                'shoulders',
                'biceps',
                'triceps',
                'core',
                'calves',
              ]
                  .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                  .toList(),
              onChanged: (v) => muscleChoice = v,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Create'),
          ),
        ],
      ),
    );
    if (ok == true && nameCtrl.text.isNotEmpty) {
      await _repo.create(name: nameCtrl.text, primaryMuscle: muscleChoice);
      await _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Exercise library'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Create custom',
            onPressed: _createCustom,
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchCtrl,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.search),
                hintText: 'Search exercises',
                border: OutlineInputBorder(),
              ),
            ),
          ),
          SizedBox(
            height: 40,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final cat = _categories[i];
                final selected = (_category ?? 'all') == cat.$1;
                return ChoiceChip(
                  label: Text(cat.$2),
                  selected: selected,
                  onSelected: (_) {
                    setState(() => _category = cat.$1);
                    _load();
                  },
                );
              },
            ),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _exercises.isEmpty
                    ? const Center(child: Text('No exercises match.'))
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: _exercises.length,
                        separatorBuilder: (_, __) => const Divider(height: 1),
                        itemBuilder: (_, i) {
                          final e = _exercises[i];
                          return ListTile(
                            leading: Icon(
                              e.isCardio
                                  ? Icons.directions_run
                                  : Icons.fitness_center,
                            ),
                            title: Text(e.name),
                            subtitle: Text([
                              if (e.primaryMuscle != null) e.primaryMuscle!,
                              if (e.equipment != null) e.equipment!,
                              if (e.isUnilateral) 'unilateral',
                              if (!e.isLibrary) 'custom',
                            ].join(' · ')),
                            onTap: widget.onPick == null
                                ? null
                                : () {
                                    Navigator.pop(context);
                                    widget.onPick!(e);
                                  },
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
