"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/data/types";
import { ArrowLeft, ArrowRight, Close } from "./Icons";

interface GalleryProps {
  photos: readonly Photo[];
  /** "grid" = captioned masonry for project pages, "thumbs" = small row for the timeline. */
  variant?: "grid" | "thumbs";
  className?: string;
}

/**
 * Photo gallery with a lightweight lightbox (native <dialog>: Esc, focus trap).
 * Each photo is a real link to the image file, so it still works without JS.
 */
export function Gallery({ photos, variant = "grid", className = "" }: GalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let new-tab clicks through
    e.preventDefault();
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    dlg.addEventListener("keydown", onKey);
    dlg.addEventListener("close", onClose);
    return () => {
      dlg.removeEventListener("keydown", onKey);
      dlg.removeEventListener("close", onClose);
    };
  }, [step]);

  const current = index === null ? null : photos[index];

  return (
    <>
      {variant === "grid" ? (
        <ul className={`flex flex-col gap-x-5 gap-y-8 sm:flex-row sm:flex-wrap ${className}`}>
          {photos.map((p, i) => {
            const ratio = p.width / p.height;
            return (
              <li
                key={p.src}
                className="min-w-0"
                style={{ flexGrow: ratio, flexBasis: `${ratio * 15}rem` }}
              >
                <figure>
                  <a
                    href={p.src}
                    onClick={open(i)}
                    className="group relative block overflow-hidden rounded-[1.25rem] bg-stone"
                    style={{ aspectRatio: `${p.width} / ${p.height}` }}
                    aria-label={`Open photo: ${p.caption}`}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(min-width:1024px) 45vw, (min-width:640px) 60vw, 100vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                    />
                  </a>
                  <figcaption className="mt-3 px-1 text-sm leading-snug text-muted">{p.caption}</figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className={`flex flex-wrap gap-2.5 ${className}`}>
          {photos.map((p, i) => (
            <li key={p.src}>
              <a
                href={p.src}
                onClick={open(i)}
                title={p.caption}
                aria-label={`Open photo: ${p.caption}`}
                className="group relative block h-20 w-28 overflow-hidden rounded-xl bg-stone ring-1 ring-line transition-shadow duration-500 hover:shadow-[var(--shadow-soft)] sm:h-24 sm:w-32"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="128px"
                  style={p.position ? { objectPosition: p.position } : undefined}
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                />
              </a>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        aria-label={current?.caption ?? "Photo"}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-[#171717]/90 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div
            className="flex h-full flex-col items-center justify-center gap-4 p-4 md:p-10"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div className="relative flex max-h-[78svh] w-full max-w-5xl justify-center">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="(min-width:1024px) 1024px, 100vw"
                className="h-auto max-h-[78svh] w-auto max-w-full animate-page rounded-2xl object-contain"
              />
            </div>
            <div className="flex w-full max-w-5xl items-center justify-between gap-4 text-[#fafaf9]">
              <p className="text-sm leading-snug md:text-[0.9375rem]">{current.caption}</p>
              <div className="flex shrink-0 items-center gap-2">
                {photos.length > 1 && (
                  <>
                    <span className="mr-1 font-mono text-xs text-white/60">
                      {(index ?? 0) + 1} / {photos.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous photo"
                      className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:border-white/70"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next photo"
                      className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:border-white/70"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="grid size-10 place-items-center rounded-full bg-[#fafaf9] text-[#171717]"
                >
                  <Close size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
