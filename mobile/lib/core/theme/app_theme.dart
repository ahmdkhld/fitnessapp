import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  AppTheme._();

  // ── Text theme built from Inter ───────────────────────
  static TextTheme get _textTheme => GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme,
      );

  // ── Color scheme ──────────────────────────────────────
  static const ColorScheme _scheme = ColorScheme(
    brightness: Brightness.dark,
    primary: AppColors.accent,
    onPrimary: AppColors.fg,
    secondary: AppColors.accentPurple,
    onSecondary: AppColors.fg,
    tertiary: AppColors.accentGreen,
    onTertiary: AppColors.fg,
    error: AppColors.danger,
    onError: AppColors.fg,
    surface: AppColors.card,
    onSurface: AppColors.fg,
    onSurfaceVariant: AppColors.muted,
    outline: AppColors.border,
    outlineVariant: AppColors.border,
    shadow: Colors.black,
    surfaceContainerHighest: AppColors.card,
  );

  // ── Main dark theme (the only theme — always dark) ────
  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: _scheme,
        scaffoldBackgroundColor: AppColors.bg,
        textTheme: _textTheme,

        // AppBar: dark glass-like bar matching web .topnav
        appBarTheme: AppBarTheme(
          centerTitle: true,
          elevation: 0,
          scrolledUnderElevation: 0,
          backgroundColor: AppColors.glassBg,
          foregroundColor: AppColors.fg,
          surfaceTintColor: Colors.transparent,
          titleTextStyle: GoogleFonts.inter(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.fg,
          ),
          iconTheme: const IconThemeData(color: AppColors.fg),
          systemOverlayStyle: SystemUiOverlayStyle.light,
        ),

        // Card: dark card bg + border matching web .stat-card / .plan-card
        cardTheme: CardThemeData(
          color: AppColors.card,
          elevation: 0,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusMd),
            side: const BorderSide(color: AppColors.border),
          ),
        ),

        // Dialogs
        dialogTheme: DialogThemeData(
          backgroundColor: AppColors.card,
          surfaceTintColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusLg),
            side: const BorderSide(color: AppColors.border),
          ),
          titleTextStyle: GoogleFonts.inter(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.fg,
          ),
        ),

        // Inputs: dark bg, blue focus ring matching web .input-field
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.bg,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
            borderSide: const BorderSide(color: AppColors.accent, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
            borderSide: const BorderSide(color: AppColors.danger),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
            borderSide: const BorderSide(color: AppColors.danger, width: 2),
          ),
          labelStyle: GoogleFonts.inter(
            color: AppColors.muted,
            fontSize: 14,
          ),
          hintStyle: GoogleFonts.inter(
            color: AppColors.muted,
            fontSize: 14,
          ),
          floatingLabelStyle: GoogleFonts.inter(
            color: AppColors.accent,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),

        // FilledButton: blue primary with glow matching web .btn-primary
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            backgroundColor: AppColors.accent,
            foregroundColor: AppColors.fg,
            disabledBackgroundColor: AppColors.accent.withAlpha(100),
            disabledForegroundColor: AppColors.fg.withAlpha(150),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppColors.radiusSm),
            ),
            textStyle: GoogleFonts.inter(
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ),

        // ElevatedButton: same blue primary
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.accent,
            foregroundColor: AppColors.fg,
            elevation: 0,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppColors.radiusSm),
            ),
            textStyle: GoogleFonts.inter(
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ),

        // OutlinedButton: transparent + border matching web .btn-outline
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.fg,
            side: const BorderSide(color: AppColors.border),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppColors.radiusSm),
            ),
            textStyle: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),

        // TextButton: accent color
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: AppColors.accent,
            textStyle: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),

        // ListTile
        listTileTheme: ListTileThemeData(
          iconColor: AppColors.muted,
          textColor: AppColors.fg,
          subtitleTextStyle: GoogleFonts.inter(
            color: AppColors.muted,
            fontSize: 13,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
          ),
        ),

        // Chip: dark with border
        chipTheme: ChipThemeData(
          backgroundColor: AppColors.badgeGreenBg,
          labelStyle: GoogleFonts.inter(
            color: AppColors.accentGreen,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
          side: BorderSide(color: AppColors.accentGreen.withAlpha(77)),
          shape: const StadiumBorder(),
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        ),

        // Divider
        dividerTheme: const DividerThemeData(
          color: AppColors.border,
          thickness: 1,
          space: 1,
        ),

        // BottomNavigationBar / NavigationBar
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: AppColors.glassBg,
          indicatorColor: AppColors.accent.withAlpha(40),
          iconTheme: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return const IconThemeData(color: AppColors.accent);
            }
            return const IconThemeData(color: AppColors.muted);
          }),
          labelTextStyle: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return GoogleFonts.inter(
                color: AppColors.accent,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              );
            }
            return GoogleFonts.inter(
              color: AppColors.muted,
              fontSize: 12,
            );
          }),
          surfaceTintColor: Colors.transparent,
        ),

        // SnackBar
        snackBarTheme: SnackBarThemeData(
          backgroundColor: AppColors.card,
          contentTextStyle: GoogleFonts.inter(
            color: AppColors.fg,
            fontSize: 14,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
            side: const BorderSide(color: AppColors.border),
          ),
          behavior: SnackBarBehavior.floating,
        ),

        // FloatingActionButton
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: AppColors.accent,
          foregroundColor: AppColors.fg,
          elevation: 4,
        ),

        // ProgressIndicator: accent blue
        progressIndicatorTheme: const ProgressIndicatorThemeData(
          color: AppColors.accent,
          linearTrackColor: AppColors.border,
          circularTrackColor: AppColors.border,
        ),

        // Slider
        sliderTheme: SliderThemeData(
          activeTrackColor: AppColors.accent,
          inactiveTrackColor: AppColors.border,
          thumbColor: AppColors.accent,
          overlayColor: AppColors.accent.withAlpha(40),
        ),

        // Switch
        switchTheme: SwitchThemeData(
          thumbColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return AppColors.accent;
            }
            return AppColors.muted;
          }),
          trackColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return AppColors.accent.withAlpha(80);
            }
            return AppColors.border;
          }),
        ),

        // Icon default color
        iconTheme: const IconThemeData(color: AppColors.muted),

        // Tab bar
        tabBarTheme: TabBarThemeData(
          labelColor: AppColors.fg,
          unselectedLabelColor: AppColors.muted,
          indicatorColor: AppColors.accent,
          labelStyle: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 14),
          unselectedLabelStyle: GoogleFonts.inter(fontSize: 14),
        ),

        // Bottom sheet
        bottomSheetTheme: const BottomSheetThemeData(
          backgroundColor: AppColors.card,
          surfaceTintColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            side: BorderSide(color: AppColors.border),
          ),
        ),

        // Popup menu
        popupMenuTheme: PopupMenuThemeData(
          color: AppColors.card,
          surfaceTintColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusMd),
            side: const BorderSide(color: AppColors.border),
          ),
        ),

        // Date picker
        datePickerTheme: DatePickerThemeData(
          backgroundColor: AppColors.card,
          surfaceTintColor: Colors.transparent,
          headerBackgroundColor: AppColors.accent,
          headerForegroundColor: AppColors.fg,
          dayStyle: GoogleFonts.inter(),
        ),

        // Time picker
        timePickerTheme: TimePickerThemeData(
          backgroundColor: AppColors.card,
          dialBackgroundColor: AppColors.bg,
          hourMinuteColor: AppColors.bg,
          dayPeriodColor: AppColors.bg,
          entryModeIconColor: AppColors.muted,
          hourMinuteTextStyle: GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.w600),
        ),

        // Tooltip
        tooltipTheme: TooltipThemeData(
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
            border: Border.all(color: AppColors.border),
          ),
          textStyle: GoogleFonts.inter(color: AppColors.fg, fontSize: 12),
        ),
      );

  // ── Keep light as an alias that just returns dark ─────
  // The app is always dark to match the web UI aesthetic.
  static ThemeData get light => dark;
}
