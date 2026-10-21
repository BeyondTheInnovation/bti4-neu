import { Button } from "@/registry/neu/ui/neu/button"

export function NeuButtonDemo() {
  return (
    <div className="neu-ground flex flex-wrap items-center gap-4 rounded-(--neu-radius) p-8">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button surface="flat">Flat</Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
