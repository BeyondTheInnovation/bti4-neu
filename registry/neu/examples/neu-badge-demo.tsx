import { Badge } from "@/registry/neu/ui/neu/badge"

export function NeuBadgeDemo() {
  return (
    <div className="neu-ground flex flex-wrap items-center gap-4 rounded-(--neu-radius) p-8">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link" asChild>
        <a href="#">Link</a>
      </Badge>
    </div>
  )
}
