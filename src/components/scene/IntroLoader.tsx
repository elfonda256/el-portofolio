"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Opening start sequence: five red lights come on one by one, then go out
 * together and the page appears. Shown once per browser session; hidden by CSS
 * when JS is off, when it has already played, or with reduced motion.
 */
export function IntroLoader() {
  const [lit, setLit] = useState(0); // 0..5
  const [out, setOut] = useState(false);
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
    const STEP = 420;
    const MAX = 5200;
    let raf = 0;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setOut(true);
      setTimeout(() => {
        setDone(true);
        document.documentElement.style.overflow = "";
        try {
          sessionStorage.setItem("intro-seen", "1");
        } catch {}
      }, 520);
    };
    const tick = (now: number) => {
      const t = now - start;
      const n = Math.min(5, Math.floor(t / STEP));
      setLit(n);
      // hold all five, then lights out once the circuit has rendered
      if ((n === 5 && ready && t > 5 * STEP + 500) || t > MAX) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("fieldscene:ready", onReady);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`intro-loader fixed inset-0 z-[90] flex-col items-center justify-center bg-canvas p-5 md:p-10 ${done ? "is-done" : ""}`}
    >
      <div className="absolute inset-x-5 top-5 flex justify-between md:inset-x-10 md:top-10">
        <span className="hud-label">Night session</span>
        <span className="hud-label hidden sm:inline">Karawang · ID</span>
      </div>

      {/* start gantry */}
      <div className="flex gap-2.5 rounded-xl border border-white/10 bg-[#0b0c0f] p-3 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] sm:gap-4 sm:p-4">
        {[0, 1, 2, 3, 4].map((i) => {
          const on = !out && lit > i;
          return (
            <div key={i} className="flex flex-col gap-2 rounded-lg bg-black/60 p-1.5 sm:gap-3 sm:p-2">
              {[0, 1].map((row) => (
                <span
                  key={row}
                  className={`block size-7 rounded-full transition-[background-color,box-shadow] duration-100 sm:size-11 ${
                    on && row === 1
                      ? "bg-[#ff2a20] shadow-[0_0_24px_6px_rgb(255_42_32/0.55)]"
                      : "bg-[#1a1b1f]"
                  }`}
                />
              ))}
            </div>
          );
        })}
      </div>

      <p className={`title-xl mt-10 text-[clamp(1.6rem,5vw,3.25rem)] transition-opacity duration-200 ${out ? "opacity-100" : "opacity-0"}`}>
        Lights out
      </p>
      <p className="hud-label absolute bottom-5 md:bottom-10">{out ? "Go" : lit < 5 ? "Formation lap" : "Hold"}</p>
    </div>
  );
}
