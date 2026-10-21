"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { cn } from "@/lib/utils"

/* Sonner's own CSS is unlayered, hence the ! on the overrides below. */
const focusRing =
  "focus-visible:outline-solid! focus-visible:outline-(length:--neu-ring-width)! focus-visible:outline-offset-(--neu-ring-offset)! focus-visible:outline-[color:var(--neu-ring)]!"

/* Toasts float over the page, so they get sonner's elevation shadow, not
   the neumorphic pair. .neu-ground on the list derives the text tokens
   wherever the Toaster is mounted. */
const Toaster = ({
  theme = "system",
  toastOptions,
  ...props
}: ToasterProps) => {
  const classNames = toastOptions?.classNames

  return (
    <Sonner
      theme={theme}
      className="neu-ground toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: (
          <span className="inline-flex animate-spin">
            <Loader2Icon className="size-4" />
          </span>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--neu-surface)",
          "--normal-text": "var(--neu-text)",
          "--normal-border":
            "color-mix(in oklab, var(--neu-text) 12%, transparent)",
          "--border-radius": "calc(var(--neu-radius) * 0.75)",
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...classNames,
          toast: cn(focusRing, classNames?.toast),
          description: cn("text-(--neu-text-muted)!", classNames?.description),
          actionButton: cn(focusRing, classNames?.actionButton),
          cancelButton: cn(focusRing, classNames?.cancelButton),
          closeButton: cn(focusRing, classNames?.closeButton),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
