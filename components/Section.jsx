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

export function SectionLabel({ path, cmd }) {
  return (
    <p className="mb-8 font-mono text-[13px] text-muted">
      <span className="text-muted">{path}</span>{" "}
      <span className="text-green">$</span> {cmd}
    </p>
  );
}
