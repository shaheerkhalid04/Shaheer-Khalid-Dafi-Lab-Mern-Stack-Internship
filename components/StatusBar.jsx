"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/content";

const SECTION_IDS = ["top", ...nav.map((n) => n.href.replace("#", ""))];

/**
 * Fixed HUD strip along the bottom edge: live viewport size, the section you
 * are currently in, the visitor's platform, and a ticking Lahore clock.
 *
 * Non-interactive by design (pointer-events: none) so it never intercepts a
 * click, and hidden below `md` where the space is better spent on content.
 */
export default function StatusBar() {
  const [viewport, setViewport] = useState(null);
  const [section, setSection] = useState("top");
  const [platform, setPlatform] = useState("");
  const [clock, setClock] = useState("");

  // Viewport readout.
  useEffect(() => {
    const read = () => setViewport(`${window.innerWidth}×${window.innerHeight}`);
    read();
    window.addEventListener("resize", read, { passive: true });
    return () => window.removeEventListener("resize", read);
  }, []);

  // Platform label, read once.
  useEffect(() => {
    const ua = navigator.userAgent;
    const name = /Windows/i.test(ua)
      ? "windows"
      : /Mac/i.test(ua)
        ? "macos"
        : /Android/i.test(ua)
          ? "android"
          : /iPhone|iPad/i.test(ua)
            ? "ios"
            : /Linux/i.test(ua)
              ? "linux"
              : "web";
    setPlatform(name);
  }, []);

  // Lahore time, ticking each second.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Which section is currently under the top third of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target?.id) setSection(hit.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 hidden border-t border-line bg-bg/80 backdrop-blur md:block"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
        <span className="tabular-nums">{viewport ?? "—"}</span>
        <span className="flex items-center gap-2">
          <span className="text-amber">~/</span>
          <span className="text-muted2">{section === "top" ? "home" : section}</span>
        </span>
        <span className="ml-auto">{platform}</span>
        <span className="tabular-nums text-muted2">{clock} pkt</span>
      </div>
    </div>
  );
}
