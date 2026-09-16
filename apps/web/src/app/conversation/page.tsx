import type { Metadata } from 'next';
import { IntakeDemo } from '@/features/conversation/IntakeDemo';

export const metadata: Metadata = {
  title: 'Braid conversation demo',
  description: 'Scripted web replay of recorded synthetic intake flows. Not a live phone call.',
};

export default function ConversationPage() {
  return <IntakeDemo />;
}
