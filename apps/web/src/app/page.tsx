import { GridAndNoise } from '@/components/ui/GridAndNoise';
import { Footer } from '@/components/ui/Footer';
import { Hero, HERO_MOTION_NOTE } from '@/components/hero/Hero';
import { WorkflowBreak } from '@/components/sections/WorkflowBreak';
import { CaseIntake } from '@/components/sections/CaseIntake';
import { EvidenceBraid } from '@/components/sections/EvidenceBraid';
import { ContradictionDesk } from '@/components/sections/ContradictionDesk';
import { HumanHandoff } from '@/components/sections/HumanHandoff';
import { AuditExplorer } from '@/components/sections/AuditExplorer';
import { InstitutionalIntegration } from '@/components/sections/InstitutionalIntegration';
import { ClosingAction } from '@/components/sections/ClosingAction';

const MOTION_NOTE_STYLES =
  'mx-auto w-full max-w-[1440px] px-5 pt-6 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)] sm:px-8 lg:px-12 xl:px-16';

/**
 * Landing page. One relative wrapper carries the page z layers: the grid and
 * noise at z-10, every section at z-20, nav at z-50. Assembly order follows
 * FRONTEND_SPEC.md sections 10 through 21.
 */
export default function LandingPage() {
  return (
    <>
      <div className="relative">
        <GridAndNoise />
        <Hero />
      </div>
      <p className={MOTION_NOTE_STYLES}>{HERO_MOTION_NOTE}</p>
      <WorkflowBreak />
      <CaseIntake />
      <EvidenceBraid />
      <ContradictionDesk />
      <HumanHandoff />
      <AuditExplorer />
      <InstitutionalIntegration />
      <ClosingAction />
      <Footer />
    </>
  );
}
