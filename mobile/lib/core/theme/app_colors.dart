import 'package:flutter/material.dart';

/// Design tokens matching the web UI's design system.
/// Dark values map to CSS custom properties in web/app/globals.css :root.
/// Light values map to the [data-theme="light"] / prefers-color-scheme override.
class AppColors {
  AppColors._();

  // ── Shared accents (same in both modes) ───────────────
  static const Color accent = Color(0xFF0000FF);
  static const Color accentPurple = Color(0xFFA020F0);
  static const Color accentGreen = Color(0xFF22C55E);
  static const Color danger = Color(0xFFEF4444);
  static const Color dangerMuted = Color(0xFFE07B5F);
  static const Color badgeAmber = Color(0xFFD8A24A);
  static const Color badgeCyan = Color(0xFF6AD1E0);

  // ── Dark palette ──────────────────────────────────────
  static const Color darkBg = Color(0xFF121212);
  static const Color darkFg = Color(0xFFFFFFFF);
  static const Color darkMuted = Color(0xFFA9A9A9);
  static const Color darkCard = Color(0xFF1E1E1E);
  static const Color darkBorder = Color(0xFF333333);
  static const Color darkGlassBg = Color(0x991E1E1E);

  // ── Light palette ─────────────────────────────────────
  static const Color lightBg = Color(0xFFF5F5F7);
  static const Color lightFg = Color(0xFF1A1A1A);
  static const Color lightMuted = Color(0xFF6B7280);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color lightBorder = Color(0xFFE0E0E0);
  static const Color lightGlassBg = Color(0xB3FFFFFF); // ~0.7 opacity

  // ── Convenience aliases (dark defaults for backward compat) ──
  static const Color bg = darkBg;
  static const Color fg = darkFg;
  static const Color muted = darkMuted;
  static const Color card = darkCard;
  static const Color border = darkBorder;
  static const Color glassBg = darkGlassBg;
  static const Color overlayBg = Color(0x99000000);

  // ── Glow / shadow helpers ─────────────────────────────
  static const Color glowBlue = Color(0x4D0000FF);
  static const Color glowPurple = Color(0x4DA020F0);
  static const Color glowBlueLight = Color(0x1F0000FF);
  static const Color glowPurpleLight = Color(0x1FA020F0);

  // ── Badge backgrounds (low-opacity tints) ─────────────
  static const Color badgeGreenBg = Color(0x2622C55E);
  static const Color badgeAmberBg = Color(0x26D8A24A);
  static const Color badgeCyanBg = Color(0x266AD1E0);
  static const Color badgePurpleBg = Color(0x26A020F0);
  static const Color badgeRedBg = Color(0x26EF4444);

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
        const BoxShadow(color: glowBlue, blurRadius: 15, spreadRadius: 0),
      ];

  static List<BoxShadow> get glowBlueShadowLight => [
        const BoxShadow(color: glowBlueLight, blurRadius: 15, spreadRadius: 0),
      ];

  static List<BoxShadow> get glowPurpleShadow => [
        const BoxShadow(color: glowPurple, blurRadius: 15, spreadRadius: 0),
      ];

  static List<BoxShadow> get cardElevation => [
        const BoxShadow(
          color: Color(0x4D000000),
          blurRadius: 12,
          offset: Offset(0, 4),
        ),
      ];

  static List<BoxShadow> get cardElevationLight => [
        const BoxShadow(
          color: Color(0x0F000000),
          blurRadius: 8,
          offset: Offset(0, 2),
        ),
      ];
}
