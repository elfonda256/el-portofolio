import { sectionIndex } from "@/data/site";
import Image from "next/image";
import { featuredVideo, youtubeChannel } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight, Play, YouTube } from "@/components/ui/Icons";

export function LatestContent() {
  const v = featuredVideo;
  const isPlaceholder = !v.youtubeId;
  const watchUrl = isPlaceholder ? youtubeChannel || null : `https://www.youtube.com/watch?v=${v.youtubeId}`;

  return (
    <section id="content" aria-labelledby="content-title" className="container-x py-20 md:py-28">
      <SectionHeading index={sectionIndex("content")} label="Blog & video" id="content-title" title="Latest Content" />

      <div className="grid items-end gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        <Reveal>
          <a
            href={watchUrl ?? undefined}
            {...(watchUrl ? { target: "_blank", rel: "noopener noreferrer" } : { "aria-disabled": true })}
            className={`group relative block aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink ${
              watchUrl ? "" : "cursor-default"
            }`}
          >
            {isPlaceholder ? (
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]">
                {/* placeholder thumbnail: fine grid + scanline, no fake footage */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_70%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
                <p className="absolute bottom-6 left-6 font-hand text-3xl text-white/80 md:bottom-8 md:left-8 md:text-5xl">
                  coming soon
                </p>
              </div>
            ) : (
              <Image
                src={`https://i.ytimg.com/vi/${v.youtubeId}/maxresdefault.jpg`}
                alt={v.title}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
              />
            )}
            <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-ink shadow-[var(--shadow-lift)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 md:size-24">
              <Play size={26} className="ml-1" />
            </span>
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur md:left-6 md:top-6">
              <YouTube size={14} /> {isPlaceholder ? "Placeholder" : "YouTube"}
            </span>
          </a>
        </Reveal>

        <Reveal delay={120} className="lg:pb-4">
          <p className="eyebrow mb-4">{isPlaceholder ? "Featured video · not yet published" : `Featured video${v.date ? ` · ${v.date}` : ""}`}</p>
          <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{v.title}</h3>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{v.description}</p>
          {watchUrl ? (
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-8">
              Watch on YouTube <ArrowUpRight size={16} className="btn-icon" />
            </a>
          ) : (
            <span className="btn btn-light mt-8 cursor-not-allowed text-muted" aria-disabled="true">
              Watch on YouTube — soon
            </span>
          )}
        </Reveal>
      </div>
    </section>
  );
}
