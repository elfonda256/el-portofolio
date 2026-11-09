"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, profile } from "@/data/site";
import { ArrowUpRight, Close, Menu } from "@/components/ui/Icons";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");

  // Elevate the bar once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = navigation.map((n) => n.href.split("#")[1]);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Close menu on route change / Escape; lock page scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === "/" ? active === `#${href.split("#")[1]}` : href === "/#portfolio" && pathname.startsWith("/projects");

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <nav
        aria-label="Main"
        className={`pointer-events-auto mx-auto flex max-w-[64rem] items-center justify-between rounded-full border py-2 pl-5 pr-2 transition-all duration-700 ease-[var(--ease-out-expo)] ${
          scrolled || open
            ? "border-line bg-surface/85 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            : "border-transparent bg-surface/60 backdrop-blur-md"
        }`}
      >
        <Link href="/#home" className="text-[1.0625rem] font-semibold tracking-[-0.03em]" aria-label={`${profile.name} — home`}>
          {profile.brand}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "true" : undefined}
                className={`relative rounded-full px-4 py-2 text-[0.9rem] transition-colors duration-300 ${
                  isActive(item.href) ? "bg-ink/[0.06] text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href="/#contact" className="btn btn-dark hidden !h-10 !px-4 text-sm sm:inline-flex">
            Let&apos;s collaborate
            <ArrowUpRight size={15} className="btn-icon" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full bg-ink text-canvas md:hidden"
          >
            {open ? <Close size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`pointer-events-auto mx-auto mt-2 max-w-[64rem] overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-lift)] transition-all duration-500 ease-[var(--ease-out-expo)] md:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <ul className="flex flex-col p-3">
          {navigation.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="flex items-baseline justify-between rounded-2xl px-4 py-3.5 text-2xl font-medium tracking-[-0.03em] hover:bg-canvas"
              >
                {item.label}
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-line p-3">
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="btn btn-dark w-full justify-center"
          >
            Let&apos;s collaborate <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
