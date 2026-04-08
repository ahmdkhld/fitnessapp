import { PageSkeleton } from '@/components/PageSkeleton';

export default function DietPlansLoading() {
  return <PageSkeleton cards={2} rows={4} />;
}
