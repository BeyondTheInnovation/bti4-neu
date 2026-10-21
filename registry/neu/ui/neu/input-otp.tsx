"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

/* Each slot is its own carved well, so the stock joined-border run becomes a
   row of separate wells; the active slot gets the focus outline, not depth. */
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "neu-pressed neu-field neu-concave relative flex h-9 w-9 items-center justify-center rounded-[calc(var(--neu-radius)/2)] text-sm [--neu-depth:0.33] aria-invalid:border-2 aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:outline-(length:--neu-ring-width) data-[active=true]:outline-offset-(--neu-ring-offset) data-[active=true]:outline-[color:var(--neu-ring)] data-[active=true]:aria-invalid:outline-destructive",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-current duration-1000 motion-reduce:animate-none" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className={cn("flex items-center", className)}
      role="separator"
      {...props}
    >
      <MinusIcon className="size-4 text-(--neu-text-muted)" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
