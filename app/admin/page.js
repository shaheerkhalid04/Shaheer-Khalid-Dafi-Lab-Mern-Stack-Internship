import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard — Admin" };

export default async function AdminDashboard() {
  const session = await getSession();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [total, last7days, latest, failedLogins24h] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { createdAt: { gte: since7d } } }),
    prisma.contact.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.loginAttempt.count({
      where: { success: false, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const stats = [
    { label: "total messages", value: total },
    { label: "last 7 days", value: last7days },
    { label: "failed logins (24h)", value: failedLogins24h },
  ];

  return (
    <AdminShell email={session?.email} path="~/admin">
      <p className="font-mono text-[13px] text-green">$ ./dashboard --stats</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-panel p-5">
            <p className="font-mono text-3xl font-semibold text-ink">{s.value}</p>
            <p className="mt-1 font-mono text-[12px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-panel p-5">
        <p className="font-mono text-[12px] text-muted">latest message</p>
        {latest ? (
          <div className="mt-2">
            <p className="text-[15px] text-ink">
              {latest.name} <span className="font-mono text-[12px] text-muted">&lt;{latest.email}&gt;</span>
            </p>
            <p className="mt-1 line-clamp-2 text-[14px] text-muted2">{latest.message}</p>
            <p className="mt-2 font-mono text-[11px] text-muted">
              {latest.createdAt.toLocaleString("en-GB", { timeZone: "Asia/Karachi" })} PKT
            </p>
          </div>
        ) : (
          <p className="mt-2 text-[14px] text-muted2">No messages yet.</p>
        )}
      </div>

      <Link
        href="/admin/contacts"
        className="mt-6 inline-block rounded-md bg-green px-4 py-2.5 font-mono text-[13px] font-medium text-bg transition-opacity hover:opacity-90"
      >
        → view all messages
      </Link>
    </AdminShell>
  );
}
