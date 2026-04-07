import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../repositories/supplement_repository.dart';
import 'supplement_editor_screen.dart';

class SupplementPlansScreen extends StatefulWidget {
  const SupplementPlansScreen({super.key});

  @override
  State<SupplementPlansScreen> createState() => _SupplementPlansScreenState();
}

class _SupplementPlansScreenState extends State<SupplementPlansScreen> {
  final _repo = getIt<SupplementRepository>();
  List<SupplementPlan> _plans = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _plans = await _repo.list();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _createPlan() async {
    final ctrl = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('New supplement plan'),
        content: TextField(
          controller: ctrl,
          decoration: const InputDecoration(labelText: 'Name'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Create'),
          ),
        ],
      ),
    );
    if (ok == true && ctrl.text.isNotEmpty) {
      await _repo.createPlan(ctrl.text);
      await _load();
    }
  }

  Future<void> _addSupplement(String planId) async {
    final created = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => SupplementEditorScreen(planId: planId)),
    );
    if (created == true) await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Supplements')),
      floatingActionButton: FloatingActionButton(
        onPressed: _createPlan,
        child: const Icon(Icons.add),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  if (_plans.isEmpty)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(32),
                        child: Text('No supplement plans yet.'),
                      ),
                    ),
                  ..._plans.map((plan) => Card(
                        child: ExpansionTile(
                          title: Text(plan.name),
                          subtitle: plan.isActive ? const Text('Active') : null,
                          trailing: plan.isActive
                              ? const Icon(Icons.star, color: Colors.amber)
                              : IconButton(
                                  icon: const Icon(Icons.check),
                                  onPressed: () async {
                                    await _repo.activate(plan.id);
                                    await _load();
                                  },
                                ),
                          children: [
                            ...plan.supplements.map((s) => ListTile(
                                  leading: const Icon(Icons.medication),
                                  title: Text(s.name),
                                  subtitle: Text(
                                    [s.scheduledTime, if (s.dosage != null) s.dosage!]
                                        .join(' · '),
                                  ),
                                  trailing: s.stockQuantity != null
                                      ? Text('${s.stockQuantity} left')
                                      : null,
                                )),
                            Padding(
                              padding: const EdgeInsets.all(8),
                              child: TextButton.icon(
                                onPressed: () => _addSupplement(plan.id),
                                icon: const Icon(Icons.add),
                                label: const Text('Add supplement'),
                              ),
                            ),
                          ],
                        ),
                      )),
                ],
              ),
            ),
    );
  }
}
