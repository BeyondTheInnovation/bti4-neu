import { SITE_URL } from "@/lib/site"

const measurementId = process.env.GA_MEASUREMENT_ID?.trim()

if (measurementId && !/^G-[A-Z0-9]+$/i.test(measurementId)) {
  throw new Error("GA_MEASUREMENT_ID must match G-[alphanumeric]")
}

export const analytics = measurementId
  ? {
      measurementId: measurementId.toUpperCase(),
      productionHostname: new URL(SITE_URL).hostname,
    }
  : null
