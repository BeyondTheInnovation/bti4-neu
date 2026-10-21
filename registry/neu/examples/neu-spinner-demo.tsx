import { Spinner } from "@/registry/neu/ui/neu/spinner"

export function NeuSpinnerDemo() {
  return (
    <div className="neu-ground flex items-center gap-6 rounded-(--neu-radius) p-8">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
      <Spinner className="size-10" />
    </div>
  )
}
