"use client";

import { useEffect, useRef, useState } from "react";
import WebGLOrb from "./WebGLOrb";
import { enableSound } from "@/lib/sound";

const LINES = [
  "initialising shell",
  "mounting /projects",
  "loading experience.log",
  "verifying certificates",
  "ready",
];

/**
 * Entry experience: sound gate → boot readout → site.
 *
 * Runs once per browser session and is skipped entirely under reduced motion,
 * so it never becomes a toll booth on repeat visits. The page underneath is
 * fully rendered the whole time — this is only an overlay, so crawlers and
 * no-JS visitors go straight to the content.
 */
export default function Intro() {
  const [phase, setPhase] = useState("checking"); // checking | gate | boot | done
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-shown") === "1";
    } catch {
      seen = true; // storage blocked — don't gate the visitor every navigation
    }
    if (reduced || seen) {
      setPhase("done");
      return;
    }
    setPhase("gate");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Boot counter.
  useEffect(() => {
    if (phase !== "boot") return;
    const DURATION = 1400;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round((1 - Math.pow(1 - t, 2)) * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      setLeaving(true);
      setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
      }, 520);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  async function enter(withSound) {
    try {
      sessionStorage.setItem("intro-shown", "1");
    } catch {}
    if (withSound) await enableSound();
    setPhase("boot");
  }

  if (phase === "checking" || phase === "done") return null;

  const shown = Math.min(Math.floor((progress / 100) * LINES.length), LINES.length - 1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter site"
      className={`fixed inset-0 z-[100] bg-bg transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {phase === "gate" && (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <WebGLOrb size={240} />

          <p className="mt-6 font-mono text-[13px] text-muted2">
            computer science student
            <br />
            building ai systems in lahore
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => enter(true)}
              autoFocus
              className="cursor-pointer rounded-md bg-amber px-5 py-2.5 font-mono text-[13px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              enter with sound
            </button>
            <button
              onClick={() => enter(false)}
              className="cursor-pointer rounded-md border border-amber/25 px-5 py-2.5 font-mono text-[13px] text-amber transition-colors hover:bg-amber/10"
            >
              enter without sound
            </button>
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            shaheer khalid
          </p>
        </div>
      )}

      {phase === "boot" && (
        <div className="flex h-full flex-col justify-between px-6 py-6 sm:px-10 sm:py-8">
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
      )}
    </div>
  );
}
