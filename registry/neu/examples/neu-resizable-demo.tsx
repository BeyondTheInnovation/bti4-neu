"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/neu/ui/neu/resizable"

export function NeuResizableDemo() {
  return (
    <div className="neu-ground rounded-(--neu-radius) p-8">
      <ResizablePanelGroup
        orientation="horizontal"
        className="neu-pressed mx-auto max-w-md rounded-(--neu-radius)"
      >
        <ResizablePanel defaultSize="50">
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="50">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="50">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="50">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
