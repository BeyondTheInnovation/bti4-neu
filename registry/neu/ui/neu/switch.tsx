"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import {
  capFaceClasses,
  capLiftClasses,
  capLiftSmClasses,
} from "@/registry/neu/ui/neu/knob"

/* Travel is width - 2 * padding - thumb, so the checked knob sits as far from
   the end as the unchecked one from the start: sm 44-4-18=22, default
   56-6-22=28, lg 80-6-34=40. --neu-dir flips the sign in RTL. Arbitrary
   transition properties only: transition-* utilities clobber the theme. */
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default" | "lg"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "neu-groove peer group/switch relative inline-flex shrink-0 cursor-pointer items-center after:absolute after:-inset-x-3 after:-inset-y-2 [transition:background-color_400ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[transition:none] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-destructive data-[size=default]:h-7 data-[size=default]:w-14 data-[size=default]:p-[3px] data-[size=lg]:h-10 data-[size=lg]:w-20 data-[size=lg]:p-[3px] data-[size=sm]:h-5.5 data-[size=sm]:w-11 data-[size=sm]:p-0.5 data-[state=checked]:bg-(--neu-ring) data-[size=default]:[--switch-travel:calc(28px*var(--neu-dir))] data-[size=lg]:[--switch-travel:calc(40px*var(--neu-dir))] data-[size=sm]:[--switch-travel:calc(22px*var(--neu-dir))]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          capFaceClasses,
          "pointer-events-none block translate-x-0 [transition:translate_400ms_cubic-bezier(0.23,1,0.32,1)] group-data-[size=default]/switch:size-5.5 group-data-[size=lg]/switch:size-[34px] group-data-[size=sm]/switch:size-4.5 data-[state=checked]:translate-x-(--switch-travel) motion-reduce:[transition:none]",
          size === "lg" ? capLiftClasses : capLiftSmClasses
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
