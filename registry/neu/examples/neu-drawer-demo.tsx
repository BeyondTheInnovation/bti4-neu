"use client"

import { Button } from "@/registry/neu/ui/neu/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/neu/ui/neu/drawer"

export function NeuDrawerDemo() {
  return (
    <div className="neu-ground flex items-center gap-4 rounded-(--neu-radius) p-8">
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Bottom sheet</DrawerTitle>
            <DrawerDescription>
              A floating sheet sliding in from the screen edge, grab handle
              carved in.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
