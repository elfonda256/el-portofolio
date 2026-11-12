import Image from "next/image";
import { photos, profile, sectionIndex } from "@/data/site";
import { coreSkills } from "@/data/skills";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" data-scene="3" aria-labelledby="about-title" className="py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Photo */}
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <figure className="relative">
            <div className="hud-frame relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-stone">
              <Image
                src={photos.about.src}
                alt={photos.about.alt}
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover object-[50%_40%] transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] hover:scale-[1.03]"
              />
            </div>
            <figcaption className="absolute -bottom-5 right-6 rotate-[-4deg] rounded-full bg-signal px-5 py-2 font-hand text-2xl text-canvas shadow-[var(--shadow-lift)] md:text-[1.75rem]">
              {photos.about.note}
            </figcaption>
          </figure>
        </Reveal>

        {/* Story */}
        <div>
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="signal-text">({sectionIndex("about")})</span>
              <span className="h-px w-8 bg-line" />
              <span>About me</span>
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="about-title" className="title-xl text-[clamp(3rem,7vw,6.5rem)]">
              Between the field <span className="text-muted">and the software.</span>
            </h2>
          </Reveal>

          <div className="glass mt-10 space-y-5 rounded-[var(--radius-card)] p-6 text-[1.0625rem] leading-relaxed text-muted md:p-8 md:text-lg md:leading-relaxed">
            {profile.story.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className={i === 0 ? "text-ink" : ""}>{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            <Reveal>
              <h3 className="eyebrow mb-4">Core skills</h3>
              <ul className="flex flex-wrap gap-2">
                {coreSkills.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="eyebrow mb-4">Interests</h3>
              <ul className="divide-y divide-line border-y border-line">
                {profile.interests.map((s, i) => (
                  <li key={s} className="flex items-baseline gap-4 py-3 text-[0.9375rem]">
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
