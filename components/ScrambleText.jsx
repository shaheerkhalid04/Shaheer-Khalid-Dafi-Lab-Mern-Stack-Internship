"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/\\[]{}<>=+*#%$&";

/**
 * Resolves text one character at a time out of random glyphs — a decode
 * effect rather than a typewriter, so the line never reflows while it runs.
 *
 * Renders the final string on the server and for reduced-motion visitors,
 * so the real text is always in the DOM for screen readers and crawlers.
 */
export default function ScrambleText({ text, className = "", speed = 34 }) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = [...text];
    // Spaces resolve instantly; everything else unlocks on a staggered schedule.
    const revealAt = chars.map((c, i) => (c === " " ? 0 : i * 1.6 + Math.random() * 6));
    const total = Math.max(...revealAt) + 8;
    frame.current = 0;

    timer.current = setInterval(() => {
      const f = (frame.current += 1);
      let done = true;
      const next = chars
        .map((c, i) => {
          if (f >= revealAt[i]) return c;
          done = false;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setDisplay(next);
      if (done || f > total) clearInterval(timer.current);
    }, speed);

    return () => clearInterval(timer.current);
  }, [text, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
