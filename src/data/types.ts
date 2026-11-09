/** Shared content types. Edit the data files, not these, to change the site. */

export type SocialKey = "linkedin" | "github" | "email" | "youtube" | "instagram" | "whatsapp";

export interface SocialLink {
  key: SocialKey;
  label: string;
  href: string;
  /** Short handle shown next to the icon, e.g. "elfonda256" */
  handle?: string;
}

/**
 * Which built-in illustration a project card shows when it has no real image.
 * Add a real screenshot via `image` and it replaces the illustration.
 */
export type CoverArt =
  | "telemetry"
  | "catering"
  | "website"
  | "slam"
  | "jetson"
  | "vision"
  | "robot"
  | "placeholder";

/** A real photo or screenshot stored in /public. */
export interface Photo {
  src: string;
  alt: string;
  /** Short caption shown under the photo. */
  caption: string;
  /** Real pixel size of the file. */
  width: number;
  height: number;
  /** CSS object-position used when the photo is cropped, e.g. "50% 30%". */
  position?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  /** One or two sentences for cards. */
  summary: string;
  /** Longer overview for the project page. */
  overview: string[];
  role?: string;
  context?: string;
  highlights: string[];
  stack: string[];
  links?: ProjectLink[];
  cover: CoverArt;
  /** Optional real image in /public, e.g. "/images/projects/catering.jpg". Replaces the illustration. */
  image?: string;
  imageAlt?: string;
  /** CSS object-position for the cover crop, e.g. "50% 30%". */
  imagePosition?: string;
  /** Wide photo at the top of the project page (defaults to `image`). Pick a landscape one. */
  hero?: Photo;
  /** Photos shown on the project page. */
  gallery?: Photo[];
  /** Show on the home page grid. */
  featured?: boolean;
  /** Marks unfinished entries so they're labelled clearly on the site. */
  placeholder?: boolean;
}

export interface TimelineItem {
  title: string;
  organization: string;
  context?: string;
  location?: string;
  period: string;
  description?: string;
  points: string[];
  tags?: string[];
  /** Small photos shown under the entry. */
  photos?: Photo[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface Service {
  title: string;
  description: string;
  deliverables: string[];
  cover: CoverArt;
  link?: ProjectLink;
}

export interface Video {
  /** YouTube video ID (the part after `v=`). Leave empty to show the placeholder. */
  youtubeId: string;
  title: string;
  description: string;
  date?: string;
  duration?: string;
}
