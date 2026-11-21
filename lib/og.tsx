export const SURFACE = "#e2e5e8"
export const INK = "#1f2933"
export const MUTED = "#56616d"
export const RAISED = "14px 14px 28px #bcc1c7, -14px -14px 28px #ffffff"
export const PRESSED =
  "inset 6px 6px 12px #bcc1c7, inset -6px -6px 12px #ffffff"

const BTI_MARK = [
  ["#686867", "#0C5494", "#3C84C4"],
  ["#3C84C4", "#CBCBCA", "#0C5494"],
  ["#0C5494", "#3C84C4", "#686867"],
]

export function BtiMark({ size }: { size: number }) {
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
