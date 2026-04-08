import 'dart:async';
import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import '../../features/settings/repositories/notification_settings_repository.dart';
import '../notifications/local_notification_service.dart';

// ---------------------------------------------------------------------------
// IMPORTANT: Before this service will work you must add the platform-specific
// Firebase config files to the project:
//
//   Android : android/app/google-services.json
//   iOS     : ios/Runner/GoogleService-Info.plist
//
// These are generated from the Firebase Console when you register the app.
// Without them Firebase.initializeApp() will throw at runtime.
// ---------------------------------------------------------------------------

/// Top-level handler required by firebase_messaging for background messages.
/// Must be a top-level function (not a class method or closure).
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Firebase must be initialised even in the background isolate.
  await Firebase.initializeApp();
  debugPrint('[FCM] Background message: ${message.messageId}');
}

/// Manages Firebase Cloud Messaging lifecycle:
///   - Firebase initialisation
///   - Permission request
///   - FCM token retrieval and refresh
///   - Foreground message display (delegates to [LocalNotificationService])
///   - Notification tap handling (delegates to an optional callback)
class PushNotificationService {
  PushNotificationService({
    required LocalNotificationService localNotifications,
    required NotificationSettingsRepository settingsRepository,
  })  : _local = localNotifications,
        _settingsRepo = settingsRepository;

  final LocalNotificationService _local;
  final NotificationSettingsRepository _settingsRepo;

  final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  StreamSubscription<RemoteMessage>? _foregroundSub;
  StreamSubscription<String>? _tokenRefreshSub;

  /// Callback invoked when the user taps a notification.
  /// The [Map] contains the `data` payload from the FCM message so the caller
  /// can navigate to the appropriate screen (e.g. `{'route': '/timeline'}`).
  void Function(Map<String, dynamic> data)? onNotificationTap;

  // -----------------------------------------------------------------------
  // Initialisation
  // -----------------------------------------------------------------------

  /// Call once during app startup (after [setupDependencies]).
  Future<void> init() async {
    // 1. Initialise Firebase (safe to call multiple times).
    await Firebase.initializeApp();

    // 2. Register the background handler.
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // 3. Request permission (iOS will show the system prompt; Android 13+
    //    requires POST_NOTIFICATIONS which this also handles).
    await _requestPermission();

    // 4. Retrieve the current FCM token and send it to the backend.
    await _registerToken();

    // 5. Listen for token refreshes so the backend always has a valid token.
    _tokenRefreshSub = _messaging.onTokenRefresh.listen(_onTokenRefresh);

    // 6. Listen for foreground messages and display via local notifications.
    _foregroundSub =
        FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // 7. Handle taps on notifications that opened the app from background.
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

    // 8. Check if the app was launched by tapping a notification (cold start).
    final initial = await _messaging.getInitialMessage();
    if (initial != null) {
      _handleNotificationTap(initial);
    }
  }

  // -----------------------------------------------------------------------
  // Permission
  // -----------------------------------------------------------------------

  Future<void> _requestPermission() async {
    final settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );
    debugPrint('[FCM] Auth status: ${settings.authorizationStatus}');
  }

  // -----------------------------------------------------------------------
  // Token management
  // -----------------------------------------------------------------------

  Future<void> _registerToken() async {
    try {
      final token = await _messaging.getToken();
      if (token == null) return;
      debugPrint('[FCM] Token: $token');

      // On iOS we may also need the APNs token for certain backend
      // integrations (e.g. sending silent pushes via APNs directly).
      String? apns;
      if (Platform.isIOS) {
        apns = await _messaging.getAPNSToken();
      }

      await _settingsRepo.registerDevice(fcmToken: token, apnsToken: apns);
    } catch (e, st) {
      debugPrint('[FCM] Failed to register token: $e\n$st');
    }
  }

  Future<void> _onTokenRefresh(String token) async {
    debugPrint('[FCM] Token refreshed: $token');
    try {
      String? apns;
      if (Platform.isIOS) {
        apns = await _messaging.getAPNSToken();
      }
      await _settingsRepo.registerDevice(fcmToken: token, apnsToken: apns);
    } catch (e, st) {
      debugPrint('[FCM] Failed to re-register refreshed token: $e\n$st');
    }
  }

  // -----------------------------------------------------------------------
  // Foreground messages
  // -----------------------------------------------------------------------

  void _handleForegroundMessage(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    // Use a deterministic ID derived from the message so we never collide.
    final id = message.messageId.hashCode;

    _local.show(
      id: id,
      title: notification.title ?? '',
      body: notification.body ?? '',
      payload: message.data.toString(),
    );
  }

  // -----------------------------------------------------------------------
  // Notification tap
  // -----------------------------------------------------------------------

  void _handleNotificationTap(RemoteMessage message) {
    debugPrint('[FCM] Notification tapped: ${message.data}');
    onNotificationTap?.call(message.data);
  }

  // -----------------------------------------------------------------------
  // Cleanup
  // -----------------------------------------------------------------------

  void dispose() {
    _foregroundSub?.cancel();
    _tokenRefreshSub?.cancel();
  }
}
