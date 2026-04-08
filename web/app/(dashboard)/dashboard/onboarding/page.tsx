import { redirect } from 'next/navigation';
import { checkProfileExists } from './actions';
import { OnboardingWizard } from './OnboardingWizard';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const hasProfile = await checkProfileExists();
  if (hasProfile) {
    redirect('/dashboard');
  }

  return <OnboardingWizard />;
}
