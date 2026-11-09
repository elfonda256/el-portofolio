import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { ProjectMedia } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

type Params = { slug: string };

const published = projects.filter((p) => !p.placeholder);

export function generateStaticParams(): Params[] {
  return published.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.placeholder) notFound();

  const index = published.findIndex((p) => p.slug === project.slug);
  const next = published[(index + 1) % published.length];

  const facts = [
    { label: "Category", value: project.category },
    { label: "Year", value: project.year },
    project.role && { label: "Role", value: project.role },
    project.context && { label: "Context", value: project.context },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-x">
        <Reveal>
          <Link href="/projects" className="group inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft size={15} className="transition-transform duration-500 group-hover:-translate-x-1" />
            All projects
          </Link>
        </Reveal>

        <header className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow">
                {project.category} · {project.year}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display mt-5 text-[clamp(2.75rem,7vw,6rem)]">{project.title}</h1>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <p className="text-lg leading-relaxed text-muted">{project.summary}</p>
            {project.links && project.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                    {l.label} <ArrowUpRight size={15} className="btn-icon" />
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        </header>

        <Reveal delay={100} className="mt-14">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-line/60 bg-stone md:aspect-[16/8]">
            <ProjectMedia project={project} sizes="100vw" priority />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <aside>
            <Reveal>
              <dl className="divide-y divide-line border-y border-line">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-6 py-4 text-[0.9375rem]">
                    <dt className="text-muted">{f.label}</dt>
                    <dd className="text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            {project.stack.length > 0 && (
              <Reveal delay={80} className="mt-8">
                <h2 className="eyebrow mb-4">Stack & tools</h2>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </aside>

          <div>
            <Reveal>
              <h2 className="eyebrow mb-6">Overview</h2>
            </Reveal>
            <div className="space-y-5 text-lg leading-relaxed text-ink/85 md:text-xl md:leading-relaxed">
              {project.overview.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>

            {project.highlights.length > 0 && (
              <>
                <Reveal>
                  <h2 className="eyebrow mb-6 mt-14">What I did</h2>
                </Reveal>
                <ol className="divide-y divide-line border-y border-line">
                  {project.highlights.map((h, i) => (
                    <Reveal as="li" key={h} delay={i * 50} className="grid grid-cols-[2.5rem_1fr] gap-2 py-5 text-[1.0625rem] leading-relaxed">
                      <span className="pt-1 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span>{h}</span>
                    </Reveal>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>

        {/* Next project */}
        {next && next.slug !== project.slug && (
          <Reveal className="mt-24">
            <Link
              href={`/projects/${next.slug}`}
              className="group flex flex-col gap-6 rounded-[2rem] border border-line bg-surface p-6 transition-shadow duration-700 hover:shadow-[var(--shadow-lift)] sm:flex-row sm:items-center md:p-8"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:w-56">
                <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
                  <ProjectMedia project={next} sizes="224px" />
                </div>
              </div>
              <div className="flex-1">
                <p className="eyebrow">Next project</p>
                <p className="mt-3 text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-none tracking-[-0.04em]">{next.title}</p>
                <p className="mt-2 text-muted">{next.category}</p>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-canvas transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                <ArrowRight size={20} />
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </article>
  );
}
