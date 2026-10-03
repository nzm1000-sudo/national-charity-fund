import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.STATIC_EXPORT === "1" ? process.env.PAGES_BASE_PATH || "" : "";
  return {
    name: "הקופה הלאומית",
    short_name: "הקופה הלאומית",
    description:
      "הכתובת להשבת ממון, לצרכי רבים, למעשר כספים, לצדקה ולפדיון נפש. בצנעה, בשקיפות ועל פי ההלכה.",
    id: `${basePath}/`,
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    prefer_related_applications: false,
    lang: "he",
    dir: "rtl",
    icons: [
      { src: `${basePath}/app-icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${basePath}/app-icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${basePath}/app-icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
