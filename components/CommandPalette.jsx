"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nav, profile, projects } from "@/lib/content";

export const OPEN_PALETTE_EVENT = "portfolio:open-palette";

function scrollToSection(href) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * ⌘K / Ctrl+K command palette.
 *
 * The terminal conceit taken literally: every destination on the site is
 * reachable without touching the mouse. Also covers the keyboard-navigation
 * gap a pointer-only portfolio normally leaves open.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const items = useMemo(() => {
    const sections = nav.map((n) => ({
      id: `go${n.href}`,
      group: "go to",
      label: n.label,
      hint: n.href,
      run: () => scrollToSection(n.href),
    }));

    const projectItems = projects.map((p) => ({
      id: `project-${p.slug}`,
      group: "projects",
      label: p.name,
      hint: p.live ? "live demo ↗" : p.repo ? "repo ↗" : "view on page",
      run: () => {
        const url = p.live || p.repo;
        if (url) openExternal(url);
        else scrollToSection("#projects");
      },
    }));

    const links = [
      {
        id: "link-resume",
        group: "links",
        label: "Download resume",
        hint: "resume.pdf",
        run: () => openExternal(profile.resume),
      },
      {
        id: "link-github",
        group: "links",
        label: "GitHub",
        hint: "@shaheerkhalid04",
        run: () => openExternal(profile.github),
      },
      {
        id: "link-linkedin",
        group: "links",
        label: "LinkedIn",
        hint: "in/shaheerkhalid004",
        run: () => openExternal(profile.linkedin),
      },
      {
        id: "link-email",
        group: "links",
        label: "Email me",
        hint: profile.email,
        run: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
    ];

    return [...sections, ...projectItems, ...links];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.group} ${i.hint}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    restoreFocusRef.current?.focus?.();
  }, []);

  const openPalette = useCallback(() => {
    restoreFocusRef.current = document.activeElement;
    setOpen(true);
  }, []);

  // Global hotkey + the nav button's custom event.
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) restoreFocusRef.current = document.activeElement;
          return !o;
        });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, openPalette);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, openPalette);
    };
  }, [openPalette]);

  // Lock scroll and focus the input while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row in view as you arrow through.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function onInputKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) {
        close();
        item.run();
      }
    }
  }

  if (!open) return null;

  let lastGroup = null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-amber/20 bg-panel shadow-[0_0_80px_-20px_rgba(255,176,0,0.25)]"
      >
        <div className="flex items-center gap-2 border-b border-line bg-[#1A1613] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 flex-1 font-mono text-[12px] text-muted">
            shaheer@portfolio: ~/run
          </span>
          <button
            onClick={close}
            aria-label="Close command palette"
            className="cursor-pointer font-mono text-[12px] text-muted transition-colors hover:text-amber"
          >
            [esc]
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span aria-hidden className="font-mono text-[14px] text-amber">
            $
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="jump to a section, project, or link…"
            aria-label="Search commands"
            aria-controls="command-results"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            className="w-full bg-transparent font-mono text-[14px] text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        <ul
          id="command-results"
          ref={listRef}
          role="listbox"
          aria-label="Commands"
          className="max-h-[46vh] overflow-y-auto py-2"
        >
          {results.length === 0 && (
            <li className="px-4 py-6 text-center font-mono text-[12px] text-muted">
              no matches for “{query}”
            </li>
          )}

          {results.map((item, i) => {
            const showGroup = item.group !== lastGroup;
            lastGroup = item.group;
            const isActive = i === active;
            return (
              <li key={item.id}>
                {showGroup && (
                  <p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {item.group}
                  </p>
                )}
                <button
                  id={`cmd-${item.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    close();
                    item.run();
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-2 text-left font-mono text-[13px] transition-colors duration-150 ${
                    isActive ? "bg-amber/10 text-amber" : "text-muted2 hover:text-ink"
                  }`}
                >
                  <span className="truncate">
                    {isActive && <span aria-hidden className="mr-2 text-amber">→</span>}
                    {item.label}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted">{item.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2 font-mono text-[10px] text-muted">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
          <span className="ml-auto">{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
