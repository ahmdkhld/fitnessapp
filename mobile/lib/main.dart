import 'package:flutter/material.dart';
import 'app.dart';
import 'core/di/injection.dart';
import 'core/notifications/push_notification_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await setupDependencies();

  // Initialise FCM push notifications. This is safe to call even when Firebase
  // config files are missing during development — the error is caught and
  // logged so the rest of the app still starts normally.
  try {
    await getIt<PushNotificationService>().init();
  } catch (e) {
    debugPrint('[main] Push notification init failed (Firebase config '
        'missing?): $e');
  }

  runApp(const NutriTrackApp());
}
