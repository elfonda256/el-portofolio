import Link from "next/link";
import { navigation, profile } from "@/data/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ArrowUp } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/#home" className="text-2xl font-semibold tracking-[-0.04em]">
              {profile.brand}
            </Link>
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-muted">
              {profile.title}. {profile.focus.join(" · ")}.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow mb-4">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-[0.9375rem]">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/projects" className="link-underline text-[0.9375rem]">
                  All projects
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-4">Elsewhere</p>
            <SocialLinks variant="inline" />
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-line pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <a href="#main" className="group inline-flex items-center gap-2 hover:text-ink">
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-line transition-all duration-500 group-hover:-translate-y-0.5 group-hover:border-ink">
              <ArrowUp size={14} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
