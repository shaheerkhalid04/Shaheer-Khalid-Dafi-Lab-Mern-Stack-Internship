"use client";

import { about } from "@/lib/content";
import { Reveal, SectionLabel } from "./Section";

export default function About() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionLabel path="~/about" cmd="cat about.md" />
      </Reveal>

      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <div className="space-y-4">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-muted2">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-xl border border-line bg-panel p-5">
            <ul className="divide-y divide-line">
              {about.facts.map((f, i) => (
                <li key={f.k} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                  <span
                    className={`font-mono text-[12px] ${
                      i % 2 === 1 ? "text-red" : "text-green"
                    }`}
                  >
                    {f.k}
                  </span>
                  <span className="text-[13px] text-muted2">{f.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
