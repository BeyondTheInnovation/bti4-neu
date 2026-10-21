import { Button } from "@/registry/neu/ui/neu/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/neu/ui/neu/card"

export function NeuCardDemo() {
  return (
    <div className="neu-ground grid max-w-2xl gap-8 rounded-(--neu-radius) p-8 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Raised card</CardTitle>
          <CardDescription>The default surface sits proud.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Shadows, face and text all derive from the surface token.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
      <Card surface="well">
        <CardHeader>
          <CardTitle>Well card</CardTitle>
          <CardDescription>Carved into the page.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            The inset shade paints over content, so images stay carved.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
