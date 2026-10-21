import { Separator } from "@/registry/neu/ui/neu/separator"

export function NeuSeparatorDemo() {
  return (
    <div className="neu-ground flex flex-col gap-4 rounded-(--neu-radius) p-8">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Engraved line</p>
        <p className="text-sm text-(--neu-text-muted)">
          A dark crease over a lit edge, cut into the surface.
        </p>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  )
}
