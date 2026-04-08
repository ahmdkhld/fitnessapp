import 'package:flutter/material.dart';

/// Design tokens matching the web UI's dark cyberpunk aesthetic.
/// Maps to CSS custom properties in web/app/globals.css.
class AppColors {
  AppColors._();

  // ── Core palette ──────────────────────────────────────
  static const Color bg = Color(0xFF121212);
  static const Color fg = Color(0xFFFFFFFF);
  static const Color accent = Color(0xFF0000FF);
  static const Color accentPurple = Color(0xFFA020F0);
  static const Color accentGreen = Color(0xFF22C55E);
  static const Color muted = Color(0xFFA9A9A9);
  static const Color card = Color(0xFF1E1E1E);
  static const Color border = Color(0xFF333333);
  static const Color danger = Color(0xFFEF4444);
  static const Color dangerMuted = Color(0xFFE07B5F);

  // ── Glass / translucent backgrounds ───────────────────
  static const Color glassBg = Color(0x991E1E1E); // ~0.6 opacity
  static const Color overlayBg = Color(0x99000000);

  // ── Glow / shadow helpers ─────────────────────────────
  static const Color glowBlue = Color(0x4D0000FF); // 0.3 opacity
  static const Color glowPurple = Color(0x4DA020F0);

  // ── Badge backgrounds (low-opacity tints) ─────────────
  static const Color badgeGreenBg = Color(0x2622C55E);
  static const Color badgeAmberBg = Color(0x26D8A24A);
  static const Color badgeCyanBg = Color(0x266AD1E0);
  static const Color badgePurpleBg = Color(0x26A020F0);
  static const Color badgeRedBg = Color(0x26EF4444);

  static const Color badgeAmber = Color(0xFFD8A24A);
  static const Color badgeCyan = Color(0xFF6AD1E0);

  // ── Radius scale ──────────────────────────────────────
  static const double radiusSm = 8;
  static const double radiusMd = 12;
  static const double radiusLg = 16;
  static const double radiusXl = 24;

  // ── Gradient helpers ──────────────────────────────────
  static const LinearGradient accentGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [accent, accentPurple],
  );

  static const LinearGradient avatarGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [accent, accentPurple],
  );

  // ── Box shadows ───────────────────────────────────────
  static List<BoxShadow> get glowBlueShadow => [
        const BoxShadow(
          color: glowBlue,
          blurRadius: 15,
          spreadRadius: 0,
        ),
      ];

  static List<BoxShadow> get glowPurpleShadow => [
        const BoxShadow(
          color: glowPurple,
          blurRadius: 15,
          spreadRadius: 0,
        ),
      ];

  static List<BoxShadow> get cardElevation => [
        const BoxShadow(
          color: Color(0x4D000000),
          blurRadius: 12,
          offset: Offset(0, 4),
        ),
      ];
}
