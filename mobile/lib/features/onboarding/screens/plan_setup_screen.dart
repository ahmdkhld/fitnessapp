import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class PlanSetupScreen extends StatelessWidget {
  const PlanSetupScreen({super.key, this.goal});

  final String? goal;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Your plan')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Goal: ${goal ?? "—"}'),
            const SizedBox(height: 24),
            const Text(
              'How would you like to set up your diet and supplement plan?',
            ),
            const SizedBox(height: 24),
            Card(
              child: ListTile(
                leading: const Icon(Icons.edit),
                title: const Text('Build from scratch'),
                subtitle: const Text('Add meals and supplements manually'),
                onTap: () => context.go('/diet-plans'),
              ),
            ),
            Card(
              child: ListTile(
                leading: const Icon(Icons.upload_file),
                title: const Text('Import existing plan'),
                subtitle: const Text('Paste text from your coach or PDF'),
                onTap: () => context.go('/plan-import'),
              ),
            ),
            Card(
              child: ListTile(
                leading: const Icon(Icons.skip_next),
                title: const Text('Skip for now'),
                subtitle: const Text("I'll set this up later"),
                onTap: () => context.go('/timeline'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
