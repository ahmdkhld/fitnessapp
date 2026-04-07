import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/di/injection.dart';
import '../repositories/body_log_repository.dart';

class BodyLogScreen extends StatefulWidget {
  const BodyLogScreen({super.key});

  @override
  State<BodyLogScreen> createState() => _BodyLogScreenState();
}

class _BodyLogScreenState extends State<BodyLogScreen> {
  final _repo = getIt<BodyLogRepository>();
  List<BodyLogEntry> _logs = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _logs = await _repo.list();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _create() async {
    final weight = TextEditingController();
    final waist = TextEditingController();
    final bodyFat = TextEditingController();
    int energy = 3;
    final notes = TextEditingController();

    final saved = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 16,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
        ),
        child: StatefulBuilder(
          builder: (ctx, setSt) => Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('New body log', style: TextStyle(fontSize: 18)),
              const SizedBox(height: 12),
              TextField(
                controller: weight,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Weight (kg)'),
              ),
              TextField(
                controller: waist,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Waist (cm)'),
              ),
              TextField(
                controller: bodyFat,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Body fat %'),
              ),
              const SizedBox(height: 12),
              Text('Energy: $energy / 5'),
              Slider(
                value: energy.toDouble(),
                min: 1,
                max: 5,
                divisions: 4,
                onChanged: (v) => setSt(() => energy = v.round()),
              ),
              TextField(
                controller: notes,
                decoration: const InputDecoration(labelText: 'Notes'),
              ),
              const SizedBox(height: 12),
              FilledButton(
                onPressed: () => Navigator.pop(ctx, true),
                child: const Text('Save'),
              ),
            ],
          ),
        ),
      ),
    );

    if (saved == true) {
      await _repo.create(
        weightKg: double.tryParse(weight.text),
        waistCm: double.tryParse(waist.text),
        bodyFatPct: double.tryParse(bodyFat.text),
        energyLevel: energy,
        notes: notes.text.isEmpty ? null : notes.text,
      );
      await _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Body log')),
      floatingActionButton: FloatingActionButton(
        onPressed: _create,
        child: const Icon(Icons.add),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _logs.isEmpty
              ? const Center(child: Text('No logs yet.'))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _logs.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (_, i) {
                    final l = _logs[i];
                    final parts = <String>[
                      if (l.weightKg != null) '${l.weightKg!.toStringAsFixed(1)} kg',
                      if (l.waistCm != null) 'waist ${l.waistCm!.toStringAsFixed(1)} cm',
                      if (l.bodyFatPct != null)
                        'bf ${l.bodyFatPct!.toStringAsFixed(1)}%',
                      if (l.energyLevel != null) 'energy ${l.energyLevel}/5',
                    ];
                    return Card(
                      child: ListTile(
                        title: Text(DateFormat.yMMMd().format(l.date)),
                        subtitle: Text(parts.join(' · ')),
                      ),
                    );
                  },
                ),
    );
  }
}
