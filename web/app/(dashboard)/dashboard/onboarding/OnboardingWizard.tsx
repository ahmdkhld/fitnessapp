'use client';

import { useState, useTransition } from 'react';
import { submitOnboarding, type OnboardingPayload } from './actions';

const TOTAL_STEPS = 5;

const GOALS = [
  { id: 'fat_loss', label: 'Fat loss' },
  { id: 'muscle_gain', label: 'Muscle gain' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'general_health', label: 'General health' },
] as const;

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
  { id: 'unspecified', label: 'Prefer not to say' },
] as const;

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary — desk job, little exercise' },
  { id: 'light', label: 'Lightly active — 1-3 sessions / week' },
  { id: 'moderate', label: 'Moderately active — 3-5 sessions / week' },
  { id: 'active', label: 'Active — 6-7 sessions / week' },
  { id: 'very_active', label: 'Very active — twice daily training' },
] as const;

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [goal, setGoal] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('unspecified');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [dailyWaterGoalMl, setDailyWaterGoalMl] = useState('2500');

  const canAdvance = (): boolean => {
    if (step === 2 && !goal) return false;
    return true;
  };

  const next = () => step < TOTAL_STEPS && setStep(step + 1);
  const back = () => step > 1 && setStep(step - 1);

  const handleSubmit = () => {
    setError(null);
    const payload: OnboardingPayload = {
      goal,
      heightCm: heightCm ? Number(heightCm) : null,
      weightKg: weightKg ? Number(weightKg) : null,
      dateOfBirth,
      gender,
      activityLevel,
      unitSystem,
      timezone,
      dailyWaterGoalMl: Number(dailyWaterGoalMl) || 2500,
    };
    startTransition(async () => {
      try {
        await submitOnboarding(payload);
      } catch (e) {
        setError((e as Error).message || 'Something went wrong. Please try again.');
      }
    });
  };

  const Progress = () => (
    <>
      <div className="onb-progress">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`onb-progress__seg${i < step ? ' onb-progress__seg--done' : ''}`}
          />
        ))}
      </div>
      <div className="onb-step-label">
        Step {step} of {TOTAL_STEPS}
      </div>
    </>
  );

  const Nav = ({
    showBack = true,
    nextLabel = 'Continue',
    onNext,
    disabled,
  }: {
    showBack?: boolean;
    nextLabel?: string;
    onNext: () => void;
    disabled?: boolean;
  }) => (
    <div className="onb-nav">
      {showBack && (
        <button type="button" className="onb-nav__back" onClick={back}>
          Back
        </button>
      )}
      <button
        type="button"
        className="onb-nav__next"
        onClick={onNext}
        disabled={disabled}
      >
        {nextLabel}
      </button>
    </div>
  );

  return (
    <div className="onb-shell">
      <div className="onb-card reveal">
        <Progress />

        {/* ── Step 1: Welcome ───────────────────────────── */}
        {step === 1 && (
          <>
            <h1 className="onb-title">Welcome to NutriTrack.</h1>
            <p className="onb-lede">
              We&apos;ll set up a profile so calorie targets, water goals, and weekly
              insights actually fit your routine. Five short questions, about a minute
              total. You can change all of this later in settings.
            </p>
            <Nav showBack={false} nextLabel="Let's begin" onNext={next} />
          </>
        )}

        {/* ── Step 2: Goal ──────────────────────────────── */}
        {step === 2 && (
          <>
            <h1 className="onb-title">What are you working on?</h1>
            <p className="onb-lede">
              Pick the goal that&apos;s most front of mind. We use this to bias your
              calorie targets and which insights surface on the dashboard.
            </p>
            <div className="onb-grid">
              {GOALS.map((g, i) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={`onb-choice${goal === g.id ? ' onb-choice--selected' : ''}`}
                >
                  <span className="onb-choice__num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="onb-choice__label">{g.label}</span>
                </button>
              ))}
            </div>
            <Nav onNext={next} disabled={!canAdvance()} />
          </>
        )}

        {/* ── Step 3: Body stats ────────────────────────── */}
        {step === 3 && (
          <>
            <h1 className="onb-title">Tell us about you.</h1>
            <p className="onb-lede">
              All of this is optional and editable. The more we know, the better the
              calorie targets — but you can skip anything you&apos;d rather not share.
            </p>
            <div className="onb-fields">
              <div className="onb-row">
                <div className="onb-field">
                  <label htmlFor="onb-height">
                    Height ({unitSystem === 'metric' ? 'cm' : 'in'})
                  </label>
                  <input
                    id="onb-height"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder={unitSystem === 'metric' ? '170' : '67'}
                  />
                </div>
                <div className="onb-field">
                  <label htmlFor="onb-weight">
                    Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    id="onb-weight"
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder={unitSystem === 'metric' ? '70' : '154'}
                  />
                </div>
              </div>
              <div className="onb-field">
                <label htmlFor="onb-dob">Date of birth</label>
                <input
                  id="onb-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div className="onb-field">
                <label htmlFor="onb-gender">Gender</label>
                <select
                  id="onb-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {GENDERS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="onb-field">
                <label htmlFor="onb-activity">Activity level</label>
                <select
                  id="onb-activity"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  {ACTIVITY_LEVELS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Nav onNext={next} />
          </>
        )}

        {/* ── Step 4: Preferences ───────────────────────── */}
        {step === 4 && (
          <>
            <h1 className="onb-title">A couple of preferences.</h1>
            <p className="onb-lede">
              Units, time zone, and your daily water target. We&apos;ll round
              everything off in the next step.
            </p>
            <div className="onb-fields">
              <div className="onb-field">
                <label>Unit system</label>
                <div className="onb-segmented">
                  {(['metric', 'imperial'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      className={unitSystem === u ? 'is-active' : ''}
                      onClick={() => setUnitSystem(u)}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div className="onb-field">
                <label htmlFor="onb-tz">Time zone</label>
                <select
                  id="onb-tz"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {Intl.supportedValuesOf('timeZone').map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="onb-field">
                <label htmlFor="onb-water">Daily water goal (ml)</label>
                <input
                  id="onb-water"
                  type="number"
                  value={dailyWaterGoalMl}
                  onChange={(e) => setDailyWaterGoalMl(e.target.value)}
                  min={500}
                  max={10000}
                  step={100}
                />
              </div>
            </div>
            <Nav nextLabel="Review" onNext={next} />
          </>
        )}

        {/* ── Step 5: Confirm ───────────────────────────── */}
        {step === 5 && (
          <>
            <h1 className="onb-title">All set.</h1>
            <p className="onb-lede">
              We&apos;ll save your profile and drop you into the dashboard. From
              there you can log meals, schedule workouts, and review your week.
            </p>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <div className="onb-nav">
              <button
                type="button"
                className="onb-nav__back"
                onClick={back}
                disabled={isPending}
              >
                Back
              </button>
              <button
                type="button"
                className="onb-nav__next"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? 'Saving…' : 'Open dashboard'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
