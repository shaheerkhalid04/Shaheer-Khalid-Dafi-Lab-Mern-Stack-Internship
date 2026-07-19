import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

// ── Task 7: rate limit ── max 5 failed attempts per IP per window.
const MAX_FAILURES = 5;
const WINDOW_MINUTES = 15;

function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : "") || "unknown";
}

// ── Task 7: Google reCAPTCHA v3 ── skipped gracefully when keys aren't configured.
async function verifyRecaptcha(token, ip) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false };
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return { ok: data.success === true && (data.score ?? 0) >= 0.5 };
  } catch (err) {
    console.error("[login] recaptcha verify error:", err);
    // Fail open on Google outage — the rate limiter still protects us.
    return { ok: true };
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const ip = clientIp(req);

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Rate limit check — count recent failures from this IP.
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const recentFailures = await prisma.loginAttempt.findMany({
    where: { ip, success: false, createdAt: { gte: windowStart } },
    orderBy: { createdAt: "asc" },
  });

  if (recentFailures.length >= MAX_FAILURES) {
    const oldest = recentFailures[0].createdAt.getTime();
    const retryAfter = Math.ceil((oldest + WINDOW_MINUTES * 60 * 1000 - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many failed attempts.", retryAfter: Math.max(retryAfter, 1) },
      { status: 429 }
    );
  }

  const captcha = await verifyRecaptcha(body.recaptchaToken, ip);
  if (!captcha.ok) {
    return NextResponse.json(
      { error: "Captcha verification failed. Refresh and try again." },
      { status: 400 }
    );
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  const valid = admin && (await bcrypt.compare(password, admin.passwordHash));

  await prisma.loginAttempt.create({ data: { ip, email, success: Boolean(valid) } });

  if (!valid) {
    const failuresNow = recentFailures.length + 1;
    const remaining = Math.max(MAX_FAILURES - failuresNow, 0);
    return NextResponse.json(
      { error: "Invalid email or password.", attemptsRemaining: remaining },
      { status: 401 }
    );
  }

  const token = await createSessionToken(admin.id, admin.email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
