import { profile } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
        <p className="font-mono text-[12px] text-muted">
          © {year} {profile.name}
        </p>
        <p className="font-mono text-[12px] text-muted">
          built with <span className="text-green">next.js</span> · deployed on{" "}
          <span className="text-green">vercel</span>
        </p>
      </div>
    </footer>
  );
}
