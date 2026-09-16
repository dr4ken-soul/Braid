import type { Metadata } from 'next';
import { CaseReview } from '@/features/cases/CaseReview';

export const metadata: Metadata = {
  title: 'Braid case review',
  description: 'Traceable case review: transcript, evidence, sources, contradictions, tool calls, and handoff.',
};

export default function CasePage({ params }: { params: { caseId: string } }) {
  return <CaseReview caseId={params.caseId} />;
}
