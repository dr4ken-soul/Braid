'use client';

/**
 * Reusable scroll reveal.
 *
 * Every below-fold element matched by the selector blurs up when the
 * container enters the viewport. The animation replays on every re-entry,
 * scrolling down and up again. Never a one-way configuration.
 *
 * Reduced motion: the hook is skipped so content renders immediately and
 * clearly with no reveal animation.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  selector: string,
): React.RefObject<T> {
  const containerRef = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const targets = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, filter: 'blur(10px)', y: 28 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: container,
            start: 'top 88%',
            end: 'top 52%',
            toggleActions: 'restart none none reset',
          },
        },
      );
    }, container);

    return () => {
      context.revert();
    };
  }, [reducedMotion, selector]);

  return containerRef;
}
