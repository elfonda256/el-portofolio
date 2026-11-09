import Image from "next/image";
import { profile } from "@/data/site";
import { MapPin } from "@/components/ui/Icons";

/** Staggered letter-by-letter rise for the oversized name. */
function RevealWord({ word, baseDelay = 200 }: { word: string; baseDelay?: number }) {
  return (
    <span aria-hidden="true" className="inline-flex">
      {word.split("").map((ch, i) => (
        <span key={i} className="inline-block pb-[0.04em] [clip-path:inset(0_-0.3em)]">
          <span className="inline-block animate-rise" style={{ animationDelay: `${baseDelay + i * 70}ms` }}>
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

function Availability({ className = "" }: { className?: string }) {
  if (!profile.availability.open) return null;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-live" />
      </span>
      {profile.availability.label}
    </span>
  );
}

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="container-x pt-[5.25rem] md:pt-[6.5rem]">
      <div className="relative isolate h-[min(78svh,46rem)] min-h-[32rem] overflow-hidden rounded-[2rem] bg-stone md:h-[min(calc(100svh-8.5rem),52rem)] md:min-h-[36rem] md:rounded-[2.5rem]">
        {/* soft light behind the figure */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(60%_60%_at_50%_100%,#ffffff_0%,rgba(255,255,255,0)_70%)]"
        />

        {/* Oversized name — sits BEHIND the portrait */}
        <h1 id="hero-title" className="absolute inset-x-0 top-[9%] z-0 text-center md:top-[7%]">
          <span className="sr-only">
            {profile.name} — {profile.title}
          </span>
          <span className="display block select-none text-[clamp(5.25rem,24vw,22rem)] leading-[0.82] tracking-[-0.065em] text-ink">
            <RevealWord word={profile.firstName} />
          </span>
        </h1>

        {/* Handwritten greeting */}
        <div
          aria-hidden="true"
          className="absolute left-[7%] top-[3.5%] z-20 flex animate-fade items-end gap-1 [animation-delay:900ms] md:left-[9%] md:top-[4%]"
        >
          <span className="-rotate-6 font-hand text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none text-ink">{profile.greeting}</span>
          <svg width="46" height="34" viewBox="0 0 46 34" fill="none" className="mb-[-14px] hidden sm:block">
            <path d="M3 4c10 1 22 6 30 18" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M27 21l7 3 1-8" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Portrait cut-out — overlaps the name */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex h-[88%] animate-fade justify-center [animation-delay:500ms] [animation-duration:1.6s] md:h-[80%]">
          <Image
            src={profile.portrait.cutout}
            alt={profile.portrait.alt}
            width={548}
            height={718}
            priority
            sizes="(min-width: 768px) 520px, 80vw"
            className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_40px_rgba(23,23,23,0.12)]"
          />
        </div>

        {/* Bottom info — desktop */}
        <div className="absolute inset-x-0 bottom-0 z-20 hidden items-end justify-between gap-6 p-9 xl:flex">
          <div className="max-w-[17rem] animate-fade [animation-delay:1100ms]">
            <p className="eyebrow mb-2">Elfano Sultan Syahbana</p>
            <p className="text-[1.375rem] font-medium leading-tight tracking-[-0.03em]">{profile.title}</p>
          </div>
          <div className="flex max-w-[17rem] animate-fade flex-col items-end gap-3 text-right [animation-delay:1250ms]">
            <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.06em] text-ink/70">
              {profile.focus.join(" · ")}
            </p>
            <p className="inline-flex items-center gap-1.5 text-sm text-ink/80">
              <MapPin size={14} /> {profile.location}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom info — mobile & tablet, below the stage */}
      <div className="mt-5 flex animate-fade flex-col gap-3 [animation-delay:1100ms] md:mt-7 md:flex-row md:items-end md:justify-between xl:hidden">
        <p className="text-2xl font-medium leading-tight tracking-[-0.03em]">{profile.title}</p>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">{profile.focus.join(" · ")}</p>
        <p className="inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} /> {profile.location}
        </p>
      </div>

      <div className="mt-6 hidden items-center justify-between text-sm text-muted md:flex">
        <Availability />
        <a href="#intro" className="group inline-flex items-center gap-3 hover:text-ink">
          Scroll to explore
          <span className="relative h-8 w-[1px] overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-ink" />
          </span>
        </a>
      </div>
    </section>
  );
}

export { Availability };
