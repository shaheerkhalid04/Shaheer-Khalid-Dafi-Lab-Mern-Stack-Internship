import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import AdminShell from "../AdminShell";

export const dynamic = "force-dynamic";

export const metadata = { title: "Messages — Admin" };

const PAGE_SIZE = 25;

export default async function ContactsPage({ searchParams }) {
  const session = await getSession();
  const page = Math.max(parseInt(searchParams?.page ?? "1", 10) || 1, 1);

  const [total, contacts] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <AdminShell email={session?.email} path="~/admin/messages">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[13px] text-amber">$ cat messages.db</p>
        <p className="font-mono text-[12px] text-muted">{total} total</p>
      </div>

      <div className="mt-5 space-y-4">
        {contacts.length === 0 && (
          <div className="rounded-xl border border-line bg-panel p-8 text-center">
            <p className="font-mono text-[13px] text-muted">// no messages yet</p>
          </div>
        )}

        {contacts.map((c) => (
          <article key={c.id} className="rounded-xl border border-line bg-panel p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[15px] font-medium text-ink">
                {c.name}{" "}
                <a href={`mailto:${c.email}`} className="font-mono text-[12px] text-amber hover:underline">
                  &lt;{c.email}&gt;
                </a>
              </p>
              <p className="font-mono text-[11px] text-muted">
                {c.createdAt.toLocaleString("en-GB", { timeZone: "Asia/Karachi" })} PKT
              </p>
            </div>
            {c.subject && (
              <p className="mt-1.5 font-mono text-[12px] text-muted2">subject: {c.subject}</p>
            )}
            <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-muted2">{c.message}</p>
          </article>
        ))}
      </div>

      {pages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-4 font-mono text-[13px]">
          {page > 1 ? (
            <a href={`/admin/contacts?page=${page - 1}`} className="text-amber hover:underline">← prev</a>
          ) : (
            <span className="text-line">← prev</span>
          )}
          <span className="text-muted">page {page} / {pages}</span>
          {page < pages ? (
            <a href={`/admin/contacts?page=${page + 1}`} className="text-amber hover:underline">next →</a>
          ) : (
            <span className="text-line">next →</span>
          )}
        </nav>
      )}
    </AdminShell>
  );
}
