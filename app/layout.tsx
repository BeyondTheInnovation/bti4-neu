import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { SiteProvider } from "@/components/site-provider"
import { SiteThemeScript } from "@/components/site-theme-script"
import { DevTools } from "@/lib/dev/dev-tools"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const description =
  "Neumorphic shadcn components with soft surfaces, token-driven theming and guaranteed-contrast text."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "neu · Neumorphic shadcn components",
    template: "%s · neu",
  },
  description,
  applicationName: "neu",
  authors: [
    { name: "Beyond The Innovation", url: "https://beyondtheinnovation.com" },
  ],
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "neu",
    title: "neu · Neumorphic shadcn components",
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
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
      </body>
    </html>
  )
}
