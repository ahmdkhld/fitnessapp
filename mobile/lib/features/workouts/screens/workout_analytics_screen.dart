import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../core/di/injection.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/themed_colors.dart';
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
    final c = ThemedColors.of(context);
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
                  Text(
                    'WEEKLY VOLUME',
                    style: TextStyle(
                      color: c.muted,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    height: 220,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: c.card,
                      borderRadius:
                          BorderRadius.circular(AppColors.radiusMd),
                      border: Border.all(color: c.border),
                    ),
                    child: weeks.isEmpty
                        ? Center(
                            child: Text('Log a session to see data.',
                                style: TextStyle(color: c.muted)))
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
                                        borderRadius:
                                            BorderRadius.circular(4),
                                        gradient: AppColors.accentGradient,
                                      ),
                                    ],
                                  ),
                              ],
                              borderData: FlBorderData(show: false),
                              gridData: FlGridData(
                                show: true,
                                drawVerticalLine: false,
                                getDrawingHorizontalLine: (_) => FlLine(
                                  color: c.border,
                                  strokeWidth: 0.5,
                                ),
                              ),
                              titlesData: FlTitlesData(
                                rightTitles: const AxisTitles(
                                  sideTitles: SideTitles(showTitles: false),
                                ),
                                topTitles: const AxisTitles(
                                  sideTitles: SideTitles(showTitles: false),
                                ),
                                leftTitles: const AxisTitles(
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
                                        style: TextStyle(
                                          fontSize: 10,
                                          color: c.muted,
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),
                            ),
                          ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'PERSONAL RECORDS',
                    style: TextStyle(
                      color: c.muted,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 10),
                  if (_prs.isEmpty)
                    Text('No PRs yet.',
                        style: TextStyle(color: c.muted))
                  else
                    ..._prs.map((pr) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 12),
                            decoration: BoxDecoration(
                              color: c.card,
                              borderRadius:
                                  BorderRadius.circular(AppColors.radiusMd),
                              border: Border.all(color: c.border),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 36,
                                  height: 36,
                                  decoration: const BoxDecoration(
                                    color: AppColors.badgeAmberBg,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.emoji_events,
                                      size: 18, color: AppColors.badgeAmber),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(pr.exerciseName,
                                          style: const TextStyle(
                                              fontWeight: FontWeight.w500,
                                              fontSize: 14)),
                                      Text(
                                        '${pr.recordType.replaceAll("_", " ")}: '
                                        '${pr.value} ${pr.unit}',
                                        style: TextStyle(
                                            color: c.muted,
                                            fontSize: 13),
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  pr.achievedAt
                                      .toLocal()
                                      .toString()
                                      .substring(0, 10),
                                  style: TextStyle(
                                      color: c.muted, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                        )),
                ],
              ),
            ),
    );
  }
}
