import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en')
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'NutriTrack'**
  String get appTitle;

  /// No description provided for @welcomeHeadline.
  ///
  /// In en, this message translates to:
  /// **'Welcome to NutriTrack'**
  String get welcomeHeadline;

  /// No description provided for @welcomeBody.
  ///
  /// In en, this message translates to:
  /// **'Stick to your diet and supplements with daily timelines, reminders and adherence insights.'**
  String get welcomeBody;

  /// No description provided for @getStarted.
  ///
  /// In en, this message translates to:
  /// **'Get started'**
  String get getStarted;

  /// No description provided for @alreadyHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'I already have an account'**
  String get alreadyHaveAccount;

  /// No description provided for @signIn.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get signIn;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @goalHeadline.
  ///
  /// In en, this message translates to:
  /// **'What are you working towards?'**
  String get goalHeadline;

  /// No description provided for @goalFatLoss.
  ///
  /// In en, this message translates to:
  /// **'Fat loss'**
  String get goalFatLoss;

  /// No description provided for @goalMuscleGain.
  ///
  /// In en, this message translates to:
  /// **'Muscle gain'**
  String get goalMuscleGain;

  /// No description provided for @goalGeneralHealth.
  ///
  /// In en, this message translates to:
  /// **'General health'**
  String get goalGeneralHealth;

  /// No description provided for @goalPerformance.
  ///
  /// In en, this message translates to:
  /// **'Athletic performance'**
  String get goalPerformance;

  /// No description provided for @continueLabel.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get continueLabel;

  /// No description provided for @timelineTitle.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get timelineTitle;

  /// No description provided for @dashboardTitle.
  ///
  /// In en, this message translates to:
  /// **'Progress'**
  String get dashboardTitle;

  /// No description provided for @settingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsTitle;

  /// No description provided for @dietPlans.
  ///
  /// In en, this message translates to:
  /// **'Diet plans'**
  String get dietPlans;

  /// No description provided for @supplements.
  ///
  /// In en, this message translates to:
  /// **'Supplements'**
  String get supplements;

  /// No description provided for @waterTracker.
  ///
  /// In en, this message translates to:
  /// **'Water'**
  String get waterTracker;

  /// No description provided for @bodyLog.
  ///
  /// In en, this message translates to:
  /// **'Body log'**
  String get bodyLog;

  /// No description provided for @notifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notifications;

  /// No description provided for @importPlan.
  ///
  /// In en, this message translates to:
  /// **'Import plan'**
  String get importPlan;

  /// No description provided for @signOut.
  ///
  /// In en, this message translates to:
  /// **'Sign out'**
  String get signOut;

  /// No description provided for @noItemsToday.
  ///
  /// In en, this message translates to:
  /// **'Nothing scheduled today.'**
  String get noItemsToday;

  /// No description provided for @adherenceWeek.
  ///
  /// In en, this message translates to:
  /// **'Weekly adherence'**
  String get adherenceWeek;

  /// No description provided for @currentStreak.
  ///
  /// In en, this message translates to:
  /// **'Current streak'**
  String get currentStreak;

  /// No description provided for @insights.
  ///
  /// In en, this message translates to:
  /// **'Insights'**
  String get insights;

  /// No description provided for @mealReminder.
  ///
  /// In en, this message translates to:
  /// **'Meal reminders'**
  String get mealReminder;

  /// No description provided for @supplementReminder.
  ///
  /// In en, this message translates to:
  /// **'Supplement reminders'**
  String get supplementReminder;

  /// No description provided for @waterReminder.
  ///
  /// In en, this message translates to:
  /// **'Water reminders'**
  String get waterReminder;

  /// No description provided for @overdueAlerts.
  ///
  /// In en, this message translates to:
  /// **'Overdue alerts'**
  String get overdueAlerts;

  /// No description provided for @advanceNotice.
  ///
  /// In en, this message translates to:
  /// **'Advance notice'**
  String get advanceNotice;

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @create.
  ///
  /// In en, this message translates to:
  /// **'Create'**
  String get create;

  /// No description provided for @delete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get delete;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @workoutsTab.
  ///
  /// In en, this message translates to:
  /// **'Workouts'**
  String get workoutsTab;

  /// No description provided for @workoutsToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get workoutsToday;

  /// No description provided for @workoutPlans.
  ///
  /// In en, this message translates to:
  /// **'Plans'**
  String get workoutPlans;

  /// No description provided for @workoutTemplates.
  ///
  /// In en, this message translates to:
  /// **'Templates'**
  String get workoutTemplates;

  /// No description provided for @workoutHistory.
  ///
  /// In en, this message translates to:
  /// **'History'**
  String get workoutHistory;

  /// No description provided for @workoutLibrary.
  ///
  /// In en, this message translates to:
  /// **'Exercise library'**
  String get workoutLibrary;

  /// No description provided for @workoutAnalyticsTitle.
  ///
  /// In en, this message translates to:
  /// **'Workout analytics'**
  String get workoutAnalyticsTitle;

  /// No description provided for @startWorkout.
  ///
  /// In en, this message translates to:
  /// **'Start'**
  String get startWorkout;

  /// No description provided for @finishWorkout.
  ///
  /// In en, this message translates to:
  /// **'Finish'**
  String get finishWorkout;

  /// No description provided for @restTimer.
  ///
  /// In en, this message translates to:
  /// **'Rest'**
  String get restTimer;

  /// No description provided for @skipRest.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get skipRest;

  /// No description provided for @logSet.
  ///
  /// In en, this message translates to:
  /// **'Log set'**
  String get logSet;

  /// No description provided for @exercises.
  ///
  /// In en, this message translates to:
  /// **'Exercises'**
  String get exercises;

  /// No description provided for @sets.
  ///
  /// In en, this message translates to:
  /// **'Sets'**
  String get sets;

  /// No description provided for @reps.
  ///
  /// In en, this message translates to:
  /// **'Reps'**
  String get reps;

  /// No description provided for @weight.
  ///
  /// In en, this message translates to:
  /// **'Weight'**
  String get weight;

  /// No description provided for @rpe.
  ///
  /// In en, this message translates to:
  /// **'RPE'**
  String get rpe;

  /// No description provided for @restDay.
  ///
  /// In en, this message translates to:
  /// **'Rest day'**
  String get restDay;

  /// No description provided for @pickPlanPrompt.
  ///
  /// In en, this message translates to:
  /// **'Pick a plan to get started'**
  String get pickPlanPrompt;

  /// No description provided for @browseTemplates.
  ///
  /// In en, this message translates to:
  /// **'Browse templates'**
  String get browseTemplates;

  /// No description provided for @useThisPlan.
  ///
  /// In en, this message translates to:
  /// **'Use this plan'**
  String get useThisPlan;

  /// No description provided for @personalRecords.
  ///
  /// In en, this message translates to:
  /// **'Personal records'**
  String get personalRecords;

  /// No description provided for @noPrsYet.
  ///
  /// In en, this message translates to:
  /// **'Keep logging — PRs will show up here.'**
  String get noPrsYet;

  /// No description provided for @weeklyVolume.
  ///
  /// In en, this message translates to:
  /// **'Weekly volume'**
  String get weeklyVolume;

  /// No description provided for @estimated1rm.
  ///
  /// In en, this message translates to:
  /// **'Estimated 1RM'**
  String get estimated1rm;

  /// No description provided for @customExercise.
  ///
  /// In en, this message translates to:
  /// **'Custom'**
  String get customExercise;

  /// No description provided for @createCustom.
  ///
  /// In en, this message translates to:
  /// **'Create custom exercise'**
  String get createCustom;

  /// No description provided for @newBodyLog.
  ///
  /// In en, this message translates to:
  /// **'New body log'**
  String get newBodyLog;

  /// No description provided for @weightKg.
  ///
  /// In en, this message translates to:
  /// **'Weight (kg)'**
  String get weightKg;

  /// No description provided for @waistCm.
  ///
  /// In en, this message translates to:
  /// **'Waist (cm)'**
  String get waistCm;

  /// No description provided for @bodyFatPct.
  ///
  /// In en, this message translates to:
  /// **'Body fat %'**
  String get bodyFatPct;

  /// No description provided for @energyLevel.
  ///
  /// In en, this message translates to:
  /// **'Energy'**
  String get energyLevel;

  /// No description provided for @notesField.
  ///
  /// In en, this message translates to:
  /// **'Notes'**
  String get notesField;

  /// No description provided for @camera.
  ///
  /// In en, this message translates to:
  /// **'Camera'**
  String get camera;

  /// No description provided for @gallery.
  ///
  /// In en, this message translates to:
  /// **'Gallery'**
  String get gallery;

  /// No description provided for @todayWaterTitle.
  ///
  /// In en, this message translates to:
  /// **'Water'**
  String get todayWaterTitle;

  /// No description provided for @addAmount.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get addAmount;

  /// No description provided for @diet.
  ///
  /// In en, this message translates to:
  /// **'Diet plans'**
  String get diet;

  /// No description provided for @supplementPlans.
  ///
  /// In en, this message translates to:
  /// **'Supplement plans'**
  String get supplementPlans;

  /// No description provided for @logoutConfirmTitle.
  ///
  /// In en, this message translates to:
  /// **'Sign out?'**
  String get logoutConfirmTitle;

  /// No description provided for @logoutConfirmBody.
  ///
  /// In en, this message translates to:
  /// **'You\'ll need to sign in again next time.'**
  String get logoutConfirmBody;

  /// No description provided for @profileTitle.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profileTitle;

  /// No description provided for @profileAccountSection.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get profileAccountSection;

  /// No description provided for @profileBodySection.
  ///
  /// In en, this message translates to:
  /// **'Body profile'**
  String get profileBodySection;

  /// No description provided for @profileFullName.
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get profileFullName;

  /// No description provided for @profileGoal.
  ///
  /// In en, this message translates to:
  /// **'Goal'**
  String get profileGoal;

  /// No description provided for @profileUnitSystem.
  ///
  /// In en, this message translates to:
  /// **'Unit system'**
  String get profileUnitSystem;

  /// No description provided for @profileHeight.
  ///
  /// In en, this message translates to:
  /// **'Height (cm)'**
  String get profileHeight;

  /// No description provided for @profileDateOfBirth.
  ///
  /// In en, this message translates to:
  /// **'Date of birth'**
  String get profileDateOfBirth;

  /// No description provided for @profileGender.
  ///
  /// In en, this message translates to:
  /// **'Gender'**
  String get profileGender;

  /// No description provided for @profileActivityLevel.
  ///
  /// In en, this message translates to:
  /// **'Activity level'**
  String get profileActivityLevel;

  /// No description provided for @profileWaterGoal.
  ///
  /// In en, this message translates to:
  /// **'Daily water goal (ml)'**
  String get profileWaterGoal;

  /// No description provided for @profileSaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Save account'**
  String get profileSaveAccount;

  /// No description provided for @profileSaveBody.
  ///
  /// In en, this message translates to:
  /// **'Save profile'**
  String get profileSaveBody;

  /// No description provided for @coachReportTitle.
  ///
  /// In en, this message translates to:
  /// **'Coach Report'**
  String get coachReportTitle;

  /// No description provided for @coachReportSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Generate a report to share with your coach'**
  String get coachReportSubtitle;

  /// No description provided for @coachReportDateRange.
  ///
  /// In en, this message translates to:
  /// **'Date range'**
  String get coachReportDateRange;

  /// No description provided for @coachReportGenerate.
  ///
  /// In en, this message translates to:
  /// **'Generate Report'**
  String get coachReportGenerate;

  /// No description provided for @coachReportSummary.
  ///
  /// In en, this message translates to:
  /// **'Summary'**
  String get coachReportSummary;

  /// No description provided for @coachReportAdherence.
  ///
  /// In en, this message translates to:
  /// **'Adherence'**
  String get coachReportAdherence;

  /// No description provided for @coachReportItemsCompleted.
  ///
  /// In en, this message translates to:
  /// **'items completed'**
  String get coachReportItemsCompleted;

  /// No description provided for @coachReportWorkouts.
  ///
  /// In en, this message translates to:
  /// **'Workouts'**
  String get coachReportWorkouts;

  /// No description provided for @coachReportSessions.
  ///
  /// In en, this message translates to:
  /// **'sessions'**
  String get coachReportSessions;

  /// No description provided for @coachReportMinutes.
  ///
  /// In en, this message translates to:
  /// **'minutes'**
  String get coachReportMinutes;

  /// No description provided for @coachReportDownloadPdf.
  ///
  /// In en, this message translates to:
  /// **'Download PDF'**
  String get coachReportDownloadPdf;

  /// No description provided for @coachReportPdfError.
  ///
  /// In en, this message translates to:
  /// **'Could not download PDF'**
  String get coachReportPdfError;

  /// No description provided for @changePasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Change password'**
  String get changePasswordTitle;

  /// No description provided for @changePasswordSubtitle.
  ///
  /// In en, this message translates to:
  /// **'After changing your password you will be signed out and need to log in again.'**
  String get changePasswordSubtitle;

  /// No description provided for @changePasswordCurrent.
  ///
  /// In en, this message translates to:
  /// **'Current password'**
  String get changePasswordCurrent;

  /// No description provided for @changePasswordNew.
  ///
  /// In en, this message translates to:
  /// **'New password'**
  String get changePasswordNew;

  /// No description provided for @changePasswordConfirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm new password'**
  String get changePasswordConfirm;

  /// No description provided for @changePasswordMinLength.
  ///
  /// In en, this message translates to:
  /// **'Must be at least 8 characters'**
  String get changePasswordMinLength;

  /// No description provided for @changePasswordMismatch.
  ///
  /// In en, this message translates to:
  /// **'Passwords do not match'**
  String get changePasswordMismatch;

  /// No description provided for @changePasswordRequired.
  ///
  /// In en, this message translates to:
  /// **'This field is required'**
  String get changePasswordRequired;

  /// No description provided for @changePasswordSubmit.
  ///
  /// In en, this message translates to:
  /// **'Change password'**
  String get changePasswordSubmit;

  /// No description provided for @changePasswordSuccess.
  ///
  /// In en, this message translates to:
  /// **'Password changed successfully'**
  String get changePasswordSuccess;

  /// No description provided for @changePasswordWrongCurrent.
  ///
  /// In en, this message translates to:
  /// **'Current password is incorrect'**
  String get changePasswordWrongCurrent;

  /// No description provided for @changePasswordError.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. Please try again.'**
  String get changePasswordError;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'en':
      return AppLocalizationsEn();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
