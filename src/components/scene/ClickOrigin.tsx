"use client";

import { useEffect } from "react";

/**
 * Prepares the "dimension jump" page transition:
 * - remembers where the visitor pressed, so the signal rings radiate from there
 * - gives only the clicked project's image a view-transition-name, so it alone
 *   morphs into the project page while the rest of the page dives away
 */
export function ClickOrigin() {
  useEffect(() => {
    const root = document.documentElement;
    const setOrigin = (x: number, y: number) => {
      root.style.setProperty("--vt-x", `${Math.round(x)}px`);
      root.style.setProperty("--vt-y", `${Math.round(y)}px`);
    };
    const onDown = (e: PointerEvent) => setOrigin(e.clientX, e.clientY);
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link) return;
      if (e.detail === 0) {
        // keyboard activation — radiate from the link itself
        const r = link.getBoundingClientRect();
        setOrigin(r.left + r.width / 2, r.top + r.height / 2);
      }
      document.querySelectorAll<HTMLElement>("[data-vt-name][data-vt-armed]").forEach((el) => {
        el.style.viewTransitionName = "";
        el.removeAttribute("data-vt-armed");
      });
      const media =
        link.querySelector<HTMLElement>("[data-vt-name]") ??
        link.closest("li, article")?.querySelector<HTMLElement>("[data-vt-name]");
      if (media && !media.style.viewTransitionName) {
        media.style.viewTransitionName = media.dataset.vtName ?? "";
        media.style.setProperty("view-transition-class", "dim-morph");
        media.setAttribute("data-vt-armed", "");
      }
    };
    window.addEventListener("pointerdown", onDown, { passive: true, capture: true });
    window.addEventListener("click", onClick, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onDown, { capture: true });
      window.removeEventListener("click", onClick, { capture: true });
    };
  }, []);
  return null;
}
