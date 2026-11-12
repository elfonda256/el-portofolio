import { cv, profile } from "@/data/site";
import { ArrowRight, Download, MapPin } from "@/components/ui/Icons";

/** Staggered letter-by-letter rise for the oversized name. */
function RevealWord({ word, baseDelay = 200 }: { word: string; baseDelay?: number }) {
  return (
    <span aria-hidden="true" className="inline-flex">
      {word.split("").map((ch, i) => (
        <span key={i} className="inline-block [clip-path:inset(-0.1em_-0.1em)]">
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
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section
      id="home"
      data-scene="0"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-end pb-10 pt-28 md:pb-14"
    >
      {/* HUD readouts */}
      <div aria-hidden="true" className="container-x pointer-events-none absolute inset-x-0 top-24 hidden justify-between md:flex">
        <div className="animate-fade space-y-1.5 [animation-delay:1200ms]">
          <p className="hud-label">Scan 01 · Field</p>
          <p className="hud-label text-white/30">Lidar · 16 ch · 360°</p>
        </div>
        <div className="animate-fade space-y-1.5 text-right [animation-delay:1300ms]">
          <p className="hud-label">{profile.location}</p>
          <p className="hud-label text-white/30">Telemetry · Robotics · Software</p>
        </div>
      </div>

      <div className="container-x relative">
        <h1 id="hero-title">
          <span className="sr-only">
            {profile.name} — {profile.title}
          </span>
          <span className="title-xl block select-none text-[clamp(6.5rem,26vw,26rem)] text-ink [text-shadow:0_0_80px_rgb(127_227_255/0.18)]">
            <RevealWord word={profile.firstName.toUpperCase()} />
          </span>
          <span
            aria-hidden="true"
            className="title-xl title-thin mt-2 block animate-fade text-[clamp(1.6rem,4.6vw,4.25rem)] tracking-[0.04em] text-white/70 [animation-delay:700ms]"
          >
            {rest.join(" ") || first}
          </span>
        </h1>

        <div className="mt-10 grid animate-fade gap-8 [animation-delay:1000ms] md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-xl">
            <p className="text-[clamp(1.25rem,2vw,1.6rem)] font-medium leading-snug tracking-[-0.02em]">
              {profile.title}
            </p>
            <p className="mt-3 font-mono text-[0.75rem] uppercase leading-relaxed tracking-[0.08em] text-muted">
              {profile.focus.join(" · ")}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted md:hidden">
              <MapPin size={14} /> {profile.location}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#portfolio" className="btn btn-dark">
              View work <ArrowRight size={16} className="btn-icon-plain transition-transform duration-500" />
            </a>
            {cv.href && (
              <a href={cv.href} download className="btn btn-light">
                <Download size={17} /> {cv.label}
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-line pt-5 text-sm text-muted">
          <Availability />
          <a href="#intro" className="group hidden items-center gap-3 hover:text-ink sm:inline-flex">
            Scroll to explore
            <span className="relative h-8 w-[1px] overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-signal" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export { Availability };
