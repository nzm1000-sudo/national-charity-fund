import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Static export mode (GitHub Pages).
 *
 * Pages hosts only static files, so a static build has no server features
 * (no API routes, payments, admin or database at runtime). Set STATIC_EXPORT=1
 * and PAGES_BASE_PATH (for project pages, e.g. /national-charity-fund) to build
 * it. The full app is served by a Node host (Vercel) using the same code.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = isStaticExport ? process.env.PAGES_BASE_PATH || "" : "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath,
        assetPrefix: basePath || undefined,
        images: { unoptimized: true },
      }
    : {
        images: { formats: ["image/avif", "image/webp"] as const },
      }),
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
            {
              // Never cache sensitive routes
              source: "/(admin|api)/(.*)",
              headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
            },
          ];
        },
      }),
};

export default nextConfig;
