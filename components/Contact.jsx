"use client";

import { useState } from "react";
import { profile } from "@/lib/content";
import { Reveal, SectionLabel } from "./Section";

const initial = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("ok");
      setForm(initial);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  const inputBase =
    "w-full rounded-md border border-line bg-panel2 px-3 py-2.5 font-mono text-[13px] text-ink placeholder:text-muted focus:border-green/40 focus:outline-none focus:ring-1 focus:ring-green/40";

  return (
    <section id="contact" className="relative z-10 mx-auto max-w-5xl px-6 py-20 pb-28">
      <Reveal>
        <SectionLabel path="~/contact" cmd="./say-hello" />
      </Reveal>

      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div>
            <h2 className="text-2xl font-semibold text-ink">Let's talk.</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted2">
              Open to roles and collaborations in AI/ML and security engineering —
              or anything genuinely hard. Drop a message and I'll get back to you.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 font-mono text-[13px]">
                <span className="text-green">email</span>
                <a href={`mailto:${profile.email}`} className="text-muted2 hover:text-green">
                  {profile.email}
                </a>
              </li>
              <li className="flex items-center gap-3 font-mono text-[13px]">
                <span className="text-green">github</span>
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-muted2 hover:text-green">
                  /shaheerkhalid04
                </a>
              </li>
              <li className="flex items-center gap-3 font-mono text-[13px]">
                <span className="text-green">linkedin</span>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-muted2 hover:text-green">
                  /shaheerkhalid004
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-xl border border-line bg-panel p-6">
            {status === "ok" ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <p className="font-mono text-2xl text-green">✓</p>
                <p className="mt-3 text-[15px] text-ink">Message sent.</p>
                <p className="mt-1 text-[13px] text-muted">
                  Thanks — I'll reply to your email soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-5 font-mono text-[13px] text-green hover:underline"
                >
                  ← send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block font-mono text-[12px] text-muted">
                      name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block font-mono text-[12px] text-muted">
                      email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      placeholder="you@example.com"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-1.5 block font-mono text-[12px] text-muted">
                    subject <span className="text-line">(optional)</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={update("subject")}
                    placeholder="What's this about?"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block font-mono text-[12px] text-muted">
                    message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell me a bit about it…"
                    className={`${inputBase} resize-y`}
                  />
                </div>

                {status === "error" && (
                  <p className="font-mono text-[12px] text-[#ff6b6b]">
                    {error || "Couldn't send. Try again."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-md bg-green px-4 py-2.5 font-mono text-[13px] font-medium text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? "sending…" : "→ send message"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
