import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/donation", "/mock", "/q/"],
      },
    ],
    sitemap: `${env.APP_URL}/sitemap.xml`,
    host: env.APP_URL,
  };
}
