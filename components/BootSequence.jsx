"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  "initialising shell",
  "mounting /projects",
  "loading experience.log",
  "verifying certificates",
  "ready",
];

/**
 * Terminal boot screen with a numeric progress readout.
 *
 * Shown once per browser session (sessionStorage), skipped entirely under
 * prefers-reduced-motion. Purely an overlay — the page underneath is fully
 * rendered the whole time, so crawlers and no-JS visitors never see it.
 */
export default function BootSequence() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("boot-shown") === "1";
    } catch {
      // Private mode with storage disabled — just skip the animation.
      seen = true;
    }
    if (reduced || seen) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const DURATION = 1500;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / DURATION, 1);
      // Ease out so the counter decelerates into 100 instead of snapping.
      setProgress(Math.round((1 - Math.pow(1 - t, 2)) * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      try {
        sessionStorage.setItem("boot-shown", "1");
      } catch {}
      setLeaving(true);
      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 500);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  const shown = Math.min(Math.floor((progress / 100) * LINES.length), LINES.length - 1);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-bg px-6 py-6 transition-opacity duration-500 sm:px-10 sm:py-8 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        shaheer khalid — portfolio
      </p>

      <div className="mx-auto w-full max-w-md">
        <ul className="mb-5 space-y-1">
          {LINES.slice(0, shown + 1).map((line, i) => (
            <li key={line} className="font-mono text-[12px] text-muted">
              <span className="text-amber">$</span> {line}
              {i < shown && <span className="ml-2 text-amber">ok</span>}
            </li>
          ))}
        </ul>

        {/* progress rail */}
        <div className="h-px w-full bg-line">
          <div
            className="h-px bg-amber transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-right font-mono text-[42px] font-semibold leading-none text-amber tabular-nums sm:text-[64px]">
        {String(progress).padStart(3, "0")}
        <span className="ml-1 text-[16px] text-muted sm:text-[20px]">%</span>
      </p>
    </div>
  );
}
