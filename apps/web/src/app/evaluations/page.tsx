import type { Metadata } from 'next';
import { EvaluationsBoard } from '@/features/evaluations/EvaluationsBoard';

export const metadata: Metadata = {
  title: 'Braid evaluations',
  description: 'Multi-run Agent Testing results for intake, guardrails, and tool gates.',
};

export default function EvaluationsPage() {
  return <EvaluationsBoard />;
}
