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
    <section id="top" className="relative z-10 mx-auto max-w-5xl px-6 pt-36 pb-24 md:pt-44">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="overflow-hidden rounded-xl border border-line bg-panel"
      >
        <div className="flex items-center gap-2 border-b border-line bg-[#111] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 font-mono text-[12px] text-muted">
            shaheer@portfolio: ~
          </span>
        </div>

        <div className="px-6 py-10 md:px-10 md:py-12">
          <p className="font-mono text-[13px] text-green">$ whoami</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            {profile.name}
          </h1>
          <p className="prompt-caret mt-3 font-mono text-base text-green md:text-lg">
            {profile.role}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            {profile.tagline}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={profile.resume}
              className="rounded-md bg-green px-4 py-2 font-mono text-[13px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              ↓ resume.pdf
            </a>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="rounded-md border border-green/25 px-4 py-2 font-mono text-[13px] text-green transition-colors hover:bg-green/10"
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
