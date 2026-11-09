import type { NextConfig } from "next";

/**
 * Set STATIC_EXPORT=1 to produce a fully static build in /out
 * (useful for previews or hosting without a Node server).
 * On Vercel, leave it unset to get on-the-fly image optimization.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport
    ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
    : {
        images: {
          formats: ["image/avif", "image/webp"],
          remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
        },
      }),
};

export default nextConfig;
