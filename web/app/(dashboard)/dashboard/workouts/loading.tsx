import { PageSkeleton } from '@/components/PageSkeleton';

export default function WorkoutsLoading() {
  return <PageSkeleton cards={3} rows={5} />;
}
