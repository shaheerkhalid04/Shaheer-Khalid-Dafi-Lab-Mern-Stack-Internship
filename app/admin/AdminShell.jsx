"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminShell({ email, path, children }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <main className="grid-bg relative min-h-screen">
      <header className="relative z-10 border-b border-line bg-panel/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-6">
            <span className="font-mono text-[13px] text-muted">
              admin@portfolio: <span className="text-amber">{path}</span>
            </span>
            <nav className="flex items-center gap-4 font-mono text-[13px]">
              <Link href="/admin" className="text-muted2 hover:text-amber">dashboard</Link>
              <Link href="/admin/contacts" className="text-muted2 hover:text-amber">messages</Link>
              <Link href="/" className="text-muted2 hover:text-amber">site ↗</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {email && <span className="hidden font-mono text-[12px] text-muted sm:inline">{email}</span>}
            <button
              onClick={logout}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[12px] text-muted2 transition-colors hover:border-amber/40 hover:text-amber"
            >
              logout
            </button>
          </div>
        </div>
      </header>
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">{children}</div>
    </main>
  );
}
