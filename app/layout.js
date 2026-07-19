import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { profile } from "@/lib/content";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%2300ff9c'>&gt;</text></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="grid-bg">{children}</body>
    </html>
  );
}
