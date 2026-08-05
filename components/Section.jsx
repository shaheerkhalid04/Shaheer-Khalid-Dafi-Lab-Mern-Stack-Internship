"use client";

import { motion } from "framer-motion";

export function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ path, cmd, accent = "green" }) {
  const accentClass = accent === "red" ? "text-red" : "text-green";
  return (
    <div className="mb-8 flex items-center gap-4">
      <p className="font-mono text-[13px] text-muted">
        <span className="text-muted">{path}</span>{" "}
        <span className={accentClass}>$</span> {cmd}
      </p>
      <span
        className={`h-px flex-1 ${
          accent === "red"
            ? "bg-gradient-to-r from-red/40 to-transparent"
            : "bg-gradient-to-r from-green/40 to-transparent"
        }`}
      />
    </div>
  );
}
