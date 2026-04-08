import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

import '../../../core/di/injection.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/themed_colors.dart';
import '../repositories/export_repository.dart';

class CoachReportScreen extends StatefulWidget {
  const CoachReportScreen({super.key});

  @override
  State<CoachReportScreen> createState() => _CoachReportScreenState();
}

class _CoachReportScreenState extends State<CoachReportScreen> {
  final _repo = getIt<ExportRepository>();

  late DateTime _from;
  late DateTime _to;
  CoachReportSummary? _report;
  bool _loading = false;
  bool _downloading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _to = DateTime.now();
    _from = _to.subtract(const Duration(days: 14));
  }

  Future<void> _pickDateRange() async {
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDateRange: DateTimeRange(start: _from, end: _to),
    );
    if (picked != null) {
      setState(() {
        _from = picked.start;
        _to = picked.end;
        _report = null;
      });
    }
  }

  Future<void> _generateReport() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final report = await _repo.fetchReport(from: _from, to: _to);
      setState(() {
        _report = report;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  Future<void> _downloadPdf() async {
    final l = AppLocalizations.of(context)!;
    setState(() => _downloading = true);
    try {
      final bytes = await _repo.fetchReportPdf(from: _from, to: _to);
      final dir = await getTemporaryDirectory();
      final fileName =
          'nutritrack-report-${_from.toIso8601String().substring(0, 10)}.pdf';
      final file = File('${dir.path}/$fileName');
      await file.writeAsBytes(bytes);

      await SharePlus.instance.share(
        ShareParams(
          files: [XFile(file.path)],
          subject: l.coachReportTitle,
        ),
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${l.coachReportPdfError}: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _downloading = false);
    }
  }

  String _formatDate(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
    final c = ThemedColors.of(context);
    final l = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(title: Text(l.coachReportTitle)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Date range selector
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(AppColors.radiusMd),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(l.coachReportDateRange.toUpperCase(),
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.5,
                    )),
                const SizedBox(height: 8),
                InkWell(
                  onTap: _pickDateRange,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.bg,
                      border: Border.all(color: AppColors.border),
                      borderRadius:
                          BorderRadius.circular(AppColors.radiusSm),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.date_range,
                            size: 20, color: AppColors.muted),
                        const SizedBox(width: 8),
                        Text('${_formatDate(_from)}  \u2014  ${_formatDate(_to)}'),
                        const Spacer(),
                        const Icon(Icons.edit,
                            size: 16, color: AppColors.muted),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: _loading ? null : _generateReport,
                    icon: _loading
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: AppColors.fg),
                          )
                        : const Icon(Icons.assessment),
                    label: Text(l.coachReportGenerate),
                  ),
                ),
              ],
            ),
          ),

          if (_error != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.badgeRedBg,
                borderRadius:
                    BorderRadius.circular(AppColors.radiusSm),
                border:
                    Border.all(color: AppColors.danger.withAlpha(80)),
              ),
              child: Text(_error!,
                  style: const TextStyle(color: AppColors.dangerMuted)),
            ),
          ],

          // Report summary
          if (_report != null) ...[
            const SizedBox(height: 16),
            _SummaryCard(report: _report!),
            const SizedBox(height: 12),
            _WorkoutsCard(report: _report!),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _downloading ? null : _downloadPdf,
                icon: _downloading
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.picture_as_pdf),
                label: Text(l.coachReportDownloadPdf),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({required this.report});
  final CoachReportSummary report;

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(AppColors.radiusMd),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(l.coachReportSummary.toUpperCase(),
              style: const TextStyle(
                color: AppColors.muted,
                fontSize: 11,
                fontWeight: FontWeight.w500,
                letterSpacing: 0.5,
              )),
          if (report.userName.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(report.userName,
                style: const TextStyle(color: AppColors.muted, fontSize: 13)),
          ],
          const SizedBox(height: 16),
          Row(
            children: [
              SizedBox(
                height: 80,
                width: 80,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox.expand(
                      child: CircularProgressIndicator(
                        value: report.adherencePct / 100,
                        strokeWidth: 6,
                        backgroundColor: AppColors.border,
                        color: AppColors.accentGreen,
                      ),
                    ),
                    Text('${report.adherencePct}%',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: AppColors.fg,
                        )),
                  ],
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(l.coachReportAdherence,
                        style: const TextStyle(
                            fontWeight: FontWeight.w500, fontSize: 15)),
                    const SizedBox(height: 4),
                    Text(
                      '${report.completed} / ${report.totalItems} ${l.coachReportItemsCompleted}',
                      style:
                          const TextStyle(color: AppColors.muted, fontSize: 13),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${report.from} \u2014 ${report.to}',
                      style:
                          const TextStyle(color: AppColors.muted, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _WorkoutsCard extends StatelessWidget {
  const _WorkoutsCard({required this.report});
  final CoachReportSummary report;

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context)!;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(AppColors.radiusMd),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(l.coachReportWorkouts.toUpperCase(),
              style: const TextStyle(
                color: AppColors.muted,
                fontSize: 11,
                fontWeight: FontWeight.w500,
                letterSpacing: 0.5,
              )),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.fitness_center,
                  size: 20, color: AppColors.accentGreen),
              const SizedBox(width: 8),
              Text(
                '${report.workoutSessionCount} ${l.coachReportSessions}',
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.timer, size: 20, color: AppColors.accent),
              const SizedBox(width: 8),
              Text(
                '${report.workoutTotalDurationMin} ${l.coachReportMinutes}',
              ),
            ],
          ),
        ],
      ),
    );
  }
}
