"use client"

import { Button } from "@/registry/neu/ui/neu/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/neu/ui/neu/sheet"

export function NeuSheetDemo() {
  return (
    <div className="neu-ground flex items-center gap-4 rounded-(--neu-radius) p-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              The panel covers the page edge and becomes its own ground.
            </SheetDescription>
          </SheetHeader>
          <p className="px-4 text-sm">
            Nested surfaces keep working because the ground re-derives every
            token from the surface color.
          </p>
          <SheetFooter>
            <Button>Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
