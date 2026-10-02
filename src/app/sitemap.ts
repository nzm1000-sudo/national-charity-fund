import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.APP_URL;
  const staticRoutes = [
    "",
    "/hashavat-mamon",
    "/tzrachei-rabim",
    "/maaser",
    "/tzedakah",
    "/pidyon",
    "/where-the-money-goes",
    "/faq",
    "/about",
    "/privacy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const causes = await prisma.cause
    .findMany({ where: { publicVisible: true }, select: { slug: true, updatedAt: true } })
    .catch(() => []);

  return [
    ...staticRoutes,
    ...causes.map((c) => ({
      url: `${base}/cause/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
