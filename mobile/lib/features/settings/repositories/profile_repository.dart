import '../../../core/api/api_client.dart';

class UserInfo {
  UserInfo({
    required this.id,
    required this.email,
    this.fullName,
    this.avatarUrl,
    this.goal,
    required this.timezone,
    required this.unitSystem,
    required this.createdAt,
  });

  final String id;
  final String email;
  final String? fullName;
  final String? avatarUrl;
  final String? goal;
  final String timezone;
  final String unitSystem;
  final String createdAt;

  factory UserInfo.fromJson(Map<String, dynamic> json) => UserInfo(
        id: json['id'] as String,
        email: json['email'] as String,
        fullName: json['fullName'] as String?,
        avatarUrl: json['avatarUrl'] as String?,
        goal: json['goal'] as String?,
        timezone: json['timezone'] as String? ?? 'UTC',
        unitSystem: json['unitSystem'] as String? ?? 'metric',
        createdAt: json['createdAt'] as String? ?? '',
      );
}

class UserProfile {
  UserProfile({
    this.heightCm,
    this.weightKg,
    this.bodyFatPct,
    this.waistCm,
    this.dateOfBirth,
    this.gender,
    this.activityLevel,
    this.dailyWaterGoalMl = 2500,
  });

  double? heightCm;
  double? weightKg;
  double? bodyFatPct;
  double? waistCm;
  String? dateOfBirth;
  String? gender;
  String? activityLevel;
  int dailyWaterGoalMl;

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        heightCm: (json['heightCm'] as num?)?.toDouble(),
        weightKg: (json['weightKg'] as num?)?.toDouble(),
        bodyFatPct: (json['bodyFatPct'] as num?)?.toDouble(),
        waistCm: (json['waistCm'] as num?)?.toDouble(),
        dateOfBirth: json['dateOfBirth'] as String?,
        gender: json['gender'] as String?,
        activityLevel: json['activityLevel'] as String?,
        dailyWaterGoalMl: (json['dailyWaterGoalMl'] as int?) ?? 2500,
      );

  Map<String, dynamic> toJson() => {
        if (heightCm != null) 'heightCm': heightCm,
        if (weightKg != null) 'weightKg': weightKg,
        if (bodyFatPct != null) 'bodyFatPct': bodyFatPct,
        if (waistCm != null) 'waistCm': waistCm,
        if (dateOfBirth != null) 'dateOfBirth': dateOfBirth,
        if (gender != null) 'gender': gender,
        if (activityLevel != null) 'activityLevel': activityLevel,
        'dailyWaterGoalMl': dailyWaterGoalMl,
      };
}

class ProfileRepository {
  ProfileRepository(this._api);
  final ApiClient _api;

  Future<UserInfo> getUser() async {
    final res = await _api.dio.get<Map<String, dynamic>>('/users/me');
    return UserInfo.fromJson(res.data!);
  }

  Future<void> updateUser({String? fullName, String? goal, String? timezone, String? unitSystem}) async {
    final data = <String, dynamic>{};
    if (fullName != null) data['fullName'] = fullName;
    if (goal != null) data['goal'] = goal;
    if (timezone != null) data['timezone'] = timezone;
    if (unitSystem != null) data['unitSystem'] = unitSystem;
    if (data.isEmpty) return;
    await _api.dio.patch<void>('/users/me', data: data);
  }

  Future<UserProfile?> getProfile() async {
    try {
      final res = await _api.dio.get<Map<String, dynamic>>('/users/me/profile');
      if (res.data == null) return null;
      return UserProfile.fromJson(res.data!);
    } catch (_) {
      return null;
    }
  }

  Future<void> upsertProfile(UserProfile profile) async {
    await _api.dio.post<void>('/users/me/profile', data: profile.toJson());
  }
}
