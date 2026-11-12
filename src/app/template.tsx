import { PageTransition } from "@/components/scene/PageTransition";

/** Re-mounts on every navigation — the boundary for page-to-page transitions. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
