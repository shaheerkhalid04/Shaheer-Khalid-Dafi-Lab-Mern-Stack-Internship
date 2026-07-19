import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Basic email shape check — good enough for a contact form.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v, max) {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 200);
  const message = clean(body.message, 5000);

  // ── validation ──
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  // ── Task 4: persist to Supabase via Prisma ──
  let saved;
  try {
    saved = await prisma.contact.create({
      data: { name, email, subject: subject || null, message },
    });
  } catch (err) {
    console.error("[contact] db error:", err);
    return NextResponse.json(
      { error: "Couldn't save your message. Please try again." },
      { status: 500 }
    );
  }

  // ── Task 5: Resend email alerts ──
  // Emails are best-effort — the message is already saved, so we never fail the
  // request just because email delivery hiccuped. We log and move on.
  if (resend) {
    const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
    const to = process.env.CONTACT_TO_EMAIL || email;

    // 1) Alert to you
    try {
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `New contact: ${subject || "no subject"} — ${name}`,
        text: [
          `New message from your portfolio contact form.`,
          ``,
          `Name:    ${name}`,
          `Email:   ${email}`,
          `Subject: ${subject || "(none)"}`,
          ``,
          message,
          ``,
          `—`,
          `Saved at ${saved.createdAt.toISOString()} (id: ${saved.id})`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[contact] alert email error:", err);
    }

    // 2) Confirmation to the sender (optional — controlled by env flag)
    if (process.env.SEND_CONFIRMATION === "true") {
      try {
        await resend.emails.send({
          from,
          to: email,
          subject: "Thanks for reaching out — Shaheer Khalid",
          text: [
            `Hi ${name},`,
            ``,
            `Thanks for your message — it came through and I'll get back to you soon.`,
            ``,
            `For reference, here's what you sent:`,
            `${message}`,
            ``,
            `— Shaheer`,
          ].join("\n"),
        });
      } catch (err) {
        console.error("[contact] confirmation email error:", err);
      }
    }
  } else {
    console.warn("[contact] RESEND_API_KEY not set — skipping email, message was still saved.");
  }

  return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
}
