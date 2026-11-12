import Link from "next/link";
import { sectionIndex } from "@/data/site";
import { featuredProjects, projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectMedia } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { SharedMedia } from "@/components/scene/PageTransition";

const DIVE = ["enter-project"];

/**
 * Featured projects as large framed "screens" that swing into place while
 * scrolling. Add or reorder projects in src/data/projects.ts (`featured: true`).
 */
export function Portfolio() {
  const total = projects.filter((p) => !p.placeholder).length;
  return (
    <section id="portfolio" data-scene="2" aria-labelledby="portfolio-title" className="container-x py-24 md:py-36">
      <SectionHeading
        index={sectionIndex("portfolio")}
        label="Recent work"
        id="portfolio-title"
        title={
          <>
            From signal <span className="text-muted">to software</span>
          </>
        }
        aside={
          <p className="text-[1.0625rem] leading-relaxed text-muted">
            Selected work across Industrial IoT, enterprise software and robotics — from irrigation telemetry to
            platforms running daily operations.
          </p>
        }
      />

      <ol className="space-y-24 md:space-y-40">
        {featuredProjects.map((project, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={project.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
              <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                <Link
                  href={`/projects/${project.slug}`}
                  transitionTypes={DIVE}
                  aria-label={`View project: ${project.title}`}
                  className={`frame-3d group block ${flip ? "frame-3d-rev" : ""}`}
                >
                  <SharedMedia
                    slug={project.slug}
                    className="hud-frame rounded-[1.25rem] border border-signal/25 bg-stone p-1.5 shadow-[0_0_0_1px_rgb(255_59_48/0.06),0_40px_120px_-40px_rgb(255_59_48/0.35)] transition-colors duration-700 group-hover:border-signal/60"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[0.9rem] bg-stone-2">
                      <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
                        <ProjectMedia project={project} sizes="(min-width:1024px) 56vw, 100vw" />
                      </div>
                      {/* scanline sheen */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px)] bg-[size:100%_3px] mix-blend-overlay"
                      />
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(4_6_10/0.55))]" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-canvas/70 px-3 py-1 text-xs font-medium backdrop-blur">
                        {project.category}
                      </span>
                    </div>
                  </SharedMedia>
                </Link>
              </div>

              <Reveal className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                <p className="hud-label flex items-center gap-3">
                  <span className="signal-text">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-8 bg-line" />
                  <span>{project.year}</span>
                </p>
                <h3 className="title-xl mt-5 text-[clamp(2rem,3.6vw,3.4rem)]">
                  <Link href={`/projects/${project.slug}`} transitionTypes={DIVE} className="transition-colors duration-500 hover:text-signal">
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-muted">{project.summary}</p>
                {project.stack.length > 0 && (
                  <ul className="mt-6 flex max-w-md flex-wrap gap-1.5">
                    {project.stack.slice(0, 6).map((s) => (
                      <li key={s} className="chip !h-6 !px-2.5 !text-xs">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={`/projects/${project.slug}`} transitionTypes={DIVE} className="group mt-8 inline-flex items-center gap-2 text-sm font-medium">
                  <span className="link-underline">View project</span>
                  <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <Reveal className="mt-24 flex justify-center md:mt-32">
        <Link href="/projects" transitionTypes={DIVE} className="btn btn-light group">
          View all projects
          <span className="font-mono text-xs text-muted">({total})</span>
          <ArrowRight size={16} className="btn-icon-plain transition-transform duration-500" />
        </Link>
      </Reveal>
    </section>
  );
}
