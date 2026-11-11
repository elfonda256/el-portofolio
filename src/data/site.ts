import type { SocialLink } from "./types";
import { library } from "./photos";

/**
 * Personal information & contact — the single source of truth for identity.
 * Source: CV (Elfano Sultan Syahbana, v2).
 */
export const profile = {
  name: "Elfano Sultan Syahbana",
  firstName: "Elfano",
  lastName: "Syahbana",
  brand: "Elfano.",
  title: "Automation & Software Engineer",
  focus: ["Industrial IoT", "Robotics", "Applied AI", "Enterprise Software"],
  location: "Karawang, Indonesia",
  greeting: "Hi, I'm",

  /** Large statement used in the introduction section. */
  headline: "I bridge industrial operations and enterprise software.",
  intro:
    "Automation & Software Engineer working across industrial automation, Industrial IoT, robotics, applied AI, and enterprise software.",
  bio: [
    "I build systems that sit where the physical and the digital meet — telemetry networks that report water levels from the field, robots that map the space around them, and business platforms that turn day-to-day operations into clean software.",
    "My strongest skill is understanding how a business actually runs, then translating that process into software people can rely on. I work through practical engineering and business process analysis, from requirements to deployment.",
  ],

  /** Short story for the About section. */
  story: [
    "I studied Automation Engineering Technology at Institut Teknologi Sepuluh Nopember (ITS) in Surabaya, where I worked as a research student in the Electric Drive and Power Electronics System Laboratory and joined a Global Project Based Learning programme with Shibaura Institute of Technology in Japan.",
    "At Toyota Motor Manufacturing Indonesia's R&D team, I built autonomous mobile robot prototypes with ROS and SLAM, and deployed YOLO-based computer vision models on NVIDIA Jetson hardware.",
    "I then joined PT Alkatec Mandiri Kencana as a Telemetry Engineer on the Rentang Irrigation Modernization Project, supporting Industrial IoT telemetry across a distributed irrigation network. Alongside full-time roles, I deliver production web applications for paying clients as an independent software engineer.",
  ],

  interests: [
    "Industrial IoT & remote monitoring",
    "Autonomous mobile robots",
    "Edge AI & computer vision",
    "Business process digitisation",
    "Enterprise web platforms",
  ],

  /** Key numbers shown in the introduction. All from the CV. */
  stats: [
    { value: "52 + 13", label: "Telemetry & telecontrol stations supported on the Rentang Irrigation project" },
    { value: "~8,000", label: "Meals a day handled by a catering business on a platform I built solo" },
    { value: "47–60", unit: "FPS", label: "Real-time object detection after TensorRT optimisation on NVIDIA Jetson" },
  ],

  availability: {
    /** Set to false to hide the green "available" indicator. */
    open: true,
    label: "Open to new roles & freelance projects",
  },

  portrait: {
    /** Transparent cut-out used in the hero (PNG with alpha). */
    cutout: "/images/elfano-cutout.png",
    /** Rectangular portrait used in the About section. */
    photo: "/images/elfano-portrait.jpg",
    alt: "Portrait of Elfano Sultan Syahbana",
  },
} as const;

/**
 * Personal photos used around the site (not project screenshots).
 * Replace a file in /public/images or edit the caption here.
 * `width`/`height` are the real pixel size of the file.
 */
export const photos = {
  /** Large photo in the About section. */
  about: {
    src: "/images/field-onsite.jpg",
    alt: "Elfano in a hard hat and safety vest, sitting on the tailgate of a field vehicle loaded with equipment",
    width: 963,
    height: 1280,
    note: "on site ✦",
  },
  /** Photo band after the introduction (from the photo library). */
  band: [
    { ...library.rimpPresentation, context: "Rentang Irrigation Modernization Project" },
    { ...library.fieldStation, context: "Site visit" },
  ],
} as const;

export const contact = {
  email: "elfano2686@gmail.com",
  /**
   * WhatsApp is hidden until you approve publishing your number.
   * Set `enabled: true` and fill `number` in international format without "+",
   * e.g. "62xxxxxxxxxx". The button then appears in Intro and Contact.
   */
  whatsapp: {
    enabled: false,
    number: "",
    message: "Hi Elfano, I found your portfolio and would like to talk about a project.",
  },
} as const;

/**
 * Downloadable CV. Replace the file in public/cv/ to update it (keep the same
 * name), or set `href: ""` to hide the buttons.
 * This public copy has the phone number removed on purpose.
 */
export const cv = {
  href: "/cv/Elfano_Sultan_Syahbana_CV.pdf",
  label: "Download CV",
} as const;

/**
 * Home page sections. Set `showLatestContent: true` once the first video or
 * write-up is ready — the Blog section, its nav link and the section numbers
 * all follow this switch.
 */
export const features = {
  showLatestContent: false,
} as const;

const homeSectionOrder = ["intro", "content", "portfolio", "about", "experience", "products", "contact"] as const;
type HomeSection = (typeof homeSectionOrder)[number];

/** "(02)"-style number for a home section, skipping hidden sections. */
export function sectionIndex(id: HomeSection): string {
  const visible = homeSectionOrder.filter((s) => s !== "content" || features.showLatestContent);
  return String(visible.indexOf(id as never) + 1).padStart(2, "0");
}

export const socials: SocialLink[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/elfano-sultan-syahbana",
    handle: "elfano-sultan-syahbana",
  },
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/elfonda256",
    handle: "elfonda256",
  },
  {
    key: "email",
    label: "Email",
    href: `mailto:${contact.email}`,
    handle: contact.email,
  },
  // Add more when ready, e.g.:
  // { key: "youtube", label: "YouTube", href: "https://youtube.com/@your-channel" },
  // { key: "instagram", label: "Instagram", href: "https://instagram.com/your-handle" },
];

export const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Blog", href: "/#content" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "About", href: "/#about" },
  { label: "Products", href: "/#products" },
].filter((item) => item.href !== "/#content" || features.showLatestContent);

export const site = {
  /**
   * Canonical/OG base URL. Order: NEXT_PUBLIC_SITE_URL (set this when a custom
   * domain is added) → Vercel's production domain (provided automatically at
   * build time) → the current live URL.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://el-portofolio-five.vercel.app"),
  /** Link-preview image (1200×630) for LinkedIn, WhatsApp, X, etc. */
  ogImage: "/og.jpg",
  description:
    "Portfolio of Elfano Sultan Syahbana — Automation & Software Engineer working across Industrial IoT, robotics, applied AI and enterprise software. Based in Karawang, Indonesia.",
  keywords: [
    "Elfano Sultan Syahbana",
    "Automation Engineer",
    "Software Engineer",
    "Industrial IoT",
    "Telemetry",
    "Robotics",
    "Computer Vision",
    "Next.js",
    "Indonesia",
  ],
} as const;

export function whatsappHref(): string | null {
  const { enabled, number, message } = contact.whatsapp;
  if (!enabled || !number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
