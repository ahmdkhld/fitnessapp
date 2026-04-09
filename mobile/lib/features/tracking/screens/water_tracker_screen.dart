import 'package:flutter/material.dart';
import 'package:nutritrack/l10n/app_localizations.dart';
import '../../../core/di/injection.dart';
import '../repositories/water_repository.dart';

class WaterTrackerScreen extends StatefulWidget {
  const WaterTrackerScreen({super.key});

  @override
  State<WaterTrackerScreen> createState() => _WaterTrackerScreenState();
}

class _WaterTrackerScreenState extends State<WaterTrackerScreen> {
  final _repo = getIt<WaterRepository>();
  WaterDay? _day;
  bool _loading = true;

  static const _goalMl = 2500;

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  Future<void> _refresh() async {
    setState(() => _loading = true);
    try {
      final day = await _repo.fetch(DateTime.now());
      setState(() {
        _day = day;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _add(int amount) async {
    await _repo.log(amount);
    await _refresh();
  }

  @override
  Widget build(BuildContext context) {
    final total = _day?.totalMl ?? 0;
    final progress = (total / _goalMl).clamp(0.0, 1.0);

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.todayWaterTitle),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  SizedBox(
                    height: 180,
                    width: 180,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        SizedBox.expand(
                          child: CircularProgressIndicator(
                            value: progress,
                            strokeWidth: 12,
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '$total ml',
                              style: Theme.of(context).textTheme.headlineSmall,
                            ),
                            Text('/ $_goalMl ml'),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  Wrap(
                    spacing: 12,
                    children: [
                      for (final amt in [100, 250, 500, 750])
                        FilledButton(
                          onPressed: () => _add(amt),
                          child: Text('+$amt ml'),
                        ),
                    ],
                  ),
                ],
              ),
            ),
    );
  }
}
