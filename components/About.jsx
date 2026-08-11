"use client";

import { about, experience, projects } from "@/lib/content";
import { Reveal, SectionLabel } from "./Section";

// Counted from the content so the tiles can never drift out of sync.
const stats = [
  { value: projects.length, label: "projects shipped" },
  { value: projects.filter((p) => p.live).length, label: "live deployments" },
  { value: experience.length, label: "roles held" },
];

function Tile({ children, className = "", delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div
        className={`h-full rounded-xl border border-line bg-panel p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/30 ${className}`}
      >
        {children}
      </div>
    </Reveal>
  );
}

export default function About() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionLabel path="~/about" cmd="cat about.md" />
      </Reveal>

      {/* Bento grid: one wide narrative tile, then facts and counters. */}
      <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Tile className="!p-6">
            <p className="font-mono text-[12px] text-amber">// whoami</p>
            <div className="mt-3 space-y-4">
              {about.paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-muted2">
                  {p}
                </p>
              ))}
            </div>
          </Tile>
        </div>

        <div className="lg:row-span-2">
          <Tile delay={0.06}>
            <p className="font-mono text-[12px] text-amber">// facts</p>
            <ul className="mt-3 divide-y divide-line">
              {about.facts.map((f) => (
                <li key={f.k} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {f.k}
                  </span>
                  <span className="text-[13px] text-muted2">{f.v}</span>
                </li>
              ))}
            </ul>
          </Tile>
        </div>

        {stats.map((s, i) => (
          <Tile key={s.label} delay={0.1 + i * 0.05}>
            <p className="font-mono text-3xl font-semibold text-amber">{s.value}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              {s.label}
            </p>
          </Tile>
        ))}
      </div>
    </section>
  );
}
