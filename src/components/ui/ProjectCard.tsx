import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/types";
import { ProjectCover } from "./ProjectCover";
import { ArrowUpRight } from "./Icons";
import { SharedMedia } from "@/components/scene/PageTransition";

export function ProjectMedia({ project, sizes, priority = false }: { project: Project; sizes: string; priority?: boolean }) {
  return project.image ? (
    <Image
      src={project.image}
      alt={project.imageAlt ?? project.title}
      fill
      sizes={sizes}
      priority={priority}
      style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
      className="object-cover"
    />
  ) : (
    <ProjectCover cover={project.cover} uid={project.slug} label={`Illustration for ${project.title}`} />
  );
}

export function ProjectCard({ project }: { project: Project }) {
  if (project.placeholder) {
    return (
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-dashed border-line">
          <ProjectMedia project={project} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" />
        </div>
        <div className="mt-5 px-1">
          <p className="eyebrow">{project.category}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-muted">{project.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{project.summary}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="h-full">
      <Link href={`/projects/${project.slug}`} transitionTypes={["enter-project"]} className="group flex h-full flex-col" aria-label={`View project: ${project.title}`}>
        <SharedMedia
          slug={project.slug}
          className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-line/60 bg-stone shadow-[var(--shadow-soft)] transition-shadow duration-700 ease-[var(--ease-out-expo)] group-hover:shadow-[var(--shadow-lift)]"
        >
          <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
            <ProjectMedia project={project} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" />
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-xs font-medium backdrop-blur">
            {project.category}
          </span>
          <span className="absolute bottom-4 right-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            View project <ArrowUpRight size={14} />
          </span>
        </SharedMedia>

        <div className="mt-5 flex flex-1 flex-col px-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-[-0.03em]">{project.title}</h3>
            <span className="shrink-0 font-mono text-xs text-muted">{project.year}</span>
          </div>
          <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">{project.summary}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
            <span className="link-underline group-hover:bg-[length:100%_1px]">View project</span>
            <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
