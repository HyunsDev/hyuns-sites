import type { ReactNode } from "react"

import { cn } from "@hyunsdev/ui/lib/utils"

type PresentationSlideShellProps = {
  readonly ariaLabel: string
  readonly children: ReactNode
  readonly className?: string
  readonly title: string
}

export function PresentationSlideShell({
  ariaLabel,
  children,
  className,
  title,
}: PresentationSlideShellProps) {
  return (
    <section
      className={cn(
        "@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal",
        className
      )}
      aria-label={ariaLabel}
    >
      <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-[5.2cqh] px-[6.8cqw] py-[7.2cqh]">
        <h1 className="max-w-[24ch] text-[clamp(1.35rem,3cqw,2.65rem)] leading-[1.12] font-bold tracking-normal text-balance">
          {title}
        </h1>
        {children}
      </div>
    </section>
  )
}

type SlideTwoColumnProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly variant?: "balanced" | "visualWide"
}

export function SlideTwoColumn({
  children,
  className,
  variant = "balanced",
}: SlideTwoColumnProps) {
  return (
    <div
      className={cn(
        "grid min-h-0 items-center gap-[4.8cqw]",
        variant === "visualWide"
          ? "grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]"
          : "grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
        className
      )}
    >
      {children}
    </div>
  )
}

type SlideKeywordsProps = {
  readonly children: ReactNode
  readonly className?: string
}

export function SlideKeywords({ children, className }: SlideKeywordsProps) {
  return <div className={cn("grid gap-[2.1cqh]", className)}>{children}</div>
}

type SlideKeywordProps = {
  readonly children: ReactNode
}

export function SlideKeyword({ children }: SlideKeywordProps) {
  return (
    <p className="grid grid-cols-[0.34cqw_minmax(0,1fr)] items-start gap-[1.1cqw] text-[clamp(0.95rem,2.1cqw,1.78rem)] leading-[1.16] font-bold tracking-normal text-balance">
      <span className="mt-[0.18em] h-[1em] rounded-full bg-text-normal" />
      <span>{children}</span>
    </p>
  )
}

type SlideVisualStageProps = {
  readonly children: ReactNode
  readonly className?: string
}

export function SlideVisualStage({
  children,
  className,
}: SlideVisualStageProps) {
  return (
    <div className={cn("relative min-h-0 w-full", className)}>{children}</div>
  )
}
