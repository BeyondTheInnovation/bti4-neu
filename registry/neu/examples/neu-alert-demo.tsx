"use client"

import { AlertCircleIcon, CheckCircle2Icon, DownloadIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/neu/ui/neu/alert"
import { Button } from "@/registry/neu/ui/neu/button"

export function NeuAlertDemo() {
  return (
    <div className="neu-ground flex flex-col gap-6 rounded-(--neu-radius) p-8">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>
          A raised slab on the surface, same shadow pair as a card.
        </AlertDescription>
      </Alert>
      <Alert>
        <DownloadIcon />
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>Restart to install the new version.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="outline">
            Restart
          </Button>
        </AlertAction>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Unable to process your payment.</AlertTitle>
        <AlertDescription>
          The surface stays neu; only the text carries the alarm.
        </AlertDescription>
      </Alert>
    </div>
  )
}
