import '../../../core/api/api_client.dart';

class NotificationPrefs {
  NotificationPrefs({
    required this.pushEnabled,
    required this.mealReminder,
    required this.supplementReminder,
    required this.waterReminder,
    required this.overdueReminder,
    required this.advanceMinutes,
  });

  bool pushEnabled;
  bool mealReminder;
  bool supplementReminder;
  bool waterReminder;
  bool overdueReminder;
  int advanceMinutes;
}

class NotificationSettingsRepository {
  NotificationSettingsRepository(this._api);
  final ApiClient _api;

  Future<void> updateSettings(NotificationPrefs prefs) async {
    await _api.dio.patch<void>('/notifications/settings', data: {
      'pushEnabled': prefs.pushEnabled,
      'mealReminder': prefs.mealReminder,
      'supplementReminder': prefs.supplementReminder,
      'waterReminder': prefs.waterReminder,
      'overdueReminder': prefs.overdueReminder,
      'advanceMinutes': prefs.advanceMinutes,
    });
  }

  Future<void> registerDevice({String? fcmToken, String? apnsToken}) async {
    await _api.dio.post<void>('/notifications/register-device', data: {
      if (fcmToken != null) 'fcmToken': fcmToken,
      if (apnsToken != null) 'apnsToken': apnsToken,
    });
  }
}
