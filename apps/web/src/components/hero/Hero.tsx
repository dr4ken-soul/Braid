'use client';

/**
 * Hero: split-screen evidence braid with a GSAP pinned, scrubbed sequence.
 *
 * Progress states from FRONTEND_SPEC.md section 11:
 *   0.00 to 0.32  voice record      transcript visible, evidence dimmed, rail hidden
 *   0.32 to 0.62  evidence braid    facts translate from left, blur lifts, rail draws
 *   0.62 to 0.84  contradiction     marker scales in and escalates to the error tone
 *   0.84 to 1.00  handoff ready     adjuster packet panel rises into place
 *
 * The sequence reverses on upward scroll and restarts on re-entry (never a
 * one-way play configuration). Reduced motion, touch, and screens below
 * 1024px receive a flat stacked layout instead, with every state visible as
 * a real panel. The pointer tilt applies only to the evidence frame.
 */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePointerParallax } from '@/hooks/usePointerParallax';
import { sourceReferenceLabel } from '@/lib/format';

const EYEBROW =
  'mb-8 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]';

const HEADLINE =
  'max-w-[8ch] font-display text-[clamp(3.5rem,9vw,9rem)] font-bold leading-[0.84] tracking-[-0.045em] text-[var(--text-primary)]';

const HERO_BODY =
  'mt-8 max-w-[28rem] font-display text-xl leading-[1.12] text-[var(--text-secondary)] sm:text-2xl';

const METADATA_ROW =
  'mt-auto grid grid-cols-2 gap-px border border-[var(--border-default)] bg-[var(--border-default)]';

const METADATA_CELL = 'bg-[var(--bg-surface)] p-4';

const METADATA_LABEL =
  'font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const METADATA_VALUE = 'mt-2 font-mono text-xs font-medium text-[var(--text-primary)]';

const HERO_ACTION =
  'mt-6 inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-[var(--accent)] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]';

const HERO_GRID =
  'relative z-20 mx-auto grid min-h-[100svh] w-full max-w-[1440px] grid-cols-1 gap-px bg-[var(--border-default)] px-5 pb-8 pt-28 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:pt-32 xl:px-16';

const CLAIM_COLUMN =
  'relative z-20 flex min-h-[34rem] flex-col justify-between bg-[var(--bg-primary)] p-6 sm:p-10 lg:min-h-[calc(100svh-8rem)] lg:p-12';

const EVIDENCE_FRAME_OUTER =
  'relative z-20 min-h-[38rem] overflow-hidden bg-[var(--bg-secondary)] p-3 sm:min-h-[48rem] lg:min-h-[calc(100svh-8rem)] lg:p-5';

const FRAME_BORDER =
  'relative h-full min-h-[36rem] overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 sm:min-h-[44rem] sm:p-5';

const TRANSCRIPT_PANEL_PINNED =
  'absolute left-4 top-4 z-40 w-[min(19rem,calc(100%-2rem))] border border-[var(--border-default)] bg-[color:var(--bg-primary)/0.94] p-4 shadow-[var(--shadow-md)] backdrop-blur-sm sm:left-8 sm:top-8';

const TRANSCRIPT_PANEL_STACKED =
  'relative border border-[var(--border-default)] bg-[color:var(--bg-primary)/0.94] p-4';

const EVIDENCE_PANEL_PINNED =
  'absolute bottom-4 right-4 z-40 w-[min(23rem,calc(100%-2rem))] border border-[var(--border-default)] bg-[color:var(--bg-elevated)/0.96] p-4 shadow-[var(--shadow-md)] backdrop-blur-sm sm:bottom-8 sm:right-8';

const EVIDENCE_PANEL_STACKED =
  'relative border border-[var(--border-default)] bg-[color:var(--bg-elevated)/0.96] p-4';

const ADJUSTER_PANEL_PINNED =
  'absolute bottom-4 left-4 z-40 w-[min(21rem,calc(100%-2rem))] border border-[var(--border-default)] bg-[color:var(--bg-elevated)/0.96] p-4 shadow-[var(--shadow-md)] backdrop-blur-sm sm:bottom-8 sm:left-8';

const ADJUSTER_PANEL_STACKED =
  'relative border border-[var(--border-default)] bg-[color:var(--bg-elevated)/0.96] p-4';

const PANEL_HEADER =
  'mb-3 flex items-center justify-between font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]';

const EVIDENCE_ROW =
  'grid gap-1 border-b border-[var(--border-subtle)] pb-3 pt-3 first:pt-0 last:border-b-0 last:pb-0';

const MONO_VALUE = 'font-mono text-[0.8125rem] font-medium leading-[1.35] text-[var(--text-primary)]';

const MONO_MUTED = 'font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-muted)]';

const HERO_EVIDENCE_ROWS = [
  { label: 'Incident date', value: '30 August 2026', reference: 'segment:9' },
  { label: 'Location', value: 'Al Reem Street near the corniche', reference: 'segment:6' },
  { label: 'Vehicle plate', value: 'Abu Dhabi 12345', reference: 'segment:6' },
  { label: 'Damage', value: 'Rear bumper cracked, boot misaligned', reference: 'segment:7' },
];

const METADATA_CELLS = [
  { label: 'Reference', value: 'FNOL-2026-0142' },
  { label: 'Languages', value: 'English, Arabic' },
  { label: 'Records', value: 'Claim, policy, repair' },
  { label: 'Decides', value: 'Nothing, humans do' },
];

export function Hero() {
  const regionRef = useRef<HTMLDivElement>(null);
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const transcriptPanelRef = useRef<HTMLDivElement>(null);
  const evidencePanelRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const adjusterPanelRef = useRef<HTMLDivElement>(null);
  const parallaxFrameRef = usePointerParallax<HTMLDivElement>();

  const [stacked, setStacked] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    const update = () => setStacked(!media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const region = regionRef.current;
    const pinnedFrame = stickyFrameRef.current;
    if (stacked || !region || !pinnedFrame) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const railPaths = region.querySelectorAll<SVGPathElement>('[data-rail-path]');
      railPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(evidencePanelRef.current, { opacity: 0.35, filter: 'blur(8px)', y: 24 });
      gsap.set('[data-hero-evidence-row]', { x: -64 });
      gsap.set(markerRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(adjusterPanelRef.current, { opacity: 0, y: 24 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: region,
          start: 'top top',
          end: '+=180%',
          scrub: 0.7,
          pin: pinnedFrame,
          pinSpacing: true,
          toggleActions: 'restart none none reset',
        },
      });

      timeline
        .to('[data-hero-evidence-row]', { x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, 0.32)
        .to(
          evidencePanelRef.current,
          { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.18, ease: 'power2.out' },
          0.32,
        )
        .to(railPaths, { strokeDashoffset: 0, duration: 0.25, stagger: 0.04, ease: 'power2.inOut' }, 0.36)
        .to(markerRef.current, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.inOut' }, 0.62)
        .to('[data-marker-alert]', { opacity: 1, duration: 0.12, ease: 'none' }, 0.64)
        .to(adjusterPanelRef.current, { opacity: 1, y: 0, duration: 0.16, ease: 'power3.out' }, 0.84);
    }, region);

    return () => {
      context.revert();
    };
  }, [stacked]);

  return (
    <section
      aria-label="Split screen evidence braid hero"
      className="relative isolate border-b border-[var(--border-default)]"
    >
      <div ref={regionRef} className={stacked ? 'relative' : 'relative min-h-[220vh]'}>
        <div
          ref={stickyFrameRef}
          className={stacked ? 'relative z-20 flex min-h-[100svh] items-center' : 'sticky top-0 z-20 flex min-h-screen items-center'}
        >
          <div className={HERO_GRID}>
            <article className={CLAIM_COLUMN}>
              <div>
                <p className={EYEBROW}>Claims evidence reconciliation</p>
                <h1 className={HEADLINE}>Hear the claim. See the sources.</h1>
                <p className={HERO_BODY}>
                  Braid turns a multilingual insurance claim call into a source linked evidence
                  packet. Facts keep the words they came from, records confirm them, and anything
                  unresolved goes to a human adjuster. Braid never decides the outcome.
                </p>
                <Link href="/conversation" className={HERO_ACTION}>
                  Open a case
                </Link>
              </div>
              <div className={METADATA_ROW}>
                {METADATA_CELLS.map((cell) => (
                  <div key={cell.label} className={METADATA_CELL}>
                    <p className={METADATA_LABEL}>{cell.label}</p>
                    <p className={METADATA_VALUE}>{cell.value}</p>
                  </div>
                ))}
              </div>
            </article>

            <div className={EVIDENCE_FRAME_OUTER}>
              <div className="relative h-full [perspective:1200px]">
                <div
                  ref={parallaxFrameRef}
                  className="relative h-full transform-gpu will-change-transform"
                >
                  <div className={`${FRAME_BORDER} [transform-style:preserve-3d]`}>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 1200 900"
                      preserveAspectRatio="none"
                      fill="none"
                      className={stacked ? 'hidden' : 'absolute inset-0 z-30 h-full w-full'}
                    >
                      <path
                        data-rail-path
                        d="M600 0 L600 900"
                        stroke="var(--accent)"
                        strokeOpacity="0.42"
                        strokeWidth="1.5"
                      />
                      <path
                        data-rail-path
                        d="M600 260 L870 260"
                        stroke="var(--accent)"
                        strokeOpacity="0.42"
                        strokeWidth="1.5"
                      />
                      <path
                        data-rail-path
                        d="M600 470 L280 470"
                        stroke="var(--accent)"
                        strokeOpacity="0.42"
                        strokeWidth="1.5"
                      />
                      <path
                        data-rail-path
                        d="M600 680 L940 680"
                        stroke="var(--accent)"
                        strokeOpacity="0.42"
                        strokeWidth="1.5"
                      />
                    </svg>

                    <div
                      ref={transcriptPanelRef}
                      className={stacked ? TRANSCRIPT_PANEL_STACKED : TRANSCRIPT_PANEL_PINNED}
                    >
                      <div className={stacked ? '' : 'relative [transform:translateZ(8px)]'}>
                        <div className={PANEL_HEADER}>
                          <span>Transcript</span>
                          <span>00:38</span>
                        </div>
                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--accent)]">
                          Claimant
                        </p>
                        <p className={`${MONO_VALUE} mt-2`}>
                          The rear bumper is cracked and the boot does not close properly.
                        </p>
                        <p className={`${MONO_MUTED} mt-2`}>
                          source: {sourceReferenceLabel('segment:7')}
                        </p>
                      </div>
                    </div>

                    <div
                      ref={evidencePanelRef}
                      className={
                        stacked ? `${EVIDENCE_PANEL_STACKED} mt-4 lg:w-[min(23rem,100%)] lg:justify-self-end` : EVIDENCE_PANEL_PINNED
                      }
                    >
                      <div className={stacked ? '' : 'relative [transform:translateZ(14px)]'}>
                        <div className={PANEL_HEADER}>
                          <span>Evidence</span>
                          <span>4 facts, 1 source each</span>
                        </div>
                        <ul>
                          {HERO_EVIDENCE_ROWS.map((row) => (
                            <li key={row.label} data-hero-evidence-row className={EVIDENCE_ROW}>
                              <p className={MONO_MUTED}>{row.label}</p>
                              <p className={MONO_VALUE}>{row.value}</p>
                              <p className={MONO_MUTED}>{sourceReferenceLabel(row.reference)}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div
                      className={
                        stacked
                          ? 'relative mt-4 w-fit'
                          : 'absolute left-1/2 top-[32%] z-40 w-[min(16rem,calc(100%-2rem))] -translate-x-1/2'
                      }
                    >
                      <div
                        ref={markerRef}
                        className="relative grid justify-items-start gap-1 border border-[var(--error)] bg-[var(--error-wash)] p-4"
                      >
                        <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[var(--error)]">
                          Damage location differs
                        </p>
                        <p className="font-display text-lg leading-snug text-[var(--text-primary)]">
                          Claimant says rear door, records say rear bumper and tailgate.
                        </p>
                        <div data-marker-alert className="opacity-0">
                          <svg
                            viewBox="0 0 120 80"
                            fill="none"
                            aria-hidden="true"
                            className="absolute -left-3 -top-3 h-10 w-16"
                          >
                            <path
                              d="M8 8 H28 M8 8 V30 M112 72 H92 M112 72 V50"
                              stroke="var(--error)"
                              strokeWidth="4"
                              strokeLinecap="square"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div
                      ref={adjusterPanelRef}
                      className={stacked ? `${ADJUSTER_PANEL_STACKED} mt-4` : ADJUSTER_PANEL_PINNED}
                    >
                      <div className={stacked ? '' : 'relative [transform:translateZ(18px)]'}>
                        <div className={PANEL_HEADER}>
                          <span>Adjuster packet</span>
                          <span>Handoff ready</span>
                        </div>
                        <div className="grid gap-1">
                          <p className={MONO_MUTED}>Destination</p>
                          <p className={MONO_VALUE}>adjuster-queue</p>
                          <p className={MONO_MUTED}>Escalation</p>
                          <p className={MONO_VALUE}>Damage location conflict</p>
                        </div>
                        <p className={`${MONO_MUTED} mt-3`}>
                          No liability, coverage, or payment decision is made by Braid.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Text description of the decorative motion, placed by the page next to the
 * frame so the aria hidden 3D layer has a nearby text explanation.
 */
export const HERO_MOTION_NOTE =
  'On large screens the evidence frame tilts slightly under the pointer while the pinned sequence plays. All state panels remain readable at every step. The same states render stacked without motion on smaller screens and under reduced motion.';
