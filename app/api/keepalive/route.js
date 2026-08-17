import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Prisma needs the Node runtime, and this must never be cached — a cached
// response would defeat the entire point.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Keeps the Supabase project awake.
 *
 * Free-tier Supabase projects pause after roughly a week with no database
 * activity, which silently 500s the contact form and the admin panel. A
 * single cheap query per day is enough to reset that clock.
 *
 * Hit daily by Vercel Cron (see vercel.json). Vercel attaches
 * `Authorization: Bearer $CRON_SECRET` automatically when that env var is
 * set, so the endpoint is not a free database ping for anyone who finds it.
 */
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startedAt = Date.now();
  try {
    // Cheapest possible round trip that still proves the database answered.
    await prisma.$queryRaw`SELECT 1`;
    const ms = Date.now() - startedAt;
    console.log(`[keepalive] ok in ${ms}ms`);
    return NextResponse.json({ ok: true, ms, at: new Date().toISOString() });
  } catch (err) {
    // Surface a non-200 so a failed ping is visible in Vercel's cron log
    // rather than quietly succeeding while the project drifts toward a pause.
    console.error("[keepalive] database unreachable:", err?.message);
    return NextResponse.json(
      { ok: false, error: "Database unreachable" },
      { status: 503 }
    );
  }
}
