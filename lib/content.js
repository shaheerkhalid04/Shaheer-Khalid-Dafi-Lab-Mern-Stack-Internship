// ─────────────────────────────────────────────────────────────
//  Edit everything about the site's content here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Shaheer Khalid",
  role: "CS student · AI/ML · cybersecurity",
  location: "Lahore, Pakistan",
  email: "shaheerkhalid1404@gmail.com",
  github: "https://github.com/shaheerkhalid04",
  linkedin: "https://www.linkedin.com/in/shaheerkhalid004/",
  resume: "/Shaheer_Khalid_Resume.pdf",
  tagline:
    "Computer Science student building AI systems that stay grounded — LLM agents, RAG pipelines, and the security thinking that keeps them honest.",
};

export const about = {
  paragraphs: [
    "I'm a BSc (Hons) Computer Science student at Forman Christian College University, graduating December 2027. My work sits where applied AI meets systems security: retrieval pipelines that refuse to answer without evidence, agents that call real tools instead of faking it, and auth flows built to survive someone actually attacking them.",
    "Software that actually ships — not demos that work once on my laptop. That means measured latency, grounded outputs, rate limits, and threat models. Most of what I build lives in Python and TypeScript, with vector databases and LLM APIs underneath, and I keep coming back to the parts of a system where correctness genuinely matters: retrieval, authentication, cryptography, and consensus.",
  ],
  facts: [
    { k: "education", v: "BSc (Hons) CS — FCCU, grad Dec 2027" },
    { k: "focus", v: "AI / ML · RAG & agents · cybersecurity" },
    { k: "stack", v: "Python · TypeScript · Next.js · FastAPI" },
    { k: "location", v: "Lahore, Pakistan" },
  ],
};

// Only NESPAK carries dates — the rest run concurrently, so dates would just read as noise.
export const experience = [
  {
    role: "Software Engineer Intern",
    org: "NESPAK",
    orgFull: "National Engineering Services Pakistan (Pvt) Limited",
    period: "Jul 2026 — Present",
    mode: "On-site · Lahore",
    blurb:
      "Software engineering across IT infrastructure and internal tooling, working on problem-solving in a large engineering organisation.",
  },
  {
    role: "Machine Learning Intern",
    org: "FlyRank AI",
    mode: "Remote",
    blurb:
      "ML capstone on search ranking and discoverability — framing the problem, engineering features without leakage, and beating a rules baseline with tree models (precision ~0.24 → ~0.74).",
  },
  {
    role: "Artificial Intelligence Intern",
    org: "Spiral Lab",
    mode: "Remote",
    blurb:
      "Applied AI work on neural networks and LLM evaluation, including a side-by-side summarisation benchmark across five models scored for accuracy and hallucination.",
  },
  {
    role: "IT & Networking Intern",
    org: "NASTP Institute of Information Technology",
    mode: "On-site · Lahore",
    blurb:
      "IT operations and network security — the hands-on side of how infrastructure is configured, segmented, and defended.",
  },
  {
    role: "MERN Stack Intern",
    org: "Dafi Labs",
    mode: "Remote",
    blurb:
      "Full-stack web applications with MongoDB, Express, React, and Node — feature development, API integration, and bug fixes in a collaborative agile team.",
  },
  {
    role: "Teaching Assistant",
    org: "Forman Christian College University",
    mode: "On-site",
    blurb:
      "Mentor undergraduates in Python, algorithms, and OOP. I write and grade quizzes and labs, and run vivas that test whether students can explain their reasoning rather than reproduce an answer.",
  },
  {
    role: "Director of Operations",
    org: "FCSC — Forman Computer Science Club",
    mode: "On-site",
    blurb:
      "Run day-to-day club operations and coordinate workshops, hackathon teams, and technical speaker events for the FCCU CS community.",
  },
];

export const projectFilters = [
  { id: "all", label: "all" },
  { id: "ai", label: "ai / ml" },
  { id: "security", label: "security" },
  { id: "fullstack", label: "full-stack" },
];

// Order = homepage priority.
export const projects = [
  {
    slug: "vaultline",
    name: "vaultline",
    featured: true,
    category: "fullstack",
    tagline: "Edge validated file vault",
    context: "Personal build",
    summary:
      "A file manager on Supabase Storage where the client never decides whether an upload is allowed. A Deno edge function re-reads every object server side, and anything it refuses is deleted before a metadata row can exist.",
    detail:
      "Validating an upload in the browser validates nothing, since whatever sends the request can lie about size and type. So the client only moves bytes: Python or the web app puts the object in the bucket, then calls the edge function, which downloads what actually arrived using the service role key, measures the real size, and matches magic bytes against the declared extension. A text file renamed to .pdf is caught there, not at the extension check. The function derives what the client cannot be trusted for, the sha256, the mime type and a category, writes the metadata row itself, and removes the object if any check fails, so no object outlives its row and no row describes bytes nobody verified. Downloads re-hash the file and compare it to the stored checksum. Replacing a file keeps the same object path so existing signed URLs stay valid, and updates the row rather than duplicating it. The Next.js front end keeps the service role key in route handlers, so the browser talks to the app and only the app talks to Supabase. The same operations run from a terminal client.",
    role: "Solo build",
    tags: ["Supabase", "Deno Edge Functions", "PostgreSQL", "Next.js 16", "Python", "Tailwind v4"],
    repo: "https://github.com/shaheerkhalid04/vaultline",
    live: "https://vaultline-ivory.vercel.app",
  },
  {
    slug: "plotpilot",
    name: "PlotPilot",
    featured: true,
    category: "fullstack",
    tagline: "Property data pipeline",
    context: "Personal build",
    summary:
      "An n8n workflow that scrapes Zameen.com property listings on a schedule, converts Pakistani price and area units into numbers you can model on, and appends them to Google Sheets without ever writing the same listing twice.",
    detail:
      "The cleaning is the project. Prices arrive as \"3.7 Crore\" and areas as \"1.1 Kanal\" or \"240 Sq. Yd.\", so a Code node turns them into 37000000 and 4950 square feet while keeping the published text in its own column, one to sort on and one to read. Zameen prints its location trail narrowest first, \"Raiwind Road, Lahore, Punjab\", so the city is the last part once the province falls away, which only surfaced by testing the parser against live pages instead of assumptions. Deduplication is a djb2 fingerprint of URL and title, checked against the sheet before the append, so re-running the workflow adds nothing. Listings missing a title or a parsable price are routed to a parking node rather than polluting the dataset. A read-only Next.js dashboard reads the same sheet through a service account and falls back to the committed sample export when no credentials are present.",
    role: "Solo build",
    tags: ["n8n", "Web Scraping", "Google Sheets API", "Next.js", "Data Cleaning"],
    repo: "https://github.com/shaheerkhalid04/n8n-property-workflow",
    live: "https://plotpilot-app.vercel.app",
  },
  {
    slug: "dispatch",
    name: "Dispatch",
    featured: true,
    category: "ai",
    tagline: "Autonomous newsdesk",
    context: "Personal build",
    summary:
      "A three-agent crew that finds the day's stories, edits them into a briefing, and files it to Slack and Google Sheets every six hours. Nobody presses anything.",
    detail:
      "CrewAI installs to 670 MB, well past Vercel's 250 MB function ceiling, so the same four tools are driven by two runners: the full agent crew on GitHub Actions, and a TypeScript edge runner on Vercel cron. Google Sheets is the datastore rather than a second database, and both runners fingerprint headlines against it before summarising, so overlapping schedules never publish the same story twice. Groq's free tier shaped the rest. Articles move between tools through a shared run buffer instead of the agents' context window, which took a hard 413 down to a few hundred tokens, and the agents reason on a smaller model so orchestration does not spend the briefing's daily budget.",
    role: "Solo build",
    tags: ["CrewAI", "Groq", "Slack API", "Google Sheets", "Next.js 16", "Vercel Cron"],
    repo: "https://github.com/shaheerkhalid04/ai-automation-news-bot",
    live: "https://dispatch-newsdesk.vercel.app",
  },
  {
    slug: "attune",
    name: "Attune",
    featured: true,
    category: "ai",
    tagline: "RAG voice assistant",
    context: "Personal build",
    summary:
      "A voice assistant that answers only from your own documents. Ask out loud, get an answer backed by retrieved passages — and when the documents don't cover it, it says so instead of guessing.",
    detail:
      "The trick is where retrieval happens. Vapi's assistant is configured with a custom LLM pointed at my own endpoint, so every turn arrives as an OpenAI-shaped chat-completions request. Retrieval runs inside that call and the passages are injected before generation, which means there is no code path where the model can answer ungrounded. Pinecone serverless supplies both the vectors and the hosted embeddings; Groq streams the response back as SSE for Vapi to speak. No orchestration framework — the whole deployment stays under 250 MB.",
    role: "Solo build",
    tags: ["Vapi", "Pinecone", "Groq", "FastAPI", "Next.js", "WebRTC"],
    repo: "https://github.com/shaheerkhalid04/realtime-rag-voice-ai-agent",
    live: "https://realtime-rag-voice-assistant.vercel.app",
  },
  {
    slug: "archivist",
    name: "Archivist",
    featured: true,
    category: "ai",
    tagline: "Adaptive RAG knowledge agent",
    context: "Personal build",
    summary:
      "Upload documents, ask questions, get answers with inline citations back to the exact source chunk and a grounding score — plus a lab for testing how embedding dimensions change retrieval quality.",
    detail:
      "Deliberately no LangChain: the pipeline is ~600 lines of explicit Python I can actually debug. Two constraints shaped the design. Pinecone serverless can't delete by metadata filter, so chunks are keyed {doc_id}#{n} and a document's vectors get listed by prefix and removed exactly. And an index holds one fixed dimension, so every embedding width gets its own index. The audit pass uses a larger judge model — anything under ~20B scored a fully faithful answer 0/100 and quoted the sources back as unsupported claims.",
    role: "Solo build",
    tags: ["RAG", "Pinecone", "Groq", "FastAPI", "Next.js", "React 19"],
    repo: "https://github.com/shaheerkhalid04/RAG-Knowledge-Agent",
    live: "https://rag-knowledge-agent-omega.vercel.app",
  },
  {
    slug: "kanvas",
    name: "Kanvas",
    featured: true,
    category: "fullstack",
    tagline: "Task board synced across four clients",
    context: "MERN Stack Internship · Dafi Labs",
    summary:
      "One task board, four clients — web, Chrome extension, Android, and desktop — staying in sync in real time, with an HTML Canvas sketch pad on every card.",
    detail:
      "Hub-and-spoke around Supabase. The realtime WebSocket goes browser → Supabase directly and never touches Vercel, because serverless functions are per-request and can't hold a connection open. Security rests entirely on Postgres Row-Level Security, which is what makes it safe to ship the same API key inside a Chrome extension and an Android build. All four clients write to three shared tables and subscribe to one Realtime channel.",
    role: "Solo build",
    tags: ["Supabase", "Next.js 16", "React Native", "Tauri", "Manifest V3", "RLS"],
    repo: "https://github.com/shaheerkhalid04/kanva-task-board",
    live: "https://kanva-task-board.vercel.app",
  },
  {
    slug: "voice-agent",
    name: "Real-Time Voice AI Agent",
    featured: false,
    category: "ai",
    tagline: "Speech-to-speech agent with tool calling",
    context: "Personal build",
    summary:
      "Speak, and the agent transcribes, reasons with tools, and talks back — hands-free, with every stage of the pipeline timed on screen so you can see exactly where latency comes from.",
    detail:
      "The pipeline runs Whisper on Groq for transcription, a Llama 3.3-70B tool-calling loop for reasoning, and ElevenLabs for speech. Each leg is measured and surfaced in the UI rather than hidden, which turns tuning into a data problem instead of guesswork. The browser app draws live waveforms and takes turns automatically on silence detection; a terminal variant does the same thing over the keyboard. Four built-in tools (time, weather, Wikipedia, safe arithmetic) work without extra credentials.",
    role: "Solo build",
    tags: ["Groq Whisper", "Llama 3.3", "ElevenLabs", "FastAPI", "Web Audio API"],
    repo: "https://github.com/shaheerkhalid04/Real-Time-Voice-AI-Agent",
    live: "https://real-time-voice-ai-agent-two.vercel.app",
  },
  {
    slug: "video-transcriber",
    name: "AI Video Transcriber",
    featured: false,
    category: "ai",
    tagline: "Agent that finds and transcribes videos",
    context: "Personal build",
    summary:
      "Give it a topic and it searches YouTube, picks a video, and transcribes it — real tool calling, not a scripted sequence pretending to be an agent.",
    detail:
      "Groq acts as the reasoning brain deciding which tool to invoke, SerpApi handles search, and Gemini does the multimodal transcription. The interesting part is the safety layer: the agent can only transcribe a URL it actually found through search, which closes the obvious failure mode where a model invents a plausible-looking video link and confidently transcribes nothing. Transcripts are saved locally with source attribution for traceability.",
    role: "Solo build",
    tags: ["Groq", "Tool calling", "SerpApi", "Gemini", "Flask"],
    repo: "https://github.com/shaheerkhalid04/ai-video-transcribing",
    live: "https://ai-video-transcribing.vercel.app",
  },
  {
    slug: "recall",
    name: "Recall",
    featured: false,
    category: "ai",
    tagline: "Chatbot with persistent memory",
    context: "Personal build",
    summary:
      "A chatbot that remembers you between sessions. It extracts durable facts from conversation, stores them, and reinjects them later — close the app, reopen it tomorrow, and it still knows.",
    detail:
      "Memory is split into six buckets (identity, preferences, location, work, interests, goals) and the handler decides per fact whether it's an ADD or an UPDATE by comparing against what's already stored. Recall is round-robin across categories rather than global, so a keyword mismatch in one bucket can't starve the others of context. It stores durable facts only — small talk and hypotheticals are deliberately excluded. The core extraction is about 80 lines with no extra dependencies.",
    role: "Solo build",
    tags: ["Streamlit", "Groq", "Gemini", "SQLite", "Mem0", "pytest"],
    repo: "https://github.com/shaheerkhalid04/persistent-memory-chatbot",
    live: "https://recall-memory-chatbot.streamlit.app",
  },
  {
    slug: "image-generator",
    name: "Image Generator",
    featured: false,
    category: "ai",
    tagline: "Chainlit chat that draws",
    context: "Personal build",
    summary:
      "Describe a picture and it appears in the chat, with no API key, account or billing anywhere. Built to learn Chainlit's decorator model by comparing it against Streamlit on the same idea.",
    detail:
      "Chainlit is event driven where Streamlit re-runs the script top to bottom, so the whole app is callbacks registered by decorator with no render loop at all. Gemini was the obvious backend and turned out to be unusable: every one of its image models is paid tier only, so a free key cannot produce a single image. Rendering moved to a keyless endpoint, where two things had to be measured rather than assumed. Its model parameter is a no-op, since three different values return byte-identical output, so there is deliberately no model selector. Its seed parameter does work and is reproducible, which is what lets Regenerate draw a fresh take while Render larger holds the seed and returns the same picture with more pixels. It also answers 200 with an empty body often enough to matter, which raise_for_status lets straight through, so responses are checked against image magic numbers before being written.",
    role: "Solo build",
    tags: ["Chainlit", "Python", "asyncio", "httpx", "Docker"],
    repo: "https://github.com/shaheerkhalid04/image-generator",
    live: null,
  },
  {
    slug: "llm-comparison",
    name: "LLM Comparison",
    featured: false,
    category: "ai",
    tagline: "Summarisation benchmark across five models",
    context: "AI Internship · Spiral Lab",
    summary:
      "Sends the same document to five free models through one gateway and lays the summaries side by side, scored on quality, accuracy, conciseness, and hallucination.",
    detail:
      "A single OpenRouter key fans the identical prompt out to GPT-OSS, Gemma, Nemotron, Hunyuan, and Cohere, then stores each output separately and generates comparison artifacts for manual scoring on a 1–5 scale. Keeping the prompt and document fixed is the whole point — it isolates the model as the only variable, which is what makes the hallucination column meaningful rather than anecdotal.",
    role: "Solo build",
    tags: ["Python", "OpenRouter", "LLM evaluation", "Benchmarking"],
    repo: "https://github.com/shaheerkhalid04/LLM-Comparison-Spiral-Lab",
    live: null,
  },
  {
    slug: "notemate",
    name: "NoteMate",
    featured: false,
    category: "ai",
    tagline: "AI study assistant",
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
    category: "security",
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
    category: "ai",
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
    category: "fullstack",
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
    group: "AI & machine learning",
    items: ["RAG pipelines", "LLM agents & tool calling", "Vector embeddings", "Pinecone", "Groq", "Gemini", "scikit-learn", "Model evaluation"],
  },
  {
    group: "Security & systems",
    items: ["Auth & session design", "Rate limiting", "Row-Level Security", "Cryptography", "Byzantine Fault Tolerance", "Network security", "Threat modelling"],
  },
  {
    group: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "SQL", "Rust"],
  },
  {
    group: "Frameworks & platforms",
    items: ["Next.js", "React", "FastAPI", "Django REST", "Node.js", "Express", "Tailwind", "Supabase", "PostgreSQL", "Vercel"],
  },
];

export const nav = [
  { label: "about", href: "#about" },
  { label: "experience", href: "#experience" },
  { label: "projects", href: "#projects" },
  { label: "skills", href: "#skills" },
  { label: "contact", href: "#contact" },
];
