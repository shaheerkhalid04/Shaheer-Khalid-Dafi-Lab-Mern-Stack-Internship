"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/content";
import { Reveal, SectionLabel } from "./Section";

function Tag({ children }) {
  return (
    <span className="rounded-md bg-[#0f1a15] px-2.5 py-1 font-mono text-[11px] text-greendim">
      {children}
    </span>
  );
}

function ProjectCard({ project, onOpen, index }) {
  return (
    <Reveal delay={index * 0.06}>
      <button
        onClick={onOpen}
        className="group flex h-full w-full flex-col rounded-xl border border-line bg-panel p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-green/30 hover:shadow-[0_0_0_1px_rgba(0,255,156,0.15)]"
        style={project.featured ? { borderLeft: "2px solid #00ff9c" } : undefined}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">{project.name}</h3>
            <p className="mt-0.5 font-mono text-[12px] text-muted">
              {project.tagline}
            </p>
          </div>
          {project.featured && (
            <span className="shrink-0 rounded-md bg-green/10 px-2.5 py-1 font-mono text-[11px] text-green">
              featured
            </span>
          )}
        </div>

        <p className="mt-4 flex-1 text-[14px] leading-relaxed text-muted2">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <span className="mt-5 font-mono text-[13px] text-green opacity-80 transition-opacity group-hover:opacity-100">
          → view case study
        </span>
      </button>
    </Reveal>
  );
}

function Modal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-panel"
      >
        <div className="flex items-center gap-2 border-b border-line bg-[#111] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 flex-1 font-mono text-[12px] text-muted">
            ~/projects/{project.slug}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-[13px] text-muted transition-colors hover:text-green"
          >
            [esc]
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-7 md:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold text-ink">{project.name}</h3>
            {project.featured && (
              <span className="rounded-md bg-green/10 px-2.5 py-1 font-mono text-[11px] text-green">
                featured
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-[13px] text-green">
            {project.tagline} · <span className="text-muted">{project.context}</span>
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="font-mono text-[12px] text-muted">// overview</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted2">
                {project.summary}
              </p>
            </div>

            <div>
              <p className="font-mono text-[12px] text-muted">// how it works</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted2">
                {project.detail}
              </p>
            </div>

            <div>
              <p className="font-mono text-[12px] text-muted">// role</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted2">
                {project.role}
              </p>
            </div>

            <div>
              <p className="font-mono text-[12px] text-muted">// stack</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 border-t border-line pt-6">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-green/25 px-4 py-2 font-mono text-[13px] text-green transition-colors hover:bg-green/10"
              >
                → GitHub repo
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-green px-4 py-2 font-mono text-[13px] font-medium text-bg hover:opacity-90"
              >
                ↗ live demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <section id="projects" className="relative z-10 mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <SectionLabel path="~/projects" cmd="ls --featured" />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} onOpen={() => setActive(p)} />
        ))}
      </div>

      <AnimatePresence>
        {active && <Modal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
