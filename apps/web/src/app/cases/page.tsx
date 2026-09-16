import type { Metadata } from 'next';
import { CasesBoard } from '@/features/cases/CasesBoard';

export const metadata: Metadata = {
  title: 'Braid cases',
  description: 'Seeded FNOL case files for the Braid evidence reconciliation agent.',
};

export default function CasesPage() {
  return <CasesBoard />;
}
