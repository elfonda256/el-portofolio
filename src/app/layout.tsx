import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { profile, site, socials, contact } from "@/data/site";
import "./globals.css";

const caveat = localFont({
  src: "./fonts/Caveat-Medium.woff2",
  weight: "500",
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${profile.name} — ${profile.title}`,
    description: site.description,
    siteName: profile.name,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${profile.name} — ${profile.title}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: site.description,
    images: [site.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${contact.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Karawang", addressCountry: "ID" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Institut Teknologi Sepuluh Nopember" },
  knowsAbout: [...profile.focus],
  sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available so reveal animations can start hidden. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        {/* Visitor stats — turn on "Web Analytics" in the Vercel project to see them. */}
        <Analytics />
      </body>
    </html>
  );
}
