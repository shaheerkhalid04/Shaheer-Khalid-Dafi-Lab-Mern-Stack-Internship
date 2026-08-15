"use client";

/**
 * Tiny synthesised sound layer — no audio files to download or host.
 *
 * A warm two-oscillator drone through a lowpass filter, plus short blips for
 * UI events. Everything hangs off one AudioContext created lazily on the
 * user's click, which is what browser autoplay policy requires.
 */

let ctx = null;
let master = null;
let ambient = null;
let enabled = false;
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(enabled));
}

export function onSoundChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isSoundEnabled() {
  return enabled;
}

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  return ctx;
}

function startAmbient() {
  if (!ctx || ambient) return;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 0.7;

  const bed = ctx.createGain();
  bed.gain.value = 0.55;

  // Two slightly detuned voices produce a slow beat rather than a flat tone.
  const a = ctx.createOscillator();
  a.type = "sine";
  a.frequency.value = 58;
  const b = ctx.createOscillator();
  b.type = "triangle";
  b.frequency.value = 87.5;

  // Slow tremolo so the pad breathes.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.22;
  lfo.connect(lfoGain);
  lfoGain.connect(bed.gain);

  a.connect(filter);
  b.connect(filter);
  filter.connect(bed);
  bed.connect(master);

  a.start();
  b.start();
  lfo.start();

  ambient = { a, b, lfo, bed, filter };
}

export async function enableSound() {
  if (!ensureContext()) return false;
  if (ctx.state === "suspended") await ctx.resume();
  startAmbient();
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0.035, now + 1.2);
  enabled = true;
  notify();
  return true;
}

export function disableSound() {
  if (!ctx || !master) {
    enabled = false;
    notify();
    return;
  }
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0.0001, now + 0.4);
  enabled = false;
  notify();
}

export function toggleSound() {
  return enabled ? (disableSound(), false) : (enableSound(), true);
}

/** Short blip for UI interactions. No-op while sound is off. */
export function blip(freq = 880, duration = 0.06) {
  if (!enabled || !ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}
