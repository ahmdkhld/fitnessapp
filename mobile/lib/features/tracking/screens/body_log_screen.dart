import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import '../../../core/di/injection.dart';
import '../repositories/body_log_repository.dart';
import '../repositories/uploads_repository.dart';

class BodyLogScreen extends StatefulWidget {
  const BodyLogScreen({super.key});

  @override
  State<BodyLogScreen> createState() => _BodyLogScreenState();
}

class _BodyLogScreenState extends State<BodyLogScreen> {
  final _repo = getIt<BodyLogRepository>();
  final _uploads = getIt<UploadsRepository>();
  final _picker = ImagePicker();
  List<BodyLogEntry> _logs = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _logs = await _repo.list();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _create() async {
    final weight = TextEditingController();
    final waist = TextEditingController();
    final bodyFat = TextEditingController();
    int energy = 3;
    final notes = TextEditingController();
    File? photoFile;

    final saved = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 16,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
        ),
        child: StatefulBuilder(
          builder: (ctx, setSt) => SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('New body log', style: TextStyle(fontSize: 18)),
                const SizedBox(height: 12),
                TextField(
                  controller: weight,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Weight (kg)'),
                ),
                TextField(
                  controller: waist,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Waist (cm)'),
                ),
                TextField(
                  controller: bodyFat,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Body fat %'),
                ),
                const SizedBox(height: 12),
                Text('Energy: $energy / 5'),
                Slider(
                  value: energy.toDouble(),
                  min: 1,
                  max: 5,
                  divisions: 4,
                  onChanged: (v) => setSt(() => energy = v.round()),
                ),
                TextField(
                  controller: notes,
                  decoration: const InputDecoration(labelText: 'Notes'),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    OutlinedButton.icon(
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Camera'),
                      onPressed: () async {
                        final picked = await _picker.pickImage(
                          source: ImageSource.camera,
                          imageQuality: 75,
                        );
                        if (picked != null) {
                          setSt(() => photoFile = File(picked.path));
                        }
                      },
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton.icon(
                      icon: const Icon(Icons.photo_library),
                      label: const Text('Gallery'),
                      onPressed: () async {
                        final picked = await _picker.pickImage(
                          source: ImageSource.gallery,
                          imageQuality: 75,
                        );
                        if (picked != null) {
                          setSt(() => photoFile = File(picked.path));
                        }
                      },
                    ),
                  ],
                ),
                if (photoFile != null) ...[
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.file(photoFile!, height: 120),
                  ),
                ],
                const SizedBox(height: 12),
                FilledButton(
                  onPressed: () => Navigator.pop(ctx, true),
                  child: const Text('Save'),
                ),
              ],
            ),
          ),
        ),
      ),
    );

    if (saved == true) {
      String? photoUrl;
      if (photoFile != null) {
        try {
          photoUrl = await _uploads.uploadBodyPhoto(photoFile!);
        } catch (e) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Photo upload failed: $e')),
            );
          }
        }
      }
      await _repo.create(
        weightKg: double.tryParse(weight.text),
        waistCm: double.tryParse(waist.text),
        bodyFatPct: double.tryParse(bodyFat.text),
        energyLevel: energy,
        notes: notes.text.isEmpty ? null : notes.text,
        photoUrl: photoUrl,
      );
      await _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Body log')),
      floatingActionButton: FloatingActionButton(
        onPressed: _create,
        child: const Icon(Icons.add),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _logs.isEmpty
              ? const Center(child: Text('No logs yet.'))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _logs.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (_, i) {
                    final l = _logs[i];
                    final parts = <String>[
                      if (l.weightKg != null) '${l.weightKg!.toStringAsFixed(1)} kg',
                      if (l.waistCm != null) 'waist ${l.waistCm!.toStringAsFixed(1)} cm',
                      if (l.bodyFatPct != null)
                        'bf ${l.bodyFatPct!.toStringAsFixed(1)}%',
                      if (l.energyLevel != null) 'energy ${l.energyLevel}/5',
                    ];
                    return Card(
                      child: ListTile(
                        title: Text(DateFormat.yMMMd().format(l.date)),
                        subtitle: Text(parts.join(' · ')),
                      ),
                    );
                  },
                ),
    );
  }
}
