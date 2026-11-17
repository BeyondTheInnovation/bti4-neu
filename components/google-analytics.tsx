"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function GoogleAnalytics({
  measurementId,
  productionHostname,
}: {
  measurementId: string
  productionHostname: string
}) {
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.hostname !== productionHostname) return
    if (!window.gtag) {
      const dataLayer = (window.dataLayer ??= [])
      // gtag.js only reads entries pushed as an arguments object.
      window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments)
      }
      window.gtag("js", new Date())
      window.gtag("config", measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      })
      const script = document.createElement("script")
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
      document.head.appendChild(script)
    }
    window.gtag("event", "page_view", {
      page_location: window.location.origin + pathname,
      page_referrer: "",
      page_title: document.title,
    })
  }, [measurementId, productionHostname, pathname])

  return null
}
