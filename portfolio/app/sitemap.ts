import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllProjectSlugs } from "@/content/projects";
import { writing } from "@/content/experience";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/work", "/writing", "/contact"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projectRoutes = getAllProjectSlugs().map((slug) => ({
    url: `${siteConfig.url}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const writingRoutes = writing
    .filter((w) => !w.externalUrl)
    .map((w) => ({
      url: `${siteConfig.url}/writing/${w.slug}`,
      lastModified: new Date(w.date),
      changeFrequency: "never" as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...projectRoutes, ...writingRoutes];
}
