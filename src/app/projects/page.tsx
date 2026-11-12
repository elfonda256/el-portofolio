import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "All projects by Elfano Sultan Syahbana — Industrial IoT telemetry, enterprise software, corporate websites, robotics and applied AI.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const categories = Array.from(new Set(projects.filter((p) => !p.placeholder).map((p) => p.category)));

  return (
    <section className="container-x pb-24 pt-36 md:pb-32 md:pt-44">
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          <span>Index</span>
          <span className="h-px w-8 bg-line" />
          <span>{projects.filter((p) => !p.placeholder).length} projects</span>
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="title-xl mt-6 text-[clamp(4rem,12vw,10rem)]">
          All projects<span className="text-muted">.</span>
        </h1>
      </Reveal>
      <Reveal delay={140}>
        <ul className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 90}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
