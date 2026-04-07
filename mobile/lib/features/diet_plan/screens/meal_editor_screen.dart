import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../repositories/diet_plan_repository.dart';

class MealEditorScreen extends StatefulWidget {
  const MealEditorScreen({super.key, required this.planId});

  final String planId;

  @override
  State<MealEditorScreen> createState() => _MealEditorScreenState();
}

class _MealEditorScreenState extends State<MealEditorScreen> {
  final _repo = getIt<DietPlanRepository>();
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController(text: 'Breakfast');
  final _kcal = TextEditingController();
  final _protein = TextEditingController();
  final _carbs = TextEditingController();
  final _fat = TextEditingController();
  TimeOfDay _time = const TimeOfDay(hour: 8, minute: 0);
  final List<MealIngredient> _ingredients = [];
  bool _saving = false;

  Future<void> _pickTime() async {
    final t = await showTimePicker(context: context, initialTime: _time);
    if (t != null) setState(() => _time = t);
  }

  void _addIngredient() {
    final nameCtrl = TextEditingController();
    final qtyCtrl = TextEditingController();
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Add ingredient'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: qtyCtrl,
              decoration: const InputDecoration(labelText: 'Quantity'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              if (nameCtrl.text.isNotEmpty) {
                setState(() {
                  _ingredients.add(MealIngredient(
                    name: nameCtrl.text,
                    quantity: qtyCtrl.text.isEmpty ? null : qtyCtrl.text,
                  ));
                });
              }
              Navigator.pop(ctx);
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  Future<void> _save() async {
    if (!_form.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      await _repo.addMeal(
        planId: widget.planId,
        name: _name.text,
        scheduledTime:
            '${_time.hour.toString().padLeft(2, '0')}:${_time.minute.toString().padLeft(2, '0')}:00',
        calories: int.tryParse(_kcal.text),
        proteinG: double.tryParse(_protein.text),
        carbsG: double.tryParse(_carbs.text),
        fatG: double.tryParse(_fat.text),
        ingredients: _ingredients,
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
      appBar: AppBar(title: const Text('New meal')),
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
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _kcal,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Calories'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _protein,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Protein (g)'),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _carbs,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Carbs (g)'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _fat,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Fat (g)'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                const Text('Ingredients', style: TextStyle(fontSize: 16)),
                const Spacer(),
                TextButton.icon(
                  onPressed: _addIngredient,
                  icon: const Icon(Icons.add),
                  label: const Text('Add'),
                ),
              ],
            ),
            ..._ingredients.map((i) => ListTile(
                  dense: true,
                  leading: const Icon(Icons.circle, size: 8),
                  title: Text(i.name),
                  subtitle: i.quantity != null ? Text(i.quantity!) : null,
                  trailing: IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => setState(() => _ingredients.remove(i)),
                  ),
                )),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _saving ? null : _save,
              child: Text(_saving ? 'Saving…' : 'Save meal'),
            ),
          ],
        ),
      ),
    );
  }
}
