import { contact, cv, profile, whatsappHref, sectionIndex } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowUpRight, Download, Mail, WhatsApp } from "@/components/ui/Icons";
import { Availability } from "./Hero";

export function Intro() {
  const wa = whatsappHref();
  // Split the headline so its second half reads lighter — an editorial accent.
  const [lead, ...rest] = profile.headline.split(" and ");

  return (
    <section id="intro" aria-labelledby="intro-title" className="container-x pb-16 pt-24 md:pb-24 md:pt-36">
      <div className="grid gap-14 lg:grid-cols-[18rem_1fr] lg:gap-20">
        {/* Left rail */}
        <div className="flex flex-col gap-8 lg:pt-3">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span>({sectionIndex("intro")})</span>
              <span className="h-px w-8 bg-line" />
              <span>Introduction</span>
            </p>
          </Reveal>
          <Reveal delay={80}>
            <SocialLinks />
          </Reveal>
          <Reveal delay={140}>
            <div className="rounded-2xl border border-line bg-surface p-5 text-sm">
              <Availability className="font-medium text-ink" />
              <p className="mt-3 leading-relaxed text-muted">Based in {profile.location}.</p>
            </div>
          </Reveal>
        </div>

        {/* Main */}
        <div>
          <Reveal>
            <h2 id="intro-title" className="display text-[clamp(2.4rem,5.6vw,5rem)] leading-[1.0]">
              {lead}
              {rest.length > 0 && (
                <>
                  {" "}
                  <span className="text-muted">and {rest.join(" and ")}</span>
                </>
              )}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
            <Reveal delay={80}>
              <p className="text-lg leading-relaxed text-ink md:text-xl md:leading-relaxed">{profile.intro}</p>
            </Reveal>
            <Reveal delay={160} className="space-y-4 text-[1.0625rem] leading-relaxed text-muted">
              {profile.bio.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </Reveal>
          </div>

          <Reveal delay={200} className="mt-10 flex flex-wrap gap-3">
            <a href={`mailto:${contact.email}`} className="btn btn-dark">
              <Mail size={17} /> Email me
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                <WhatsApp size={17} /> WhatsApp
              </a>
            )}
            {cv.href && (
              <a href={cv.href} download className="btn btn-light">
                <Download size={17} /> {cv.label}
              </a>
            )}
            <a href="#contact" className="btn btn-light">
              Start a conversation <ArrowUpRight size={16} className="btn-icon" />
            </a>
          </Reveal>

          {/* Key numbers */}
          <dl className="mt-20 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
            {profile.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="bg-surface p-6 md:p-8">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <p className="text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.05em]">
                    {s.value}
                    {"unit" in s && <span className="ml-1.5 text-base font-medium tracking-normal text-muted">{s.unit}</span>}
                  </p>
                  <p aria-hidden="true" className="mt-4 text-sm leading-relaxed text-muted">
                    {s.label}
                  </p>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
