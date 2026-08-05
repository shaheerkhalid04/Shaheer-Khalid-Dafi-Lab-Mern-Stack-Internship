"use client";

import { useEffect, useRef } from "react";

/**
 * A soft amber→ember halo that trails the mouse pointer.
 *
 * The only place on the site where the accent shifts hue: amber at the core,
 * burning out to ember red at the edge. Additive (screen blend) and low
 * opacity, so it warms whatever it passes over without hiding text.
 *
 * Skipped entirely on touch/coarse-pointer devices and when the visitor
 * prefers reduced motion.
 */
export default function CursorGlow({ size = 340 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    // Render position trails the true pointer position for a soft lag.
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let idle = true;

    function apply() {
      el.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
    }

    function step() {
      const dx = targetX - x;
      const dy = targetY - y;
      x += dx * 0.14;
      y += dy * 0.14;
      apply();

      // Park the loop once we've caught up — no idle CPU burn.
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) {
        idle = true;
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    }

    function wake() {
      if (!idle) return;
      idle = false;
      frame = requestAnimationFrame(step);
    }

    function onMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      el.style.opacity = "1";
      wake();
    }

    function onLeave() {
      el.style.opacity = "0";
    }

    apply();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [size]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        zIndex: 40,
        opacity: 0,
        pointerEvents: "none",
        mixBlendMode: "screen",
        transition: "opacity 400ms ease",
        background:
          "radial-gradient(circle closest-side, rgba(255,176,0,0.13), rgba(255,120,20,0.08) 45%, rgba(255,74,61,0.05) 70%, transparent 100%)",
      }}
    />
  );
}
