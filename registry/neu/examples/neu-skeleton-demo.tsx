"use client"

import { Skeleton } from "@/registry/neu/ui/neu/skeleton"

export function NeuSkeletonDemo() {
  return (
    <div className="neu-ground flex items-center gap-4 rounded-(--neu-radius) p-8">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}
