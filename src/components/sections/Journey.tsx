import { sectionIndex } from "@/data/site";
import type { TimelineItem } from "@/data/types";
import { education, experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Gallery } from "@/components/ui/Gallery";

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative">
      {items.map((item, i) => (
        <li key={item.title + item.organization} className="relative grid gap-3 pb-14 pl-8 last:pb-0 md:grid-cols-[11rem_1fr] md:gap-10 md:pl-0">
          {/* rail + node */}
          <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-2 w-px bg-line md:left-[calc(11rem+1.25rem-0.5px)] [li:last-child_&]:hidden" />
          <span aria-hidden="true" className="absolute left-0 top-[0.45rem] size-[11px] rounded-full border-2 border-ink bg-canvas md:left-[calc(11rem+1.25rem-5.5px)]" />

          <Reveal delay={i * 40}>
            <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-muted md:pt-0.5 md:text-right">{item.period}</p>
          </Reveal>

          <Reveal delay={i * 40 + 60} className="md:pl-10">
            <h3 className="text-[1.375rem] font-semibold leading-snug tracking-[-0.03em] md:text-2xl">{item.title}</h3>
            <p className="mt-1.5 text-[0.9375rem] text-ink">
              {item.organization}
              {item.context && <span className="text-muted"> · {item.context}</span>}
            </p>
            {item.location && <p className="mt-0.5 text-sm text-muted">{item.location}</p>}
            {item.description && <p className="mt-4 max-w-2xl leading-relaxed text-muted">{item.description}</p>}
            {item.points.length > 0 && (
              <ul className="mt-4 max-w-2xl space-y-2.5">
                {item.points.map((pt) => (
                  <li key={pt} className="relative pl-5 text-[0.9375rem] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-ink/40">
                    {pt}
                  </li>
                ))}
              </ul>
            )}
            {item.tags && (
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <li key={t} className="chip !h-6 !px-2.5 !text-xs">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {item.photos && item.photos.length > 0 && <Gallery photos={item.photos} variant="thumbs" className="mt-6" />}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function Journey() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="container-x py-24 md:py-36">
      <SectionHeading
        index={sectionIndex("experience")}
        label="Experience & education"
        id="experience-title"
        title={
          <>
            The path <span className="text-muted">so far.</span>
          </>
        }
      />

      <div className="space-y-20">
        <div>
          <Reveal>
            <h3 className="eyebrow mb-10 border-b border-line pb-4">Work experience</h3>
          </Reveal>
          <Timeline items={experience} />
        </div>

        <div>
          <Reveal>
            <h3 className="eyebrow mb-10 border-b border-line pb-4">Education & achievements</h3>
          </Reveal>
          <Timeline items={education} />
        </div>

        <div>
          <Reveal>
            <h3 className="eyebrow mb-4 border-b border-line pb-4">Technical skills</h3>
          </Reveal>
          <dl className="divide-y divide-line">
            {skillGroups.map((g, i) => (
              <Reveal key={g.name} delay={(i % 4) * 50} className="grid gap-3 py-5 md:grid-cols-[11rem_1fr] md:gap-10">
                <dt className="text-[0.9375rem] font-medium md:pt-1 md:text-right">{g.name}</dt>
                <dd className="flex flex-wrap gap-1.5 md:pl-10">
                  {g.items.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
