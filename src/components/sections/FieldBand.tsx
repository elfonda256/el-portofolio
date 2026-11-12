import Image from "next/image";
import { photos } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

/** Wide photo band after the introduction — real moments from the field. */
export function FieldBand() {
  const [main, side] = photos.band;
  return (
    <section data-scene="1" aria-label="Photos from the field" className="container-x pb-8 md:pb-12">
      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Reveal>
          <figure>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-stone lg:aspect-[16/11]">
              <Image
                src={main.src}
                alt={main.alt}
                fill
                sizes="(min-width:1024px) 60vw, 100vw"
                className="object-cover object-[60%_50%] transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1 text-sm">
              <span className="font-medium">{main.caption}</span>
              <span className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{main.context}</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={120} className="h-full">
          <figure className="flex h-full flex-col">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-stone lg:aspect-auto lg:flex-1">
              <Image
                src={side.src}
                alt={side.alt}
                fill
                sizes="(min-width:1024px) 38vw, 100vw"
                className="object-cover object-[50%_45%] transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1 text-sm">
              <span className="font-medium">{side.caption}</span>
              <span className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{side.context}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
