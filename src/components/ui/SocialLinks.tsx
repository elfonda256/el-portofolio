import { socials } from "@/data/site";
import { socialIcons } from "./Icons";

interface SocialLinksProps {
  className?: string;
  /** "round" = circular icon buttons, "inline" = icon + label rows */
  variant?: "round" | "inline";
}

export function SocialLinks({ className = "", variant = "round" }: SocialLinksProps) {
  if (variant === "inline") {
    return (
      <ul className={`flex flex-col gap-3 ${className}`}>
        {socials.map((s) => {
          const Icon = socialIcons[s.key];
          const external = s.href.startsWith("http");
          return (
            <li key={s.key}>
              <a
                href={s.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group inline-flex items-center gap-3 text-[0.9375rem]"
              >
                <Icon size={16} className="text-muted transition-colors group-hover:text-ink" />
                <span className="link-underline">{s.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {socials.map((s) => {
        const Icon = socialIcons[s.key];
        const external = s.href.startsWith("http");
        return (
          <li key={s.key}>
            <a
              href={s.href}
              aria-label={s.label}
              title={s.label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-canvas"
            >
              <Icon size={17} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
