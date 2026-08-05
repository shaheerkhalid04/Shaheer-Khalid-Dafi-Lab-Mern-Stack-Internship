"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-bg/85 backdrop-blur border-b border-line" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-mono text-sm text-amber">
          <span className="text-muted">~/</span>shaheer
          <span className="caret-hue animate-blink">_</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-[13px] text-muted transition-colors hover:text-amber"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resume}
              className="rounded-md bg-amber px-3 py-1.5 font-mono text-[12px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              resume.pdf
            </a>
          </li>
        </ul>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="font-mono text-amber md:hidden"
        >
          {open ? "[x]" : "[≡]"}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-line bg-bg px-6 py-3 md:hidden">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-mono text-sm text-muted hover:text-amber"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.resume}
              className="mt-1 inline-block rounded-md bg-amber px-3 py-1.5 font-mono text-[12px] font-medium text-bg"
            >
              resume.pdf
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
