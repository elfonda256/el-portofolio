# Elfano Sultan Syahbana — Portfolio

Personal portfolio built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**.
No UI libraries, no animation libraries — icons, illustrations and motion are hand-built and lightweight.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm run lint       # TypeScript check only
```

Deploy on Vercel as-is. Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.com`) so canonical URLs,
Open Graph tags and the sitemap point to the right domain.

Need plain static files instead? `STATIC_EXPORT=1 npm run build` writes a fully static site to `out/`.

## Edit the content

All content lives in `src/data/` — you shouldn't need to touch components to update the site.

| File | What it holds |
| --- | --- |
| `site.ts` | Name, title, bio, story, interests, key numbers, availability, **photos**, email, **WhatsApp**, socials, navigation, SEO |
| `projects.ts` | Portfolio projects (order, featured flag, details, links, images) |
| `experience.ts` | Work experience and education timeline |
| `skills.ts` | Core skills (About) and grouped technical skills |
| `services.ts` | Products & services cards |
| `content.ts` | Latest Content — featured YouTube video |

### Common changes

- **Enable WhatsApp** — in `site.ts`, set `contact.whatsapp.enabled = true` and fill `number`
  (international format without `+`, e.g. `62xxxxxxxxxx`). Buttons appear in Introduction and Contact.
  It's off by default so your number isn't published until you decide.
- **Add a YouTube video** — paste the video ID into `featuredVideo.youtubeId` in `content.ts`
  and update the title/description. Optional: set `youtubeChannel`.
- **Add a project** — copy an entry in `projects.ts`, give it a unique `slug`, fill in the fields.
  `featured: true` shows it on the home grid (6 looks best); every project gets its own page at
  `/projects/<slug>` automatically. Replace or delete the `next-project` placeholder entry.
- **Use a real screenshot** — put the image in `public/images/projects/` and set
  `image: "/images/projects/your-file.jpg"` (plus `imageAlt`) on the project. It replaces the illustration.
- **Swap the portrait** — replace `public/images/elfano-cutout.png` (transparent PNG, used in the hero)
  and `public/images/elfano-portrait.jpg` (social share image). A higher-resolution photo (≥1200px tall)
  will look sharper on large screens; keep the cut-out's background transparent so the name can sit behind it.
- **Photos** — personal photos and their captions are in `photos` in `site.ts`
  (About photo + the two-photo band after the introduction). Files live in `public/images/field-*.jpg`.
- **Availability** — `profile.availability` in `site.ts` (set `open: false` to hide the green indicator).

## Structure

```
src/
  app/
    layout.tsx              fonts, metadata, JSON-LD, navbar + footer
    page.tsx                home: all sections in order
    template.tsx            soft fade between pages
    projects/page.tsx       all projects
    projects/[slug]/page.tsx  project detail (statically generated)
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
    globals.css             design tokens, buttons, chips, reveal animation
  components/
    layout/   Navbar (floating, sticky, mobile menu, active section), Footer
    sections/ Hero, Intro, FieldBand, LatestContent, Portfolio, About, Journey, Services, Contact
    ui/       Reveal, SectionHeading, ProjectCard, ProjectCover (SVG illustrations), SocialLinks, Icons
  data/      all editable content (see above)
```

## Design system

Colours (from `globals.css`): background `#FAFAF9`, surface `#FFFFFF`, text `#171717`,
muted `#737373`, border `#E5E5E5`. Type: Geist Sans (UI and headlines), Geist Mono (labels),
Caveat (handwritten accents). Motion respects `prefers-reduced-motion`.

Project cards use built-in monochrome illustrations of each *kind* of system until real images are
added — they are not screenshots of the actual products.
