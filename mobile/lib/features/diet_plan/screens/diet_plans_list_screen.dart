import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/di/injection.dart';
import '../repositories/diet_plan_repository.dart';

class DietPlansListScreen extends StatefulWidget {
  const DietPlansListScreen({super.key});

  @override
  State<DietPlansListScreen> createState() => _DietPlansListScreenState();
}

class _DietPlansListScreenState extends State<DietPlansListScreen> {
  final _repo = getIt<DietPlanRepository>();
  List<DietPlan> _plans = const [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final plans = await _repo.list();
      setState(() {
        _plans = plans;
        _loading = false;
        _error = null;
      });
    } catch (e) {
      setState(() {
        _loading = false;
        _error = e.toString();
      });
    }
  }

  Future<void> _createPlan() async {
    final nameCtrl = TextEditingController();
    final goalCtrl = TextEditingController();
    final created = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('New diet plan'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: goalCtrl,
              decoration: const InputDecoration(labelText: 'Goal'),
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
    if (created == true && nameCtrl.text.isNotEmpty) {
      await _repo.create(name: nameCtrl.text, goal: goalCtrl.text);
      await _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Diet plans')),
      floatingActionButton: FloatingActionButton(
        onPressed: _createPlan,
        child: const Icon(Icons.add),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!))
              : RefreshIndicator(
                  onRefresh: _load,
                  child: _plans.isEmpty
                      ? const Center(child: Text('No plans yet — tap + to create one.'))
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: _plans.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 8),
                          itemBuilder: (_, i) {
                            final plan = _plans[i];
                            return Card(
                              child: ListTile(
                                title: Text(plan.name),
                                subtitle: plan.goal != null ? Text(plan.goal!) : null,
                                trailing: plan.isActive
                                    ? const Chip(label: Text('Active'))
                                    : TextButton(
                                        onPressed: () async {
                                          await _repo.activate(plan.id);
                                          await _load();
                                        },
                                        child: const Text('Activate'),
                                      ),
                                onTap: () =>
                                    context.push('/diet-plans/${plan.id}'),
                              ),
                            );
                          },
                        ),
                ),
    );
  }
}
