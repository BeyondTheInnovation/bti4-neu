import { Button } from "@/registry/neu/ui/neu/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/neu/ui/neu/tooltip"

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>A raised hint floating above the surface.</TooltipContent>
    </Tooltip>
  )
}
