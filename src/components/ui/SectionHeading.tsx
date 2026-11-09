import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
}

/** Editorial section header: "(03) — Portfolio" over a large title. */
export function SectionHeading({ index, label, title, aside, id }: SectionHeadingProps) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div>
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span>({index})</span>
            <span className="h-px w-8 bg-line" />
            <span>{label}</span>
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id={id} className="display text-[clamp(2.5rem,6vw,4.75rem)]">
            {title}
          </h2>
        </Reveal>
      </div>
      {aside && <Reveal delay={160} className="md:max-w-sm md:pb-2">{aside}</Reveal>}
    </div>
  );
}
