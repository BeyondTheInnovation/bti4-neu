import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"
import { source } from "@/lib/source"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/playground", "/inspiration"]
  const docs = source.getPages().map((page) => page.url)

  return [...routes, ...docs].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.startsWith("/components/") ? 0.6 : 0.8,
  }))
}
