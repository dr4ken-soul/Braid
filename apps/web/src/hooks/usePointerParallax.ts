'use client';

/**
 * Mouse-tracked rotation for the hero evidence frame only.
 *
 * Limits: rotateX and rotateY stay within 2.5 degrees. The spring follows the
 * spec values: stiffness 180, damping 24, mass 0.7. The pointer listener is
 * disabled below 768px, on touch pointers, and whenever reduced motion is on.
 * Flat layouts never receive a tilt.
 */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

const MAX_DEG = 2.5;
const STIFFNESS = 180;
const DAMPING = 24;
const MASS = 0.7;
const POINTER_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)';

export function usePointerParallax<T extends HTMLElement = HTMLDivElement>(): React.RefObject<T> {
  const frameRef = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || reducedMotion) return;

    const media = window.matchMedia(POINTER_QUERY);
    if (!media.matches) return;

    let rotateX = 0;
    let rotateY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let targetX = 0;
    let targetY = 0;
    let frameRequest = 0;
    let lastTime = window.performance.now();

    const applyTransform = () => {
      frame.style.transform = `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const xNorm = (event.clientX - rect.left) / rect.width;
      const yNorm = (event.clientY - rect.top) / rect.height;
      targetY = (xNorm - 0.5) * 2 * MAX_DEG;
      targetX = (0.5 - yNorm) * 2 * MAX_DEG;
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;
      velocityX += (((targetX - rotateX) * STIFFNESS - velocityX * DAMPING) / MASS) * delta;
      velocityY += (((targetY - rotateY) * STIFFNESS - velocityY * DAMPING) / MASS) * delta;
      rotateX += velocityX * delta;
      rotateY += velocityY * delta;
      applyTransform();
      frameRequest = window.requestAnimationFrame(tick);
    };

    frame.addEventListener('pointermove', handlePointerMove);
    frame.addEventListener('pointerleave', handlePointerLeave);
    frameRequest = window.requestAnimationFrame(tick);
    applyTransform();

    return () => {
      window.cancelAnimationFrame(frameRequest);
      frame.removeEventListener('pointermove', handlePointerMove);
      frame.removeEventListener('pointerleave', handlePointerLeave);
      frame.style.transform = '';
    };
  }, [reducedMotion]);

  return frameRef;
}
