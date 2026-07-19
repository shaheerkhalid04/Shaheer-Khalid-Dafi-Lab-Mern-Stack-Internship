"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLogin />
    </Suspense>
  );
}

function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending
  const [error, setError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [lockedFor, setLockedFor] = useState(0); // seconds until retry allowed
  const timerRef = useRef(null);

  // Load the reCAPTCHA v3 script only when a site key is configured.
  useEffect(() => {
    if (!SITE_KEY || document.getElementById("recaptcha-v3")) return;
    const s = document.createElement("script");
    s.id = "recaptcha-v3";
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    document.head.appendChild(s);
  }, []);

  // Lockout countdown ticker.
  useEffect(() => {
    if (lockedFor <= 0) return;
    timerRef.current = setInterval(() => {
      setLockedFor((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [lockedFor > 0]);

  async function getRecaptchaToken() {
    if (!SITE_KEY || !window.grecaptcha) return null;
    await new Promise((r) => window.grecaptcha.ready(r));
    return window.grecaptcha.execute(SITE_KEY, { action: "login" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (lockedFor > 0) return;
    setStatus("sending");
    setError("");
    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setLockedFor(data.retryAfter ?? 60);
        setAttemptsRemaining(0);
        throw new Error(data.error);
      }
      if (!res.ok) {
        if (typeof data.attemptsRemaining === "number") {
          setAttemptsRemaining(data.attemptsRemaining);
          if (data.attemptsRemaining === 0) setLockedFor(15 * 60);
        }
        throw new Error(data.error || "Login failed.");
      }
      router.replace(params.get("from") || "/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus("idle");
    }
  }

  const mmss = `${Math.floor(lockedFor / 60)}:${String(lockedFor % 60).padStart(2, "0")}`;
  const inputBase =
    "w-full rounded-md border border-line bg-panel2 px-3 py-2.5 font-mono text-[13px] text-ink placeholder:text-muted focus:border-green/40 focus:outline-none focus:ring-1 focus:ring-green/40";

  return (
    <main className="grid-bg relative flex min-h-screen items-center justify-center px-6">
      <div className="relative z-10 w-full max-w-sm">
        <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-[0_0_60px_-20px_rgba(0,255,156,0.15)]">
          <div className="flex items-center gap-2 border-b border-line bg-panel2 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[12px] text-muted">admin@portfolio: ~/login</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
            <p className="font-mono text-[13px] text-green">$ sudo login</p>

            <div>
              <label htmlFor="email" className="mb-1.5 block font-mono text-[12px] text-muted">
                email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block font-mono text-[12px] text-muted">
                password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputBase}
              />
            </div>

            {lockedFor > 0 ? (
              <div className="rounded-md border border-[#ff6b6b]/30 bg-[#ff6b6b]/5 px-3 py-2.5">
                <p className="font-mono text-[12px] text-[#ff6b6b]">
                  ✗ too many attempts — locked
                </p>
                <p className="mt-1 font-mono text-[12px] text-muted">
                  try again in <span className="text-ink">{mmss}</span>
                </p>
              </div>
            ) : (
              error && (
                <p className="font-mono text-[12px] text-[#ff6b6b]">
                  ✗ {error}
                  {typeof attemptsRemaining === "number" && attemptsRemaining > 0 && (
                    <span className="text-muted"> · {attemptsRemaining} attempt{attemptsRemaining === 1 ? "" : "s"} left</span>
                  )}
                </p>
              )
            )}

            <button
              type="submit"
              disabled={status === "sending" || lockedFor > 0}
              className="w-full rounded-md bg-green px-4 py-2.5 font-mono text-[13px] font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {lockedFor > 0 ? `locked — ${mmss}` : status === "sending" ? "authenticating…" : "→ log in"}
            </button>

            {SITE_KEY && (
              <p className="text-center font-mono text-[10px] leading-relaxed text-muted">
                protected by reCAPTCHA ·{" "}
                <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noreferrer">privacy</a>
                {" · "}
                <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noreferrer">terms</a>
              </p>
            )}
          </form>
        </div>

        <p className="mt-4 text-center font-mono text-[12px] text-muted">
          <a href="/" className="hover:text-green">← back to site</a>
        </p>
      </div>
    </main>
  );
}
