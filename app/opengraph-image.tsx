import { ImageResponse } from "next/og"
import { BtiMark, INK, MUTED, PRESSED, RAISED, SURFACE } from "@/lib/og"

export const alt = "neu: neumorphic shadcn components by Beyond The Innovation"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const dynamic = "force-static"

export default function OpengraphImage() {
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
            width: 220,
            height: 128,
            borderRadius: 40,
            boxShadow: RAISED,
            fontSize: 88,
            letterSpacing: -4,
            paddingBottom: 10,
          }}
        >
          neu
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 64,
              letterSpacing: -2.5,
              lineHeight: 1.05,
              maxWidth: 700,
            }}
          >
            Neumorphic components for shadcn.
          </div>
          <div style={{ fontSize: 28, color: MUTED }}>
            Soft surfaces, tunable tokens, contrast that holds.
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
          width: 300,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 200,
            height: 200,
            borderRadius: 999,
            boxShadow: RAISED,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 128,
              height: 128,
              borderRadius: 999,
              boxShadow: PRESSED,
            }}
          />
        </div>
      </div>
    </div>,
    size
  )
}
