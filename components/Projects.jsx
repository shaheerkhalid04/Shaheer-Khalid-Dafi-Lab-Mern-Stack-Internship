"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, projectFilters } from "@/lib/content";
import { Reveal, SectionLabel } from "./Section";
import { blip } from "@/lib/sound";

// Matches the page's max-w-5xl (64rem) container with a 1.5rem minimum gutter.
const GUTTER = "max(1.5rem, calc((100vw - 64rem) / 2))";

function Tag({ children }) {
  return (
    <span className="rounded-md bg-[#241B0C] px-2.5 py-1 font-mono text-[11px] text-amberdim">
      {children}
    </span>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <button
      onClick={onOpen}
      aria-label={`View case study: ${project.name}`}
      className="group flex h-full w-[82vw] max-w-[360px] shrink-0 snap-start flex-col rounded-xl border border-line bg-panel p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-amber/30 hover:shadow-[0_0_0_1px_rgba(255,176,0,0.15)] sm:w-[360px]"
      style={project.featured ? { borderLeft: "2px solid #FFB000" } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{project.name}</h3>
          <p className="mt-0.5 font-mono text-[12px] text-muted">{project.tagline}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {project.featured && (
            <span className="rounded-md bg-amber/10 px-2.5 py-1 font-mono text-[11px] text-amber">
              featured
            </span>
          )}
          {project.live && (
            <span className="font-mono text-[11px] text-amber/70">● live</span>
          )}
        </div>
      </div>

      <p className="mt-4 flex-1 text-[14px] leading-relaxed text-muted2">{project.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.slice(0, 3).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <span className="mt-5 font-mono text-[13px] text-amber opacity-80 transition-opacity group-hover:opacity-100">
        → view case study
      </span>
    </button>
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
        <div className="flex items-center gap-2 border-b border-line bg-[#1A1613] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 flex-1 font-mono text-[12px] text-muted">
            ~/projects/{project.slug}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer font-mono text-[13px] text-muted transition-colors hover:text-amber"
          >
            [esc]
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-7 md:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold text-ink">{project.name}</h3>
            {project.featured && (
              <span className="rounded-md bg-amber/10 px-2.5 py-1 font-mono text-[11px] text-amber">
                featured
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-[13px]">
            <span className="text-amber">{project.tagline}</span> ·{" "}
            <span className="text-muted">{project.context}</span>
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="font-mono text-[12px] text-muted">// overview</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted2">{project.summary}</p>
            </div>
            <div>
              <p className="font-mono text-[12px] text-muted">// how it works</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted2">{project.detail}</p>
            </div>
            <div>
              <p className="font-mono text-[12px] text-muted">// role</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted2">{project.role}</p>
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
                className="rounded-md border border-amber/25 px-4 py-2 font-mono text-[13px] text-amber transition-colors hover:bg-amber/10"
              >
                → GitHub repo
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-amber px-4 py-2 font-mono text-[13px] font-medium text-bg hover:opacity-90"
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
  const [filter, setFilter] = useState("all");
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const trackRef = useRef(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const shown =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const readScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(max - el.scrollLeft <= 2);
  }, []);

  useEffect(() => {
    readScroll();
  }, [filter, readScroll]);

  function page(dir) {
    const el = trackRef.current;
    if (!el) return;
    // Advance by one card plus the gap.
    const card = el.querySelector("button");
    const step = (card?.offsetWidth ?? 340) + 20;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    blip(dir > 0 ? 760 : 620, 0.05);
  }

  // Pointer drag — desktop users expect to be able to throw the track.
  function onPointerDown(e) {
    const el = trackRef.current;
    if (!el || e.pointerType === "touch") return; // native touch scroll is better
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  }
  function onPointerUp(e) {
    const el = trackRef.current;
    drag.current.down = false;
    el?.releasePointerCapture?.(e.pointerId);
  }

  function openIfNotDragging(p) {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    blip(920, 0.05);
    setActive(p);
  }

  return (
    <section id="projects" className="relative z-10 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionLabel path="~/projects" cmd="ls --featured" />
        </Reveal>

        <Reveal>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {projectFilters.map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
                    blip(700, 0.04);
                  }}
                  className={`cursor-pointer rounded-md border px-3 py-1.5 font-mono text-[12px] transition-colors ${
                    isActive
                      ? "border-amber/50 bg-amber/10 text-amber"
                      : "border-line text-muted hover:border-muted/40 hover:text-muted2"
                  }`}
                >
                  {f.label}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {f.id === "all"
                      ? projects.length
                      : projects.filter((p) => p.category === f.id).length}
                  </span>
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => page(-1)}
                disabled={atStart}
                aria-label="Previous projects"
                className="cursor-pointer rounded-md border border-line px-2.5 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-amber/40 hover:text-amber disabled:cursor-not-allowed disabled:opacity-30"
              >
                ←
              </button>
              <button
                onClick={() => page(1)}
                disabled={atEnd}
                aria-label="Next projects"
                className="cursor-pointer rounded-md border border-line px-2.5 py-1.5 font-mono text-[12px] text-muted transition-colors hover:border-amber/40 hover:text-amber disabled:cursor-not-allowed disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Full-bleed track so cards can run off the right edge. */}
      <div
        ref={trackRef}
        onScroll={readScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="region"
        aria-label="Projects carousel"
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth pb-2 focus:outline-none"
      >
        {/* Gutters as flex spacers — inline style because Tailwind can't parse
            arbitrary values containing commas. Keeps the first card aligned
            with the page grid while the track itself stays full-bleed. */}
        <span aria-hidden style={{ flexShrink: 0, width: GUTTER }} />
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} onOpen={() => openIfNotDragging(p)} />
        ))}
        <span aria-hidden style={{ flexShrink: 0, width: GUTTER }} />
      </div>

      {/* scroll progress rail */}
      <div className="mx-auto mt-5 max-w-5xl px-6">
        <div className="h-px w-full bg-line">
          <div
            className="h-px bg-amber transition-[width] duration-150 ease-out"
            style={{ width: `${Math.max(progress * 100, 4)}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          drag, scroll or use ← → · {shown.length} project{shown.length === 1 ? "" : "s"}
        </p>
      </div>

      <AnimatePresence>
        {active && <Modal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
