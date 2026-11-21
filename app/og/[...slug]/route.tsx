import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import { BtiMark, INK, MUTED, PRESSED, RAISED, SURFACE } from "@/lib/og"
import { source } from "@/lib/source"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs.length > 0)
    .map((page) => ({ slug: [...page.slugs, "image.png"] }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page) notFound()

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: SURFACE,
        color: INK,
        padding: 80,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 150,
            height: 88,
            borderRadius: 28,
            boxShadow: RAISED,
            fontSize: 56,
            letterSpacing: -2.5,
            paddingBottom: 6,
          }}
        >
          neu
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, letterSpacing: -3, lineHeight: 1.05 }}>
            {page.data.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.35,
              color: MUTED,
              maxWidth: 760,
              maxHeight: 114,
              overflow: "hidden",
            }}
          >
            {page.data.description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 24,
            color: MUTED,
          }}
        >
          <BtiMark size={48} />
          Beyond The Innovation
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 240,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 160,
            height: 160,
            borderRadius: 999,
            boxShadow: RAISED,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 100,
              height: 100,
              borderRadius: 999,
              boxShadow: PRESSED,
            }}
          />
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
