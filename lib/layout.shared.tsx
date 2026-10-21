import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "neu",
      url: "/",
    },
    links: [
      {
        text: "Playground",
        url: "/playground",
      },
    ],
  }
}
