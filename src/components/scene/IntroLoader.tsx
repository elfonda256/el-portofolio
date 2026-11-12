"use client";

import { useEffect, useRef, useState } from "react";

const LINES = ["Powering field station", "Acquiring signal", "Syncing telemetry", "Uplink to cloud"];

/**
 * Opening count-up, shown once per browser session. Hidden by CSS when JS is
 * off, when it has already played, or when the visitor prefers reduced motion.
 */
export function IntroLoader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getComputedStyle(el).display === "none") return;

    document.documentElement.style.overflow = "hidden";
    let ready = false;
    const onReady = () => (ready = true);
    window.addEventListener("fieldscene:ready", onReady);

    const start = performance.now();
    const MIN = 1700;
    const MAX = 4500;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      // ease towards 92 while loading, then finish once the scene is ready
      const base = Math.min(1, elapsed / MIN);
      const eased = 1 - Math.pow(1 - base, 3);
      const canFinish = (ready && elapsed > MIN) || elapsed > MAX;
      const value = canFinish ? 100 : Math.min(92, Math.round(eased * 92));
      setN(value);
      if (value >= 100) {
        setTimeout(() => {
          setDone(true);
          document.documentElement.style.overflow = "";
          try {
            sessionStorage.setItem("intro-seen", "1");
          } catch {}
        }, 260);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("fieldscene:ready", onReady);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const line = LINES[Math.min(LINES.length - 1, Math.floor((n / 100) * LINES.length))];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`intro-loader fixed inset-0 z-[90] flex-col justify-between bg-canvas p-5 md:p-10 ${done ? "is-done" : ""}`}
    >
      <div className="flex items-start justify-between">
        <span className="hud-label">Field to Cloud</span>
        <span className="hud-label hidden sm:inline">Karawang · ID</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="hud-label mb-3 flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-signal" />
            {line}
          </p>
          <div className="h-px w-[min(60vw,22rem)] bg-line">
            <div className="h-px bg-signal transition-[width] duration-150" style={{ width: `${n}%` }} />
          </div>
        </div>
        <span className="title-xl tabular-nums text-[clamp(6rem,22vw,16rem)] leading-[0.78] text-ink">
          {String(n).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
