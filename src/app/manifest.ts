import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "הקופה הלאומית",
    short_name: "הקופה הלאומית",
    description:
      "השבת ממון, צרכי רבים, מעשר כספים, צדקה ופדיון נפש — פשוט, מכובד ודיסקרטי.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f3ea",
    theme_color: "#0f4c46",
    lang: "he",
    dir: "rtl",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
