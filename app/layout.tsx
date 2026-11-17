import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { SiteProvider } from "@/components/site-provider"
import { SiteThemeScript } from "@/components/site-theme-script"
import { DevTools } from "@/lib/dev/dev-tools"
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site"
import { JsonLd, ORGANIZATION, WEBSITE } from "@/lib/structured-data"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "neu · Neumorphic shadcn components",
    template: "%s · neu",
  },
  description: SITE_DESCRIPTION,
  applicationName: "neu",
  authors: [
    { name: "Beyond The Innovation", url: "https://beyondtheinnovation.com" },
  ],
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "neu",
    title: "neu · Neumorphic shadcn components",
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e2e5e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a222b" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  /* suppressHydrationWarning: SiteProvider sets the theme class on html
     before hydration, which the server render cannot know about. */
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SiteThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteProvider>{children}</SiteProvider>
        <DevTools />
        <JsonLd data={{ "@graph": [WEBSITE, ORGANIZATION] }} />
      </body>
    </html>
  )
}
