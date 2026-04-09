import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../repositories/supplement_repository.dart';

class SupplementEditorScreen extends StatefulWidget {
  const SupplementEditorScreen({super.key, required this.planId});

  final String planId;

  @override
  State<SupplementEditorScreen> createState() => _SupplementEditorScreenState();
}

class _SupplementEditorScreenState extends State<SupplementEditorScreen> {
  final _repo = getIt<SupplementRepository>();
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _dosage = TextEditingController();
  final _stock = TextEditingController();
  String _frequency = 'daily';
  TimeOfDay _time = const TimeOfDay(hour: 8, minute: 30);
  final Set<int> _days = {1, 2, 3, 4, 5};
  bool _saving = false;

  static const _dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  Future<void> _pickTime() async {
    final t = await showTimePicker(context: context, initialTime: _time);
    if (t != null) setState(() => _time = t);
  }

  Future<void> _save() async {
    if (!_form.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      await _repo.addSupplement(
        planId: widget.planId,
        name: _name.text,
        scheduledTime:
            '${_time.hour.toString().padLeft(2, '0')}:${_time.minute.toString().padLeft(2, '0')}:00',
        dosage: _dosage.text.isEmpty ? null : _dosage.text,
        frequency: _frequency,
        frequencyDays: _frequency == 'custom' ? (_days.toList()..sort()) : null,
        stockQuantity: int.tryParse(_stock.text),
      );
      if (mounted) Navigator.pop(context, true);
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
      appBar: AppBar(title: const Text('New supplement')),
      body: Form(
        key: _form,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _name,
              decoration: const InputDecoration(labelText: 'Name'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _dosage,
              decoration: const InputDecoration(labelText: 'Dosage (e.g. 5000 IU)'),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.schedule),
                const SizedBox(width: 12),
                Text(_time.format(context)),
                const Spacer(),
                TextButton(onPressed: _pickTime, child: const Text('Change')),
              ],
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _frequency,
              decoration: const InputDecoration(labelText: 'Frequency'),
              items: const [
                DropdownMenuItem(value: 'daily', child: Text('Daily')),
                DropdownMenuItem(value: 'weekdays', child: Text('Weekdays')),
                DropdownMenuItem(value: 'custom', child: Text('Custom')),
              ],
              onChanged: (v) => setState(() => _frequency = v ?? 'daily'),
            ),
            if (_frequency == 'custom') ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: List.generate(7, (i) {
                  final day = i + 1;
                  final selected = _days.contains(day);
                  return ChoiceChip(
                    label: Text(_dayLabels[i]),
                    selected: selected,
                    onSelected: (v) => setState(() {
                      if (v) {
                        _days.add(day);
                      } else {
                        _days.remove(day);
                      }
                    }),
                  );
                }),
              ),
            ],
            const SizedBox(height: 16),
            TextFormField(
              controller: _stock,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Stock (servings remaining)',
              ),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _saving ? null : _save,
              child: Text(_saving ? 'Saving…' : 'Save'),
            ),
          ],
        ),
      ),
    );
  }
}
