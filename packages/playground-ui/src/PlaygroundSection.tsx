import type React from "react"

import { Separator } from "@hyunsdev/ui/components/separator"

export function PlaygroundSection({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <code className="text-text-muted text-xs font-medium">{title}</code>
        <Separator className="flex-1" />
      </div>
      {children}
    </section>
  )
}
