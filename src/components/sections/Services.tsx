import { sectionIndex } from "@/data/site";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { ArrowUpRight } from "@/components/ui/Icons";

export function Services() {
  return (
    <section id="products" aria-labelledby="products-title" className="bg-surface py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          index={sectionIndex("products")}
          label="Products & services"
          id="products-title"
          title={
            <>
              What I can <span className="text-muted">build for you.</span>
            </>
          }
          aside={
            <p className="text-[1.0625rem] leading-relaxed text-muted">
              The same work behind the projects above, offered to teams and businesses that need it.
            </p>
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 90} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas transition-all duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
                    <ProjectCover cover={s.cover} uid={`svc-${i}`} label={`Illustration for ${s.title}`} />
                  </div>
                  <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-full bg-surface font-mono text-xs">
                    0{i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="text-xl font-semibold tracking-[-0.03em]">{s.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{s.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {s.deliverables.map((d) => (
                      <li key={d} className="chip !h-6 !px-2.5 !text-xs">
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    {s.link ? (
                      <a href={s.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium">
                        <span className="link-underline">{s.link.label}</span> <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <a href="#contact" className="inline-flex items-center gap-1.5 text-sm font-medium">
                        <span className="link-underline">Discuss a project</span> <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
