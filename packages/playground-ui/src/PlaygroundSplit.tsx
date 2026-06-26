import type React from "react"

import { cn } from "@hyunsdev/ui/lib/utils"

import { PlaygroundTools } from "./PlaygroundTools"

export function PlaygroundSplit({
  children,
  title,
  description,
}: {
  children?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div className="flex">
      <PlaygroundSplitHeader title={title} description={description} />
      <PlaygroundSplitFooter />
      {children}
    </div>
  )
}

function PlaygroundSplitHeader({
  title,
  description,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div className="fixed top-0 left-0 z-100 flex w-dvw items-center justify-center">
      <div className="bg-background-secondary border-border mt-2 flex flex-col items-center justify-center rounded-xl border px-4 py-1">
        {title && <code className="text-sm font-bold">{title}</code>}
        {description && <p className="text-text-muted text-center text-xs">{description}</p>}
      </div>
    </div>
  )
}

function PlaygroundSplitFooter() {
  return (
    <div className="fixed bottom-0 left-0 z-100 flex w-dvw items-center justify-center">
      <div className="bg-background-secondary border-border flex flex-col items-center justify-center rounded-t-xl border-x border-t px-2 pt-2 pb-3">
        <PlaygroundTools />
      </div>
    </div>
  )
}

export function PlaygroundSplitPrimary({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background-primary flex h-screen w-full items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function PlaygroundSplitSecondary({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background-secondary flex h-screen w-full items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
