"use client";
import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function update() {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setPct(Math.min(100, Math.max(0, scrolled * 100)));
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100 }} aria-hidden="true">
      <div style={{ height: "100%", background: "var(--red)", width: `${pct}%`, transition: "width .1s linear" }} />
    </div>
  );
}
