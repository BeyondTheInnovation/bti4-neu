"use client"

import { Button } from "@/registry/neu/ui/neu/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/neu/ui/neu/dialog"

export function NeuDialogDemo() {
  return (
    <div className="neu-ground flex items-center gap-4 rounded-(--neu-radius) p-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Floating sheet</DialogTitle>
            <DialogDescription>
              The dialog floats above the scrim and casts one shadow onto it.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm">
            Scrim, surface and text all derive from the one surface token.
          </p>
          <DialogFooter showCloseButton>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
