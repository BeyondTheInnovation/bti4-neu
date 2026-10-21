"use client"

import * as React from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/neu/ui/neu/menubar"

export function NeuMenubarDemo() {
  const [wordWrap, setWordWrap] = React.useState(true)
  const [theme, setTheme] = React.useState("system")

  return (
    <div className="neu-ground flex items-center justify-center rounded-(--neu-radius) p-8">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem disabled>
              Print… (disabled)
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem
              checked={wordWrap}
              onCheckedChange={setWordWrap}
            >
              Word Wrap
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">Delete Draft</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="system">System</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
