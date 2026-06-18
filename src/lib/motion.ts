import type { Variants, Transition } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/* ----------------------------------------------------------------
 * Shared framer-motion variants & helpers for RankScope.
 * Keep all motion consistent by importing from here.
 * ---------------------------------------------------------------- */

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const springCard: Transition = { type: 'spring', stiffness: 260, damping: 24 };
export const springSoft: Transition = { type: 'spring', stiffness: 180, damping: 22 };

/** Fade + rise. Use as a child variant under `stagger`. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

/** Container that cascades its children's entrance. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** Wizard slide transition (directional). */
export const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 40 : -40, opacity: 0 }),
};

/** Reusable hover/tap props for interactive cards. */
export const hoverLift = {
  whileHover: { y: -3 },
  whileTap: { scale: 0.99 },
  transition: springCard,
};

/** Reusable hover/tap props for buttons. */
export const tapScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
};

/* ----------------------------------------------------------------
 * useCountUp — animate a number from 0 (or `from`) to `end`.
 * Respects prefers-reduced-motion (jumps straight to the value).
 * ---------------------------------------------------------------- */
export function useCountUp(end: number, duration = 900, from = 0): number {
  const [value, setValue] = useState(from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setValue(end);
      return;
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || duration <= 0) {
      setValue(end);
      return;
    }

    const start = performance.now();
    const delta = end - from;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + delta * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, from]);

  return value;
}
