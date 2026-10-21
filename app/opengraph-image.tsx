import { ImageResponse } from "next/og"

export const alt = "neu: neumorphic shadcn components by Beyond The Innovation"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const SURFACE = "#e2e5e8"
const INK = "#1f2933"
const MUTED = "#56616d"
const RAISED = "14px 14px 28px #bcc1c7, -14px -14px 28px #ffffff"
const PRESSED = "inset 6px 6px 12px #bcc1c7, inset -6px -6px 12px #ffffff"

const BTI_MARK = [
  ["#686867", "#0C5494", "#3C84C4"],
  ["#3C84C4", "#CBCBCA", "#0C5494"],
  ["#0C5494", "#3C84C4", "#686867"],
]

function BtiMark({ size }: { size: number }) {
  const cell = size * 0.28
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: size,
        height: size,
      }}
    >
      {BTI_MARK.map((row, r) => (
        <div
          key={r}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {row.map((fill, c) => (
            <div
              key={c}
              style={{
                display: "flex",
                width: cell,
                height: cell,
                background: fill,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

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
