import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  AppTheme._();

  // ── Text themes ───────────────────────────────────────
  static TextTheme get _darkTextTheme =>
      GoogleFonts.interTextTheme(ThemeData.dark().textTheme);

  static TextTheme get _lightTextTheme =>
      GoogleFonts.interTextTheme(ThemeData.light().textTheme);

  // ── Dark color scheme ─────────────────────────────────
  static const ColorScheme _darkScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: AppColors.accent,
    onPrimary: AppColors.darkFg,
    secondary: AppColors.accentPurple,
    onSecondary: AppColors.darkFg,
    tertiary: AppColors.accentGreen,
    onTertiary: AppColors.darkFg,
    error: AppColors.danger,
    onError: AppColors.darkFg,
    surface: AppColors.darkCard,
    onSurface: AppColors.darkFg,
    onSurfaceVariant: AppColors.darkMuted,
    outline: AppColors.darkBorder,
    outlineVariant: AppColors.darkBorder,
    shadow: Colors.black,
    surfaceContainerHighest: AppColors.darkCard,
  );

  // ── Light color scheme ────────────────────────────────
  static const ColorScheme _lightScheme = ColorScheme(
    brightness: Brightness.light,
    primary: AppColors.accent,
    onPrimary: Colors.white,
    secondary: AppColors.accentPurple,
    onSecondary: Colors.white,
    tertiary: AppColors.accentGreen,
    onTertiary: Colors.white,
    error: AppColors.danger,
    onError: Colors.white,
    surface: AppColors.lightCard,
    onSurface: AppColors.lightFg,
    onSurfaceVariant: AppColors.lightMuted,
    outline: AppColors.lightBorder,
    outlineVariant: AppColors.lightBorder,
    shadow: Colors.black,
    surfaceContainerHighest: AppColors.lightCard,
  );

  // ════════════════════════════════════════════════════════
  //  DARK THEME
  // ════════════════════════════════════════════════════════
  static ThemeData get dark => _build(
        scheme: _darkScheme,
        textTheme: _darkTextTheme,
        scaffoldBg: AppColors.darkBg,
        cardColor: AppColors.darkCard,
        borderColor: AppColors.darkBorder,
        mutedColor: AppColors.darkMuted,
        fgColor: AppColors.darkFg,
        glassBg: AppColors.darkGlassBg,
        inputFillColor: AppColors.darkBg,
        systemOverlay: SystemUiOverlayStyle.light,
      );

  // ════════════════════════════════════════════════════════
  //  LIGHT THEME
  // ════════════════════════════════════════════════════════
  static ThemeData get light => _build(
        scheme: _lightScheme,
        textTheme: _lightTextTheme,
        scaffoldBg: AppColors.lightBg,
        cardColor: AppColors.lightCard,
        borderColor: AppColors.lightBorder,
        mutedColor: AppColors.lightMuted,
        fgColor: AppColors.lightFg,
        glassBg: AppColors.lightGlassBg,
        inputFillColor: AppColors.lightCard,
        systemOverlay: SystemUiOverlayStyle.dark,
      );

  // ════════════════════════════════════════════════════════
  //  Shared builder
  // ════════════════════════════════════════════════════════
  static ThemeData _build({
    required ColorScheme scheme,
    required TextTheme textTheme,
    required Color scaffoldBg,
    required Color cardColor,
    required Color borderColor,
    required Color mutedColor,
    required Color fgColor,
    required Color glassBg,
    required Color inputFillColor,
    required SystemUiOverlayStyle systemOverlay,
  }) {
    return ThemeData(
      useMaterial3: true,
      brightness: scheme.brightness,
      colorScheme: scheme,
      scaffoldBackgroundColor: scaffoldBg,
      textTheme: textTheme,

      // AppBar
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: glassBg,
        foregroundColor: fgColor,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: fgColor,
        ),
        iconTheme: IconThemeData(color: fgColor),
        systemOverlayStyle: systemOverlay,
      ),

      // Card
      cardTheme: CardThemeData(
        color: cardColor,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusMd),
          side: BorderSide(color: borderColor),
        ),
      ),

      // Dialogs
      dialogTheme: DialogThemeData(
        backgroundColor: cardColor,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusLg),
          side: BorderSide(color: borderColor),
        ),
        titleTextStyle: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: fgColor,
        ),
      ),

      // Inputs
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: inputFillColor,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusSm),
          borderSide: BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusSm),
          borderSide: BorderSide(color: borderColor),
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
        labelStyle: GoogleFonts.inter(color: mutedColor, fontSize: 14),
        hintStyle: GoogleFonts.inter(color: mutedColor, fontSize: 14),
        floatingLabelStyle: GoogleFonts.inter(
          color: AppColors.accent,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),

      // FilledButton
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.accent,
          foregroundColor: Colors.white,
          disabledBackgroundColor: AppColors.accent.withAlpha(100),
          disabledForegroundColor: Colors.white.withAlpha(150),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
          ),
          textStyle:
              GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 14),
        ),
      ),

      // ElevatedButton
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.accent,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
          ),
          textStyle:
              GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 14),
        ),
      ),

      // OutlinedButton
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: fgColor,
          side: BorderSide(color: borderColor),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppColors.radiusSm),
          ),
          textStyle:
              GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500),
        ),
      ),

      // TextButton
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.accent,
          textStyle:
              GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500),
        ),
      ),

      // ListTile
      listTileTheme: ListTileThemeData(
        iconColor: mutedColor,
        textColor: fgColor,
        subtitleTextStyle:
            GoogleFonts.inter(color: mutedColor, fontSize: 13),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusSm),
        ),
      ),

      // Chip
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
      dividerTheme: DividerThemeData(
        color: borderColor,
        thickness: 1,
        space: 1,
      ),

      // NavigationBar
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: glassBg,
        indicatorColor: AppColors.accent.withAlpha(40),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: AppColors.accent);
          }
          return IconThemeData(color: mutedColor);
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return GoogleFonts.inter(
              color: AppColors.accent,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            );
          }
          return GoogleFonts.inter(color: mutedColor, fontSize: 12);
        }),
        surfaceTintColor: Colors.transparent,
      ),

      // SnackBar
      snackBarTheme: SnackBarThemeData(
        backgroundColor: cardColor,
        contentTextStyle: GoogleFonts.inter(color: fgColor, fontSize: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusSm),
          side: BorderSide(color: borderColor),
        ),
        behavior: SnackBarBehavior.floating,
      ),

      // FAB
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.accent,
        foregroundColor: Colors.white,
        elevation: 4,
      ),

      // ProgressIndicator
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: AppColors.accent,
        linearTrackColor: borderColor,
        circularTrackColor: borderColor,
      ),

      // Slider
      sliderTheme: SliderThemeData(
        activeTrackColor: AppColors.accent,
        inactiveTrackColor: borderColor,
        thumbColor: AppColors.accent,
        overlayColor: AppColors.accent.withAlpha(40),
      ),

      // Switch
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return AppColors.accent;
          return mutedColor;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return AppColors.accent.withAlpha(80);
          }
          return borderColor;
        }),
      ),

      // Icon
      iconTheme: IconThemeData(color: mutedColor),

      // TabBar
      tabBarTheme: TabBarThemeData(
        labelColor: fgColor,
        unselectedLabelColor: mutedColor,
        indicatorColor: AppColors.accent,
        labelStyle:
            GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 14),
        unselectedLabelStyle: GoogleFonts.inter(fontSize: 14),
      ),

      // BottomSheet
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: cardColor,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius:
              const BorderRadius.vertical(top: Radius.circular(24)),
          side: BorderSide(color: borderColor),
        ),
      ),

      // PopupMenu
      popupMenuTheme: PopupMenuThemeData(
        color: cardColor,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radiusMd),
          side: BorderSide(color: borderColor),
        ),
      ),

      // DatePicker
      datePickerTheme: DatePickerThemeData(
        backgroundColor: cardColor,
        surfaceTintColor: Colors.transparent,
        headerBackgroundColor: AppColors.accent,
        headerForegroundColor: Colors.white,
        dayStyle: GoogleFonts.inter(),
      ),

      // TimePicker
      timePickerTheme: TimePickerThemeData(
        backgroundColor: cardColor,
        dialBackgroundColor: scaffoldBg,
        hourMinuteColor: scaffoldBg,
        dayPeriodColor: scaffoldBg,
        entryModeIconColor: mutedColor,
        hourMinuteTextStyle:
            GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.w600),
      ),

      // Tooltip
      tooltipTheme: TooltipThemeData(
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(AppColors.radiusSm),
          border: Border.all(color: borderColor),
        ),
        textStyle: GoogleFonts.inter(color: fgColor, fontSize: 12),
      ),
    );
  }
}
