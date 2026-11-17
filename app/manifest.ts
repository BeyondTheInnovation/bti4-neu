import type { MetadataRoute } from "next"
import { SURFACE } from "@/lib/og"
import { SITE_DESCRIPTION } from "@/lib/site"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "neu",
    short_name: "neu",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: SURFACE,
    theme_color: SURFACE,
    icons: [
      { src: "/icons/192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
