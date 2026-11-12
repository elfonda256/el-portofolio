import { ViewTransition } from "react";

/**
 * "Dimension jump" between the home page, the project list and a project page.
 *
 *   enter-project — the page dives forward into the screen, the project rises out of depth
 *   leave-project — the project falls away, the previous page comes back into focus
 *
 * Links opt in with `transitionTypes={["enter-project"]}` / `["leave-project"]`.
 * Untyped navigations (browser back/forward) get a quick cross-fade.
 * Used once, in app/template.tsx, which re-mounts on every navigation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="none"
      enter={{ "enter-project": "dim-enter", "leave-project": "dim-return", default: "soft-in" }}
      exit={{ "enter-project": "dim-exit", "leave-project": "dim-leave", default: "soft-out" }}
    >
      <div>{children}</div>
    </ViewTransition>
  );
}

/**
 * Shared-element wrapper: the same project image on two pages morphs between them.
 *
 * Uses a plain CSS view-transition-name (not a React <ViewTransition name>) so the
 * pair is matched after Next.js scrolls the new page to the top. On pages that
 * list several projects the name is only given to the one that was clicked
 * (see ClickOrigin); `active` marks the single project screen on a detail page.
 */
export function SharedMedia({
  slug,
  children,
  className,
  active = false,
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  const style = active
    ? ({ viewTransitionName: `project-${slug}`, viewTransitionClass: "dim-morph" } as React.CSSProperties)
    : undefined;
  return (
    <div className={className} style={style} data-vt-name={`project-${slug}`}>
      {children}
    </div>
  );
}
