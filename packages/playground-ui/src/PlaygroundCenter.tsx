import type React from "react"

import {
  CenterContent,
  CenterFooter,
  CenterHeader,
  CenterLayout,
} from "@hyunsdev/ui/layouts/center"

import { PlaygroundTools } from "./PlaygroundTools"

export function PlaygroundCenter({
  children,
  title,
  description,
  width = "400px",
  className,
}: {
  children?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  width?: string
  className?: string
}) {
  return (
    <CenterLayout className={className}>
      <CenterHeader className="flex flex-col gap-1 py-3">
        {title && <code className="text-sm font-bold">{title}</code>}
        {description && <p className="text-text-muted text-center text-xs">{description}</p>}
      </CenterHeader>
      <CenterContent style={{ width }}>{children}</CenterContent>
      <CenterFooter className="py-3">
        <PlaygroundTools />
      </CenterFooter>
    </CenterLayout>
  )
}
