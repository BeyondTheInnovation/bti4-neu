import { SITE_URL } from "@/lib/site"

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": "https://beyondtheinnovation.com/#organization",
  name: "Beyond The Innovation",
  url: "https://beyondtheinnovation.com",
}

export const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "neu",
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": ORGANIZATION["@id"] },
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          ...data,
        }).replaceAll("<", "\u003c"),
      }}
    />
  )
}
