"use client";

import { useEffect, useRef } from "react";

/**
 * Floating amber dust — a subtle CRT-ember background field.
 *
 * Usage:
 *   import AmberDust from "@/components/AmberDust";
 *   <body><AmberDust /><YourContent /></body>
 *
 * The canvas pins itself behind everything (z-index: -1, pointer-events: none),
 * so page content only needs its own stacking context (e.g. `relative z-10`).
 *
 * Props: count (particles, default 30–46 by viewport), color (default #FFB000).
 */
export default function AmberDust({ count, color = "#FFB000" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let lastTime = 0;
    let running = false;

    const rgb = hexToRgb(color);

    // One pre-rendered glow sprite, drawn per particle. Far cheaper than
    // setting ctx.shadowBlur on every draw call.
    const sprite = document.createElement("canvas");
    const SPRITE_SIZE = 64;
    sprite.width = SPRITE_SIZE;
    sprite.height = SPRITE_SIZE;
    const sctx = sprite.getContext("2d");
    const half = SPRITE_SIZE / 2;
    const gradient = sctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, `rgba(${rgb},1)`);
    gradient.addColorStop(0.25, `rgba(${rgb},0.55)`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    function particleCount() {
      if (typeof count === "number") return count;
      return window.innerWidth < 640 ? 30 : 46;
    }

    function spawn(atBottom = false) {
      return {
        x: Math.random() * width,
        y: atBottom ? height + Math.random() * 40 : Math.random() * height,
        radius: 1.1 + Math.random() * 2.4, // drawn size of the glow
        rise: 5 + Math.random() * 13, // px/second upward
        sway: 3 + Math.random() * 9, // px/second horizontal amplitude
        phase: Math.random() * Math.PI * 2,
        freq: 0.08 + Math.random() * 0.22, // sway cycles/second
        alpha: 0.14 + Math.random() * 0.3,
      };
    }

    function resize() {
      // Cap DPR at 2 — beyond that the pixel cost outweighs the visual gain.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = particleCount();
      if (particles.length === 0) {
        particles = Array.from({ length: target }, () => spawn());
      } else if (particles.length < target) {
        while (particles.length < target) particles.push(spawn());
      } else if (particles.length > target) {
        particles.length = target;
      }
    }

    function paint() {
      ctx.clearRect(0, 0, width, height);
      // Additive blending so overlapping motes bloom instead of flattening.
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        const size = p.radius * 8;
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    function step(time) {
      // Clamp dt so a backgrounded tab doesn't teleport every particle.
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
      lastTime = time;

      for (const p of particles) {
        p.y -= p.rise * dt;
        p.phase += p.freq * Math.PI * 2 * dt;
        p.x += Math.sin(p.phase) * p.sway * dt;

        if (p.y < -20) Object.assign(p, spawn(true));
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
      }

      paint();
      frame = requestAnimationFrame(step);
    }

    function start() {
      if (running || motionQuery.matches) return;
      running = true;
      lastTime = 0;
      frame = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    // Don't burn frames on a tab nobody is looking at.
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    function onMotionChange() {
      stop();
      if (motionQuery.matches) paint(); // static dust, no animation
      else start();
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);

    if (motionQuery.matches) paint();
    else start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const int = parseInt(full, 16);
  return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
}
