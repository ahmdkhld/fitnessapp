'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { submitOnboarding, type OnboardingPayload } from './actions';

/* ---------- shared inline styles ---------- */

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: '2.5rem',
  maxWidth: 560,
  width: '100%',
};

const btn: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 15,
};

const btnOutline: React.CSSProperties = {
  ...btn,
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--fg)',
};

const input: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--fg)',
  width: '100%',
  fontSize: 14,
};

const label: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 14,
  color: 'var(--muted)',
};

const TOTAL_STEPS = 5;

/* ------------------------------------------------------------------ */
/*  Goal cards                                                         */
/* ------------------------------------------------------------------ */

const GOALS = [
  { id: 'fat_loss', label: 'Weight Loss', icon: '\uD83D\uDD25' },
  { id: 'muscle_gain', label: 'Muscle Gain', icon: '\uD83D\uDCAA' },
  { id: 'maintenance', label: 'Maintenance', icon: '\u2696\uFE0F' },
  { id: 'general_health', label: 'General Health', icon: '\u2764\uFE0F' },
] as const;

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
  { id: 'unspecified', label: 'Prefer not to say' },
] as const;

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary' },
  { id: 'light', label: 'Lightly active' },
  { id: 'moderate', label: 'Moderately active' },
  { id: 'active', label: 'Active' },
  { id: 'very_active', label: 'Very active' },
] as const;

/* ================================================================== */

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // form state
  const [goal, setGoal] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('unspecified');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [unitSystem, setUnitSystem] = useState('metric');
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [dailyWaterGoalMl, setDailyWaterGoalMl] = useState('2500');

  const canAdvance = (): boolean => {
    if (step === 2 && !goal) return false;
    return true;
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

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

  /* ---- progress bar ---- */
  const progress = (
    <div style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: i < step ? 'var(--accent)' : 'var(--border)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );

  /* ---- step indicator ---- */
  const stepLabel = (
    <div
      style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}
    >
      Step {step} of {TOTAL_STEPS}
    </div>
  );

  /* ---- navigation buttons ---- */
  const navButtons = (showBack: boolean, showNext: boolean, nextLabel = 'Next') => (
    <div
      style={{
        display: 'flex',
        justifyContent: showBack ? 'space-between' : 'flex-end',
        marginTop: '2rem',
      }}
    >
      {showBack && (
        <button type="button" style={btnOutline} onClick={back}>
          Back
        </button>
      )}
      {showNext && (
        <button
          type="button"
          style={{
            ...btn,
            opacity: canAdvance() ? 1 : 0.5,
            cursor: canAdvance() ? 'pointer' : 'not-allowed',
          }}
          disabled={!canAdvance()}
          onClick={next}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );

  /* ================================================================ */
  /*  Step 1: Welcome                                                  */
  /* ================================================================ */
  if (step === 1) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={card}>
          {progress}
          {stepLabel}
          <h1 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem' }}>
            Welcome to NutriTrack
          </h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Track your nutrition, workouts, and supplements all in one place.
            Let us set up your profile so we can personalize your experience.
            This takes about a minute.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" style={btn} onClick={next}>
              Get started
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Step 2: Goal selection                                           */
  /* ================================================================ */
  if (step === 2) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={card}>
          {progress}
          {stepLabel}
          <h2 style={{ margin: '0 0 0.5rem' }}>What is your main goal?</h2>
          <p style={{ color: 'var(--muted)', margin: '0 0 1.5rem', fontSize: 14 }}>
            This helps us tailor calorie targets and recommendations.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}
          >
            {GOALS.map((g) => {
              const selected = goal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 12,
                    border: selected
                      ? '2px solid var(--accent)'
                      : '1px solid var(--border)',
                    background: selected ? 'var(--accent-muted, rgba(46,125,92,0.1))' : 'var(--card)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    color: 'var(--fg)',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{g.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{g.label}</div>
                </button>
              );
            })}
          </div>
          {navButtons(true, true)}
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Step 3: Body stats                                               */
  /* ================================================================ */
  if (step === 3) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={card}>
          {progress}
          {stepLabel}
          <h2 style={{ margin: '0 0 0.5rem' }}>Your body stats</h2>
          <p style={{ color: 'var(--muted)', margin: '0 0 1.5rem', fontSize: 14 }}>
            Helps calculate calorie targets and track progress. All fields are
            optional.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={label}>
                Height ({unitSystem === 'metric' ? 'cm' : 'in'})
                <input
                  type="number"
                  style={input}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder={unitSystem === 'metric' ? '170' : '67'}
                />
              </label>
              <label style={label}>
                Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                <input
                  type="number"
                  style={input}
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder={unitSystem === 'metric' ? '70' : '154'}
                />
              </label>
            </div>
            <label style={label}>
              Date of birth
              <input
                type="date"
                style={input}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </label>
            <label style={label}>
              Gender
              <select
                style={input}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                {GENDERS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>
            <label style={label}>
              Activity level
              <select
                style={input}
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {navButtons(true, true)}
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Step 4: Preferences                                              */
  /* ================================================================ */
  if (step === 4) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={card}>
          {progress}
          {stepLabel}
          <h2 style={{ margin: '0 0 0.5rem' }}>Preferences</h2>
          <p style={{ color: 'var(--muted)', margin: '0 0 1.5rem', fontSize: 14 }}>
            Customize your experience.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={label}>
              Unit system
              <div style={{ display: 'flex', gap: 8 }}>
                {(['metric', 'imperial'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnitSystem(u)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: 8,
                      border:
                        unitSystem === u
                          ? '2px solid var(--accent)'
                          : '1px solid var(--border)',
                      background:
                        unitSystem === u
                          ? 'var(--accent-muted, rgba(46,125,92,0.1))'
                          : 'var(--card)',
                      color: 'var(--fg)',
                      cursor: 'pointer',
                      fontWeight: unitSystem === u ? 600 : 400,
                      textTransform: 'capitalize',
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </label>
            <label style={label}>
              Timezone
              <select
                style={input}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {Intl.supportedValuesOf('timeZone').map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label style={label}>
              Daily water goal (ml)
              <input
                type="number"
                style={input}
                value={dailyWaterGoalMl}
                onChange={(e) => setDailyWaterGoalMl(e.target.value)}
                min={500}
                max={10000}
                step={100}
              />
            </label>
          </div>
          {navButtons(true, true, 'Finish')}
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Step 5: Complete                                                 */
  /* ================================================================ */
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ ...card, textAlign: 'center' as const }}>
        {progress}
        {stepLabel}
        <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u2705'}</div>
        <h2 style={{ margin: '0 0 0.5rem' }}>You are all set!</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          Your profile has been configured. We will use your preferences to
          personalize calorie targets, water tracking, and progress insights.
        </p>
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#3a1f1f',
              border: '1px solid #6a2a2a',
              borderRadius: 8,
              marginBottom: '1rem',
              color: '#f87171',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button type="button" style={btnOutline} onClick={back}>
            Back
          </button>
          <button
            type="button"
            style={{
              ...btn,
              opacity: isPending ? 0.6 : 1,
            }}
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? 'Saving...' : 'Go to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
