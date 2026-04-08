import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Resolves semantic colors from AppColors based on the current brightness.
/// Usage: `final c = ThemedColors.of(context);`
class ThemedColors {
  ThemedColors._(this._brightness);

  factory ThemedColors.of(BuildContext context) =>
      ThemedColors._(Theme.of(context).brightness);

  final Brightness _brightness;
  bool get _isDark => _brightness == Brightness.dark;

  Color get bg => _isDark ? AppColors.darkBg : AppColors.lightBg;
  Color get fg => _isDark ? AppColors.darkFg : AppColors.lightFg;
  Color get muted => _isDark ? AppColors.darkMuted : AppColors.lightMuted;
  Color get card => _isDark ? AppColors.darkCard : AppColors.lightCard;
  Color get border => _isDark ? AppColors.darkBorder : AppColors.lightBorder;
  Color get glassBg => _isDark ? AppColors.darkGlassBg : AppColors.lightGlassBg;

  List<BoxShadow> get glowBlue =>
      _isDark ? AppColors.glowBlueShadow : AppColors.glowBlueShadowLight;
  List<BoxShadow> get cardShadow =>
      _isDark ? AppColors.cardElevation : AppColors.cardElevationLight;
}
