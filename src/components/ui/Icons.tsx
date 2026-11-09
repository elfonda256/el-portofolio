import type { SVGProps } from "react";
import type { SocialKey } from "@/data/types";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p: IconProps) => (
  <svg {...base(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const ArrowUpRight = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const ArrowUp = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
);
export const Play = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
);
export const Mail = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>
);
export const MapPin = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const Menu = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 9h16M4 15h16" /></svg>
);
export const Close = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);

export const LinkedIn = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.6 4.77 6v6.45h-4v-5.72c0-1.36-.03-3.12-1.9-3.12-1.9 0-2.2 1.48-2.2 3.02v5.82h-4v-11Z" />
  </svg>
);
export const GitHub = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.25a9.75 9.75 0 0 0-3.08 19c.49.09.67-.21.67-.47v-1.65c-2.71.59-3.29-1.31-3.29-1.31-.44-1.13-1.08-1.43-1.08-1.43-.89-.6.07-.59.07-.59.98.07 1.5 1 1.5 1 .87 1.5 2.29 1.07 2.85.82.09-.63.34-1.07.62-1.31-2.17-.25-4.44-1.08-4.44-4.82 0-1.07.38-1.94 1-2.62-.1-.25-.43-1.24.1-2.59 0 0 .82-.26 2.68 1a9.3 9.3 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .53 1.35.2 2.34.1 2.59.63.68 1 1.55 1 2.62 0 3.75-2.28 4.57-4.45 4.81.35.3.66.9.66 1.81v2.68c0 .26.18.57.68.47A9.75 9.75 0 0 0 12 2.25Z" />
  </svg>
);
export const YouTube = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);
export const Instagram = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
);
export const WhatsApp = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12.04 2.5a9.44 9.44 0 0 0-8.13 14.24L2.5 21.5l4.9-1.38A9.45 9.45 0 1 0 12.04 2.5Zm0 17.2a7.8 7.8 0 0 1-3.97-1.09l-.28-.17-2.9.82.83-2.83-.19-.29a7.78 7.78 0 1 1 6.51 3.56Zm4.28-5.83c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.74.91-.13.16-.27.18-.5.06a6.38 6.38 0 0 1-3.17-2.77c-.24-.41.24-.38.69-1.27.08-.16.04-.29-.02-.41l-.71-1.71c-.19-.45-.38-.38-.52-.39h-.45a.86.86 0 0 0-.62.29 2.6 2.6 0 0 0-.81 1.94 4.52 4.52 0 0 0 .95 2.4 10.34 10.34 0 0 0 3.96 3.5c1.47.64 2.05.69 2.78.58.45-.07 1.38-.56 1.57-1.11.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.45-.27Z" />
  </svg>
);

export const socialIcons: Record<SocialKey, (p: IconProps) => React.ReactElement> = {
  linkedin: LinkedIn,
  github: GitHub,
  email: Mail,
  youtube: YouTube,
  instagram: Instagram,
  whatsapp: WhatsApp,
};
