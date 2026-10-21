type Oklch = { l: number; c: number; h: number }
type Rgb = [number, number, number]

const toLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
const toGamma = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function hexToRgb(hex: string): Rgb {
  const m = hex.replace("#", "")
  const full = m.length === 3 ? [...m].map((ch) => ch + ch).join("") : m
  const n = parseInt(full.slice(0, 6), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function rgbToHex([r, g, b]: Rgb) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round(clamp01(v) * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  )
}

function rgbToOklch(rgb: Rgb): Oklch {
  const [r, g, b] = rgb.map(toLinear)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return {
    l: L,
    c: Math.hypot(A, B),
    h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360,
  }
}

function oklchToRgb({ l: L, c, h }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180
  const A = c * Math.cos(hr)
  const B = c * Math.sin(hr)
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  return [r, g, bl].map((v) => clamp01(toGamma(v))) as Rgb
}

function luminance(rgb: Rgb) {
  const [r, g, b] = rgb.map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: Rgb, b: Rgb) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function over(top: Rgb, alpha: number, bottom: Rgb): Rgb {
  return top.map((v, i) => v * alpha + bottom[i] * (1 - alpha)) as Rgb
}

/* Mirrors the theme's self-scaling clamp: dark surfaces get up to 1.6x shade. */
function shadeBoost(l: number) {
  return Math.min(1.6, Math.max(1, 1.9 - l * 1.5))
}

export type Swatches = {
  surface: string
  l: number
  hue: number
  chroma: number
  boost: number
  darkL: number
  lightL: number
  dark: string
  light: string
  darkSeen: string
  lightSeen: string
  darkContrast: number
  lightContrast: number
  faceDark: string
  faceLight: string
  lightClipped: boolean
  darkClipped: boolean
}

function swatches(
  surfaceHex: string,
  opts: {
    shadeDark: number
    shadeLight: number
    alpha: number
    face: number
  }
): Swatches {
  const rgb = hexToRgb(surfaceHex)
  const base = rgbToOklch(rgb)
  const boost = shadeBoost(base.l)
  const darkL = base.l - opts.shadeDark * boost
  const lightL = base.l + opts.shadeLight * boost
  const darkRgb = oklchToRgb({ ...base, l: clamp01(darkL) })
  const lightRgb = oklchToRgb({ ...base, l: clamp01(lightL) })
  const darkSeen = over(darkRgb, opts.alpha, rgb)
  const lightSeen = over(lightRgb, opts.alpha, rgb)
  return {
    surface: surfaceHex,
    l: base.l,
    hue: base.h,
    chroma: base.c,
    boost,
    darkL,
    lightL,
    dark: rgbToHex(darkRgb),
    light: rgbToHex(lightRgb),
    darkSeen: rgbToHex(darkSeen),
    lightSeen: rgbToHex(lightSeen),
    darkContrast: contrast(darkSeen, rgb),
    lightContrast: contrast(lightSeen, rgb),
    faceDark: rgbToHex(oklchToRgb({ ...base, l: clamp01(base.l - opts.face) })),
    faceLight: rgbToHex(
      oklchToRgb({ ...base, l: clamp01(base.l + opts.face) })
    ),
    lightClipped: lightL > 1,
    darkClipped: darkL < 0,
  }
}

function isHex(v: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)
}

function surfaceTone(hex: string) {
  return rgbToOklch(hexToRgb(hex)).l < 0.6 ? "dark" : "light"
}

export { isHex, oklchToRgb, rgbToHex, surfaceTone, swatches }
