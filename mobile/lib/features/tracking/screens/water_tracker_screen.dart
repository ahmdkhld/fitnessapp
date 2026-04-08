import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../../core/di/injection.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/themed_colors.dart';
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
    final c = ThemedColors.of(context);
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
                  const SizedBox(height: 24),
                  // Circular progress with accent styling
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
                            backgroundColor: c.border,
                            color: AppColors.badgeCyan,
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '$total',
                              style: TextStyle(
                                fontSize: 36,
                                fontWeight: FontWeight.w700,
                                color: c.fg,
                              ),
                            ),
                            Text(
                              '/ $_goalMl ml',
                              style: TextStyle(
                                color: c.muted,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),
                  // Quick-add buttons
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    alignment: WrapAlignment.center,
                    children: [
                      for (final amt in [100, 250, 500, 750])
                        _QuickAddButton(
                          amount: amt,
                          onTap: () => _add(amt),
                        ),
                    ],
                  ),
                ],
              ),
            ),
    );
  }
}

class _QuickAddButton extends StatelessWidget {
  const _QuickAddButton({required this.amount, required this.onTap});
  final int amount;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: c.card,
          borderRadius: BorderRadius.circular(AppColors.radiusSm),
          border: Border.all(color: c.border),
        ),
        child: Text(
          '+$amount ml',
          style: const TextStyle(
            color: AppColors.badgeCyan,
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
      ),
    );
  }
}
