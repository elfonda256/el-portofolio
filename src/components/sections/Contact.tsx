import { contact, profile, socials, whatsappHref } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight, Mail, WhatsApp, socialIcons } from "@/components/ui/Icons";

export function Contact() {
  const wa = whatsappHref();
  return (
    <section id="contact" aria-labelledby="contact-title" className="container-x py-24 md:py-32">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-canvas sm:px-10 md:rounded-[2.5rem] md:px-16 md:py-24">
        {/* faint grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(80%_80%_at_80%_20%,black,transparent)]"
        />

        <div className="relative">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 !text-white/50">
              <span>(07)</span>
              <span className="h-px w-8 bg-white/20" />
              <span>Contact</span>
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 id="contact-title" className="display mt-8 max-w-5xl text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.92]">
              Let&apos;s build something <span className="text-white/45">that works.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1.2fr_1fr] md:items-end">
            <Reveal delay={140}>
              <p className="max-w-lg text-lg leading-relaxed text-white/65">
                Have an operation that needs better software, a monitoring system to connect, or a role where industrial
                and software engineering meet? I&apos;d like to hear about it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${contact.email}`} className="btn bg-canvas text-ink hover:bg-white hover:shadow-[0_20px_40px_-20px_rgba(255,255,255,0.4)]">
                  <Mail size={17} /> Email me
                  <ArrowUpRight size={15} className="btn-icon" />
                </a>
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="btn border border-white/20 text-canvas hover:border-white/60">
                    <WhatsApp size={17} /> WhatsApp
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal delay={200} className="md:justify-self-end">
              <a
                href={`mailto:${contact.email}`}
                className="link-underline break-all text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium tracking-[-0.02em]"
              >
                {contact.email}
              </a>
              <ul className="mt-6 flex flex-wrap gap-2">
                {socials
                  .filter((s) => s.key !== "email")
                  .map((s) => {
                    const Icon = socialIcons[s.key];
                    return (
                      <li key={s.key}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm text-white/80 transition-colors duration-500 hover:border-white/60 hover:text-white"
                        >
                          <Icon size={15} /> {s.label}
                        </a>
                      </li>
                    );
                  })}
              </ul>
              <p className="mt-6 text-sm text-white/45">{profile.location}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
