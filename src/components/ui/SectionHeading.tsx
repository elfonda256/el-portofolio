import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
}

/** Chapter header: "(03) — Recent work" over an oversized condensed title. */
export function SectionHeading({ index, label, title, aside, id }: SectionHeadingProps) {
  return (
    <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
      <div>
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="signal-text">({index})</span>
            <span className="h-px w-8 bg-line" />
            <span>{label}</span>
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id={id} className="title-xl text-[clamp(2.4rem,6vw,5.75rem)]">
            {title}
          </h2>
        </Reveal>
      </div>
      {aside && <Reveal delay={160} className="md:max-w-sm md:pb-3">{aside}</Reveal>}
    </div>
  );
}
