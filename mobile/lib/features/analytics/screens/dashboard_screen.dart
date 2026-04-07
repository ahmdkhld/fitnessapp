import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../repositories/analytics_repository.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _repo = getIt<AnalyticsRepository>();
  AdherenceSummary? _summary;
  int _streak = 0;
  List<Map<String, dynamic>> _insights = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final results = await Future.wait([
        _repo.adherence(),
        _repo.streak(),
        _repo.insights(),
      ]);
      setState(() {
        _summary = results[0] as AdherenceSummary;
        _streak = results[1] as int;
        _insights = results[2] as List<Map<String, dynamic>>;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Progress')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _AdherenceCard(summary: _summary),
                  const SizedBox(height: 12),
                  _StreakCard(streak: _streak),
                  const SizedBox(height: 16),
                  Text('Insights', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  if (_insights.isEmpty)
                    const Text('No insights yet — keep logging!'),
                  ..._insights.map(
                    (i) => Card(
                      child: ListTile(
                        leading: const Icon(Icons.lightbulb_outline),
                        title: Text(i['title']?.toString() ?? ''),
                        subtitle: Text(i['detail']?.toString() ?? ''),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

class _AdherenceCard extends StatelessWidget {
  const _AdherenceCard({required this.summary});
  final AdherenceSummary? summary;

  @override
  Widget build(BuildContext context) {
    final pct = summary?.overallPercentage ?? 0;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            SizedBox(
              height: 80,
              width: 80,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox.expand(
                    child: CircularProgressIndicator(
                      value: pct / 100,
                      strokeWidth: 8,
                    ),
                  ),
                  Text('$pct%'),
                ],
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Weekly adherence',
                      style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text(
                    '${summary?.completed ?? 0} of ${summary?.total ?? 0} items completed',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StreakCard extends StatelessWidget {
  const _StreakCard({required this.streak});
  final int streak;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: const Icon(Icons.local_fire_department, size: 36),
        title: Text('$streak day streak',
            style: Theme.of(context).textTheme.titleMedium),
        subtitle: const Text('Consecutive days at 80%+ adherence'),
      ),
    );
  }
}
