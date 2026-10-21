"use client"

import dynamic from "next/dynamic"
import { devToolsEnabled } from "./enabled"

// Chosen at module level so a production build drops the import entirely.
const AskClaude = devToolsEnabled
  ? dynamic(() => import("./ask-claude").then((mod) => mod.AskClaude), {
      ssr: false,
    })
  : () => null

/** Mounts the dev tools in the root layout. */
export function DevTools() {
  return <AskClaude />
}
