<div align="center">

```
┌─────────────────────────────────────────────┐
│  shaheer@portfolio: ~                        │
├─────────────────────────────────────────────┤
│                                             │
│  $ whoami                                   │
│  Shaheer Khalid — MERN Stack Developer      │
│  MERN Stack Intern @ DAFI Labs              │
│                                             │
│  $ cat mission.txt                          │
│  Ship full-stack web apps & AI-powered      │
│  tools that solve real problems.  ▌         │
│                                             │
└─────────────────────────────────────────────┘
```

# ~/shaheer — Terminal-Themed Portfolio

**A single-page, dark-mode, terminal-inspired developer portfolio.**
Neon-green accents · blinking cursor · scroll-reveal motion · a contact form that actually works.

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

[**Live Demo**](https://your-site.vercel.app) · [**LinkedIn**](https://www.linkedin.com/in/shaheerkhalid004/) · [**Email**](mailto:shaheerkhalid1404@gmail.com)

</div>

---

## ⚡ Features

- 🖥️ **Terminal aesthetic** — `$ whoami` hero, prompt-style section headers, blinking cursor, subtle grid texture
- 🎨 **One sharp accent** — `#00ff9c` neon green on a `#0a0a0a` canvas; the green earns attention because nothing competes with it
- 🎬 **Framer Motion everywhere** — scroll-reveal sections, hover lift on cards, smooth-scroll nav
- 📁 **Project case-study modals** — click any project card for the problem, approach, stack, and repo link
- ✉️ **Real contact form** — validated server-side, saved to **Supabase** via **Prisma**, email alerts via **Resend**
- 📄 **One file to rule all content** — every word on the site lives in [`lib/content.js`](lib/content.js)
- 🚀 **Zero-config deploy** — push to GitHub, import to Vercel, done

## 🧱 Stack

| Layer     | Tech                                        |
| --------- | ------------------------------------------- |
| Framework | Next.js 14 (App Router) + React 18          |
| Styling   | Tailwind CSS — custom terminal theme tokens |
| Motion    | Framer Motion                               |
| Database  | Supabase (Postgres) + Prisma ORM            |
| Email     | Resend                                      |
| Hosting   | Vercel                                      |

## 🚀 Quick Start

> Requires **Node.js 18.17+**

```bash
git clone https://github.com/shaheerkhalid04/<repo-name>.git
cd <repo-name>
npm install

cp .env.example .env   # fill in your keys (see below)
npm run db:push        # creates the Contact table in Supabase
npm run dev            # → http://localhost:3000
```

The site runs fine without a `.env` — only the contact form needs it.

## 🔐 Environment

| Variable             | What it is                                                       |
| -------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`       | Supabase **Transaction pooler** string (port `6543`) + `?pgbouncer=true` |
| `DIRECT_URL`         | Supabase **direct/session** string (port `5432`)                 |
| `RESEND_API_KEY`     | API key from [resend.com](https://resend.com)                    |
| `CONTACT_TO_EMAIL`   | Inbox that receives "new contact" alerts                         |
| `CONTACT_FROM_EMAIL` | Sender address (`onboarding@resend.dev` works out of the box)    |
| `SEND_CONFIRMATION`  | `"true"` to auto-reply to the sender                             |

Emails are **best-effort**: if Resend hiccups, the submission is still saved and the visitor still sees success.

## 📂 Structure

```
app/
  layout.js              root layout, fonts, metadata
  page.js                composes all sections
  globals.css            terminal theme
  api/contact/route.js   POST → validate → Prisma save → Resend email
components/              Nav · Hero · About · Projects (+modal) · Skills · Contact · Footer
lib/
  content.js             ← every word on the site lives here
  prisma.js              Prisma client singleton
prisma/
  schema.prisma          Contact model
public/                  resume PDF goes here
```

## 🛠️ Scripts

| Command             | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Local dev server                     |
| `npm run build`     | `prisma generate` + production build |
| `npm run start`     | Serve the production build           |
| `npm run db:push`   | Sync schema to Supabase              |
| `npm run db:studio` | Prisma Studio (view/edit rows)       |

## ☁️ Deploy (Vercel)

1. Push this repo to GitHub.
2. [vercel.com](https://vercel.com) → **Add New → Project** → import the repo. Next.js is auto-detected.
3. Add the env vars from your `.env` under **Environment Variables**.
4. **Deploy.** Run `npm run db:push` once (locally is fine) so the table exists before the live form is used.

---

<div align="center">

```
$ echo "built by Shaheer Khalid · MERN Stack Intern @ DAFI Labs"
```

⭐ If this repo helped you build your own, a star would be appreciated.

</div>
