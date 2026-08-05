"use client";

import { experience } from "@/lib/content";
import { Reveal, SectionLabel } from "./Section";

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionLabel path="~/experience" cmd="ls -la roles/" />
      </Reveal>

      <div className="relative">
        {/* timeline spine */}
        <span
          aria-hidden
          className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber/50 via-line to-amber/20"
        />

        <ol className="space-y-5">
          {experience.map((job, i) => (
            <li key={`${job.org}-${job.role}`} className="relative pl-8">
              <span
                aria-hidden
                className="absolute left-0 top-6 h-[15px] w-[15px] rounded-full border-2 border-amber bg-bg"
              />
              <Reveal delay={i * 0.05}>
                <article className="rounded-xl border border-line bg-panel p-5 transition-colors duration-200 hover:border-amber/30">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-[16px] font-semibold text-ink">{job.role}</h3>
                    {job.period && (
                      <span className="rounded-md border border-amber/25 px-2 py-0.5 font-mono text-[11px] text-amber">
                        {job.period}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 font-mono text-[12px]">
                    <span className="text-amber">{job.org}</span>
                    <span className="text-muted"> · {job.mode}</span>
                  </p>

                  <p className="mt-3 text-[14px] leading-relaxed text-muted2">{job.blurb}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
