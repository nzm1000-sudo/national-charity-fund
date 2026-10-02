import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "הקופה הלאומית",
    short_name: "הקופה הלאומית",
    description:
      "הכתובת להשבת ממון, לצרכי רבים, למעשר כספים, לצדקה ולפדיון נפש. בצנעה, בשקיפות ועל פי ההלכה.",
    start_url: `${process.env.PAGES_BASE_PATH ?? ""}/`,
    display: "standalone",
    background_color: "#fdfbf6",
    theme_color: "#fdfbf6",
    lang: "he",
    dir: "rtl",
    icons: [
      { src: `${process.env.PAGES_BASE_PATH ?? ""}/icon.svg`, sizes: "any", type: "image/svg+xml" },
    ],
  };
}
