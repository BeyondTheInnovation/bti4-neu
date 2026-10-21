"use client"

import { toast } from "sonner"

import { Button } from "@/registry/neu/ui/neu/button"
import { Toaster } from "@/registry/neu/ui/neu/sonner"

export function NeuSonnerDemo() {
  return (
    <div className="neu-ground flex flex-wrap gap-3 rounded-(--neu-radius) p-8">
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => {},
            },
          })
        }
      >
        Show toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.success("Changes saved")}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.warning("Storage almost full")}
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.error("Something went wrong")}
      >
        Error
      </Button>
      <Toaster />
    </div>
  )
}
