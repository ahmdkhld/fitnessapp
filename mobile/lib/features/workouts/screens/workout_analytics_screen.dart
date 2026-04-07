import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../repositories/workout_analytics_repository.dart';

class WorkoutAnalyticsScreen extends StatefulWidget {
  const WorkoutAnalyticsScreen({super.key});

  @override
  State<WorkoutAnalyticsScreen> createState() => _WorkoutAnalyticsScreenState();
}

class _WorkoutAnalyticsScreenState extends State<WorkoutAnalyticsScreen> {
  final _repo = getIt<WorkoutAnalyticsRepository>();
  List<VolumePoint> _volume = const [];
  List<PersonalRecord> _prs = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final from = DateTime.now().subtract(const Duration(days: 56));
      _volume = await _repo.volume(from: from);
      _prs = await _repo.prs();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Map<String, int> _totalByWeek() {
    final totals = <String, int>{};
    for (final p in _volume) {
      totals[p.bucket] = (totals[p.bucket] ?? 0) + p.volumeKg;
    }
    return totals;
  }

  @override
  Widget build(BuildContext context) {
    final totals = _totalByWeek();
    final weeks = totals.keys.toList()..sort();
    final maxVol = totals.values.isEmpty
        ? 1.0
        : totals.values.reduce((a, b) => a > b ? a : b).toDouble();

    return Scaffold(
      appBar: AppBar(title: const Text('Workout analytics')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Text('Weekly volume',
                      style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 220,
                    child: weeks.isEmpty
                        ? const Center(child: Text('Log a session to see data.'))
                        : BarChart(
                            BarChartData(
                              maxY: maxVol * 1.1,
                              barGroups: [
                                for (int i = 0; i < weeks.length; i++)
                                  BarChartGroupData(
                                    x: i,
                                    barRods: [
                                      BarChartRodData(
                                        toY: totals[weeks[i]]!.toDouble(),
                                        width: 12,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                    ],
                                  ),
                              ],
                              borderData: FlBorderData(show: false),
                              gridData: const FlGridData(show: false),
                              titlesData: FlTitlesData(
                                rightTitles: const AxisTitles(
                                  sideTitles: SideTitles(showTitles: false),
                                ),
                                topTitles: const AxisTitles(
                                  sideTitles: SideTitles(showTitles: false),
                                ),
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    reservedSize: 30,
                                    getTitlesWidget: (value, _) {
                                      final i = value.toInt();
                                      if (i < 0 || i >= weeks.length) {
                                        return const SizedBox();
                                      }
                                      return Text(
                                        weeks[i].substring(5),
                                        style: const TextStyle(fontSize: 10),
                                      );
                                    },
                                  ),
                                ),
                              ),
                            ),
                          ),
                  ),
                  const SizedBox(height: 24),
                  Text('Personal records',
                      style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  if (_prs.isEmpty)
                    const Text('No PRs yet.')
                  else
                    ..._prs.map((pr) => Card(
                          child: ListTile(
                            leading: const Icon(
                              Icons.emoji_events,
                              color: Colors.amber,
                            ),
                            title: Text(pr.exerciseName),
                            subtitle: Text(
                              '${pr.recordType.replaceAll("_", " ")}: '
                              '${pr.value} ${pr.unit}',
                            ),
                            trailing: Text(
                              '${pr.achievedAt.toLocal().toString().substring(0, 10)}',
                            ),
                          ),
                        )),
                ],
              ),
            ),
    );
  }
}
