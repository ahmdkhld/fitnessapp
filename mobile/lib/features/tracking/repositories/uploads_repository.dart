import 'dart:io';
import 'package:http/http.dart' as http;
import '../../../core/api/api_client.dart';

/// Uses the backend's presigned upload flow to put a file directly
/// into S3/R2 without proxying the bytes through the API.
class UploadsRepository {
  UploadsRepository(this._api);
  final ApiClient _api;

  Future<String?> uploadBodyPhoto(File file) async {
    final ext = file.path.split('.').last.toLowerCase();
    final res = await _api.dio.post<Map<String, dynamic>>(
      '/uploads/presign',
      data: {
        'kind': 'body-photo',
        'contentType': _contentType(ext),
        'extension': ext,
      },
    );
    final uploadUrl = res.data?['uploadUrl'] as String?;
    final publicUrl = res.data?['publicUrl'] as String?;
    if (uploadUrl == null || publicUrl == null) return null;
    if (uploadUrl.startsWith('dev://')) {
      // Dev fallback — backend has no S3 creds; skip upload.
      return publicUrl;
    }

    final bytes = await file.readAsBytes();
    final put = await http.put(
      Uri.parse(uploadUrl),
      headers: {'Content-Type': _contentType(ext)},
      body: bytes,
    );
    if (put.statusCode >= 200 && put.statusCode < 300) {
      return publicUrl;
    }
    throw Exception('Upload failed (${put.statusCode})');
  }

  String _contentType(String ext) {
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
  }
}
