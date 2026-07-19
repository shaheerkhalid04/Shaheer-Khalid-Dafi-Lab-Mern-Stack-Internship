// ─────────────────────────────────────────────────────────────
//  Edit everything about the site's content here.
//  Items marked TODO are placeholders — swap in your real values.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Shaheer Khalid",
  role: "MERN stack developer",
  location: "Lahore, Pakistan",
  email: "shaheerkhalid1404@gmail.com",
  github: "https://github.com/shaheerkhalid04",
  linkedin: "https://www.linkedin.com/in/shaheerkhalid004/",
  resume: "/Shaheer_Khalid_Resume.pdf",
  tagline:
    "MERN stack intern at DAFI Labs, CS student, and builder. I ship full-stack web apps and AI-powered tools.",
};

export const about = {
  // Drafted from your CV — edit freely to sound like you.
  paragraphs: [
    "I'm a BSc (Hons) Computer Science student at Forman Christian College University, graduating December 2027, currently interning as a MERN stack developer at DAFI Labs. On campus I work as a Teaching Assistant, mentoring students in Python, algorithms, and OOP, and I run operations for the Forman Computer Science Club.",
    "I like building things that solve a real problem end-to-end — from a carpooling app for day-scholars to a RAG study assistant built under hackathon pressure. Most of my work lives in the MERN and Django ecosystems, and I'm drawn to the parts of a system where correctness actually matters: auth, retrieval, distributed consensus.",
  ],
  facts: [
    { k: "education", v: "BSc (Hons) CS — FCCU, grad Dec 2027" },
    { k: "now", v: "MERN Stack Intern @ DAFI Labs · TA · FCSC Director of Ops" },
    { k: "focus", v: "MERN · Django REST · applied AI" },
    { k: "location", v: "Lahore, Pakistan" },
  ],
};

// Order = homepage priority (your ranking).
export const projects = [
  {
    slug: "notemate",
    name: "NoteMate",
    featured: true,
    tagline: "AI note-taking assistant",
    context: "HEC GenAI Training Hackathon",
    summary:
      "RAG-based study tool. Students upload PDFs and notes, then query them using vector embeddings and an LLM — answers come from their own material, not the open web.",
    detail:
      "Built under hackathon conditions. The Django REST backend handles the whole pipeline end-to-end with no manual steps: upload, chunking, embedding generation, and retrieval. Queries are answered against the student's own uploaded material only.",
    role: "Team project — Shaheer Khalid & Rameen Zafar",
    tags: ["Django REST", "RAG", "Vector DB", "LLM API", "Embeddings"],
    repo: "https://github.com/shaheerkhalid04/notemate-hackathon",
    live: null,
  },
  {
    slug: "anon",
    name: "ANON",
    featured: false,
    tagline: "Decentralized voting system",
    context: "NUST Olympiad 2026 Hackathon",
    summary:
      "A peer-to-peer voting system using blind cryptographic signatures for anonymity and Byzantine Fault Tolerance, so the system stays correct even when nodes turn malicious.",
    detail:
      "Voters are anonymized with blind signatures — the authority signs a ballot without seeing its contents. A DAG structure records votes so tampering is detectable, and BFT consensus keeps the tally correct in the presence of faulty or adversarial nodes.",
    role: "Team project — Shaheer Khalid & Rameen Zafar",
    tags: ["P2P", "Cryptography", "Byzantine Fault Tolerance", "DAG"],
    repo: "https://github.com/shaheerkhalid04/ANON",
    live: null,
  },
  {
    slug: "medisearch",
    name: "MediSearch",
    featured: false,
    tagline: "Symptom-based condition search",
    context: "AI Course Project · FCCU",
    summary:
      "A symptom checker that runs A*-style best-first search over a NetworkX knowledge graph, with edges weighted by symptom–condition co-occurrence across 1,000 simulated profiles.",
    detail:
      "A custom heuristic (edge weight × coverage ratio) stops high-frequency conditions from drowning out specific matches — validated on overlapping profiles like fever + fatigue, where flu vs. COVID ranked correctly. Shipped as a Flask web app with autocomplete symptom input, a top-5 ranked output, and a triage disclaimer.",
    role: "Team project — Shaheer Khalid & Rameen Zafar",
    tags: ["NetworkX", "A* / Best-First", "Flask", "Heuristic Search"],
    repo: "https://github.com/shaheerkhalid04/MediSearch",
    live: null,
  },
  {
    slug: "unipool",
    name: "UniPool",
    featured: false,
    tagline: "University carpooling app",
    context: "Software Engineering Project · FCCU",
    summary:
      "A carpooling platform for day-scholar students — Django REST, university-email-restricted auth, and the Google Maps API for real-time GPS tracking and ride matching.",
    detail:
      "Safety features came out of peer interviews rather than guesswork: an SOS button, gender-specific filters, and a dual driver/rider mode. Auth is restricted to university email addresses so the ride pool stays within the campus community.",
    role: "Team project — Shaheer Khalid & Rameen Zafar",
    tags: ["Django REST", "Google Maps API", "Auth", "GPS"],
    repo: null,
    live: null,
  },
];

export const skills = [
  {
    group: "Languages & frameworks",
    items: ["Python", "JavaScript", "React", "Next.js", "Node.js", "Django", "Django REST", "Flask", "SQL"],
  },
  {
    group: "AI & systems",
    items: ["RAG", "LLM APIs", "Vector databases", "NetworkX", "A* / Best-first search", "P2P systems", "Byzantine Fault Tolerance"],
  },
  {
    group: "Tools & platforms",
    items: ["Git", "GitHub", "VS Code", "PyCharm", "Postman", "Cursor", "PostgreSQL", "SQLite", "Supabase", "Vercel"],
  },
];

export const nav = [
  { label: "about", href: "#about" },
  { label: "projects", href: "#projects" },
  { label: "skills", href: "#skills" },
  { label: "contact", href: "#contact" },
];
