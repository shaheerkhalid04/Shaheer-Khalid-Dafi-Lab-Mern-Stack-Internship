"use client";

import { skills } from "@/lib/content";
import { Reveal, SectionLabel } from "./Section";

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionLabel path="~/skills" cmd="cat stack.txt" />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {skills.map((s, i) => (
          <Reveal key={s.group} delay={i * 0.08}>
            <div className="h-full rounded-xl border border-line bg-panel p-5">
              <p className="font-mono text-[12px] text-green">{s.group}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-line bg-panel2 px-2.5 py-1 font-mono text-[12px] text-muted2"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
