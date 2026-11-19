"use client";

import { usePathname } from "next/navigation";
import { TrackScene } from "./TrackScene";

/**
 * Keeps one 3D scene alive for the whole visit: the home page drives it with
 * its chapters, every other page shows it dimmed in the trophy room.
 */
export function SceneHost() {
  const pathname = usePathname();
  return <TrackScene dim={pathname !== "/"} routeKey={pathname} />;
}
