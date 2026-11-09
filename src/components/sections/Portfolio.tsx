import Link from "next/link";
import { featuredProjects, projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Icons";

export function Portfolio() {
  const total = projects.filter((p) => !p.placeholder).length;
  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="container-x py-20 md:py-28">
      <SectionHeading
        index="03"
        label="Recent work"
        id="portfolio-title"
        title="My Portfolio"
        aside={
          <p className="text-[1.0625rem] leading-relaxed text-muted">
            Selected work across Industrial IoT, enterprise software and robotics — from irrigation telemetry to
            platforms running daily operations.
          </p>
        }
      />

      <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 90}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 flex justify-center">
        <Link href="/projects" className="btn btn-light group">
          View all projects
          <span className="font-mono text-xs text-muted">({total})</span>
          <ArrowRight size={16} className="btn-icon-plain transition-transform duration-500" />
        </Link>
      </Reveal>
    </section>
  );
}
