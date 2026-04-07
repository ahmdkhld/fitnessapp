import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../repositories/plan_import_repository.dart';

class UploadPlanScreen extends StatefulWidget {
  const UploadPlanScreen({super.key});

  @override
  State<UploadPlanScreen> createState() => _UploadPlanScreenState();
}

class _UploadPlanScreenState extends State<UploadPlanScreen> {
  final _repo = getIt<PlanImportRepository>();
  final _textCtrl = TextEditingController();
  Map<String, dynamic>? _parsed;
  bool _busy = false;
  String _planName = 'Imported plan';

  Future<void> _parse() async {
    setState(() => _busy = true);
    try {
      _parsed = await _repo.uploadText(_textCtrl.text);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Upload failed: $e')),
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _confirm() async {
    if (_parsed == null) return;
    setState(() => _busy = true);
    try {
      await _repo.confirm(id: _parsed!['id'] as String, name: _planName);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Plan imported')),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Confirm failed: $e')),
      );
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final parsed = _parsed?['parsedData'] as Map<String, dynamic>?;
    final meals = (parsed?['meals'] as List?) ?? [];
    final supps = (parsed?['supplements'] as List?) ?? [];

    return Scaffold(
      appBar: AppBar(title: const Text('Import plan')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Paste your diet/supplement plan below and tap Parse to preview.',
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _textCtrl,
            maxLines: 10,
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              hintText:
                  'Breakfast 8:00\n40g oats, 1 scoop whey\n\nVitamin D3 5000 IU — 8:30 with food',
            ),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _busy || _textCtrl.text.isEmpty ? null : _parse,
            child: Text(_busy ? 'Parsing…' : 'Parse'),
          ),
          if (parsed != null) ...[
            const Divider(height: 32),
            Text('Meals (${meals.length})',
                style: Theme.of(context).textTheme.titleMedium),
            ...meals.map((m) => ListTile(
                  dense: true,
                  leading: const Icon(Icons.restaurant),
                  title: Text('${m['name']} · ${m['scheduledTime']}'),
                  subtitle: Text(
                    (m['ingredients'] as List? ?? [])
                        .map((i) => i['name'])
                        .join(', '),
                  ),
                )),
            const SizedBox(height: 12),
            Text('Supplements (${supps.length})',
                style: Theme.of(context).textTheme.titleMedium),
            ...supps.map((s) => ListTile(
                  dense: true,
                  leading: const Icon(Icons.medication),
                  title: Text('${s['name']} · ${s['scheduledTime']}'),
                  subtitle: Text(s['dosage']?.toString() ?? ''),
                )),
            const SizedBox(height: 16),
            TextField(
              decoration: const InputDecoration(labelText: 'Plan name'),
              onChanged: (v) => _planName = v,
            ),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _busy ? null : _confirm,
              child: const Text('Import into my plans'),
            ),
          ],
        ],
      ),
    );
  }
}
