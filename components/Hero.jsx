"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/content";

const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="dual-glow relative z-10 mx-auto max-w-5xl px-6 pt-36 pb-24 md:pt-44"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="scanline overflow-hidden rounded-xl border border-line bg-panel shadow-[-40px_0_90px_-50px_rgba(255,176,0,0.55),40px_0_90px_-50px_rgba(255,74,61,0.5)]"
      >
        <div className="flex items-center gap-2 border-b border-line bg-[#1A1613] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 font-mono text-[12px] text-muted">
            shaheer@portfolio: ~
          </span>
          <span className="ml-auto hidden font-mono text-[11px] text-ember/70 sm:inline">
            ● secure
          </span>
        </div>

        <div className="px-6 py-10 md:px-10 md:py-12">
          <p className="font-mono text-[13px] text-amber">$ whoami</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            {profile.name}
          </h1>
          <p className="prompt-caret caret-ember mt-3 font-mono text-base md:text-lg">
            <span className="text-amber">CS student</span>
            <span className="text-muted"> · </span>
            <span className="text-amber">AI/ML</span>
            <span className="text-muted"> · </span>
            <span className="text-ember">cybersecurity</span>
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {profile.tagline}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={profile.resume}
              className="rounded-md bg-amber px-4 py-2 font-mono text-[13px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              ↓ resume.pdf
            </a>
            {socials.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className={`rounded-md border px-4 py-2 font-mono text-[13px] transition-colors ${
                  i === 1
                    ? "border-ember/25 text-ember hover:bg-ember/10"
                    : "border-amber/25 text-amber hover:bg-amber/10"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
