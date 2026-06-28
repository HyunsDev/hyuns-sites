import {
  BlendIcon,
  CheckIcon,
  Code2Icon,
  CopyIcon,
  FlaskConicalIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Badge } from "@hyunsdev/ui/components/badge"
import { Button } from "@hyunsdev/ui/components/button"
import { cn } from "@hyunsdev/ui/lib/utils"
import { SRGB_P3_COMPARE_PRESETS } from "./srgb-p3-compare-models.ts"
import type {
  SrgbP3CodeRow,
  SrgbP3CompareResult,
  SrgbP3ConversionSwatch,
} from "./srgb-p3-compare-models.ts"

export function IntroPanel({
  parsed,
  result,
}: {
  readonly parsed: boolean
  readonly result: SrgbP3CompareResult | null
}) {
  return (
    <div className="max-w-sm rounded-md border border-border bg-background-primary/90 p-4 shadow-sm backdrop-blur">
      <code className="flex items-center gap-2 text-sm font-bold">
        <BlendIcon className="size-4" />
        sRGB / P3 코드 비교
      </code>
      <p className="mt-1 hidden text-xs leading-5 text-text-muted sm:block">
        하나의 CSS 색을 sRGB fallback과 Display P3 코드로 나란히 비교합니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant={parsed ? "normal" : "destructive"}>
          {parsed ? "parsed" : "invalid"}
        </Badge>
        {result && (
          <>
            <Badge variant={result.inSrgb ? "outline" : "normal"}>
              sRGB: {result.inSrgb ? "in" : "out"}
            </Badge>
            <Badge variant={result.inDisplayP3 ? "outline" : "destructive"}>
              Display P3: {result.inDisplayP3 ? "in" : "out"}
            </Badge>
            <Badge variant={result.status === "p3-only" ? "normal" : "outline"}>
              {result.statusLabel}
            </Badge>
          </>
        )}
      </div>
    </div>
  )
}

export function InputPanel({
  inputValue,
  onInputChange,
  parsed,
  pickerValue,
}: {
  readonly inputValue: string
  readonly onInputChange: (value: string) => void
  readonly parsed: boolean
  readonly pickerValue: string
}) {
  return (
    <div className="grid w-full max-w-[min(100%,44rem)] gap-3 rounded-md border border-border bg-background-primary/90 p-3 shadow-sm backdrop-blur">
      <label className="grid gap-1.5 text-xs">
        <span className="font-medium">CSS color input</span>
        <span className="grid grid-cols-[2.75rem_1fr] gap-2">
          <input
            type="color"
            value={pickerValue}
            className="h-10 w-11 rounded-md border border-border bg-transparent p-1"
            aria-label="sRGB / P3 color picker"
            onChange={(event) => onInputChange(event.currentTarget.value)}
          />
          <input
            value={inputValue}
            className={cn(
              "h-10 min-w-0 rounded-md border border-field-border bg-background-primary px-3 font-mono text-xs ring-offset-background-primary transition outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
              !parsed && "border-border-error text-text-error"
            )}
            aria-label="sRGB / P3 CSS color text input"
            onChange={(event) => onInputChange(event.currentTarget.value)}
          />
        </span>
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {SRGB_P3_COMPARE_PRESETS.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant="outline"
            className="min-w-0 justify-start overflow-hidden text-xs"
            onClick={() => onInputChange(preset)}
          >
            <span className="truncate">{preset}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export function CodeCard({
  copiedKey,
  copyPrefix,
  description,
  onCopy,
  rows,
  title,
}: {
  readonly copiedKey: string | null
  readonly copyPrefix: string
  readonly description: string
  readonly onCopy: (key: string, value: string) => void
  readonly rows: readonly SrgbP3CodeRow[]
  readonly title: string
}) {
  return (
    <section className="grid min-w-0 gap-3 rounded-md border border-border bg-background-primary/92 p-3 shadow-sm backdrop-blur">
      <div className="grid gap-1">
        <code className="flex items-center gap-2 text-sm font-bold">
          <Code2Icon className="size-4" />
          {title}
        </code>
        <p className="text-xs leading-5 text-text-muted">{description}</p>
      </div>
      <div className="grid gap-2">
        {rows.map((row) => {
          const key = `${copyPrefix}:${row.id}`

          return (
            <CodeRow
              key={key}
              row={row}
              copied={copiedKey === key}
              copyKey={key}
              onCopy={onCopy}
            />
          )
        })}
      </div>
    </section>
  )
}

function CodeRow({
  copied,
  copyKey,
  onCopy,
  row,
}: {
  readonly copied: boolean
  readonly copyKey: string
  readonly onCopy: (key: string, value: string) => void
  readonly row: SrgbP3CodeRow
}) {
  const CopyStateIcon = copied ? CheckIcon : CopyIcon

  return (
    <div className="grid min-w-0 gap-2 rounded-md bg-background-secondary/60 p-2 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
      <span className="text-xs font-medium text-text-muted">{row.label}</span>
      <code className="min-w-0 text-xs leading-5 break-all whitespace-pre-wrap">
        {row.value}
      </code>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-2"
        aria-label={`Copy ${row.label} from ${copyKey}`}
        onClick={() => onCopy(copyKey, row.value)}
      >
        <CopyStateIcon className="size-4" />
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

export function SwatchComparison({
  swatches,
}: {
  readonly swatches: readonly SrgbP3ConversionSwatch[]
}) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-background-primary/92 p-3 shadow-sm backdrop-blur">
      <code className="flex items-center gap-2 text-sm font-bold">
        <FlaskConicalIcon className="size-4" />
        P3 to sRGB fallback
      </code>
      <div className="grid gap-3 md:grid-cols-3">
        {swatches.map((swatch) => (
          <div key={swatch.id} className="grid min-w-0 gap-2">
            <div
              className="h-20 rounded-md border border-border"
              style={{ backgroundColor: swatch.color }}
            />
            <div className="grid gap-1">
              <span className="text-xs font-medium">{swatch.label}</span>
              <code className="text-xs leading-5 break-all text-text-muted">
                {swatch.css}
              </code>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function InvalidColorPanel() {
  return (
    <div className="rounded-md border border-border-error/40 bg-background-primary/92 p-4 text-sm shadow-sm backdrop-blur">
      <code className="flex items-center gap-2 font-bold text-text-error">
        <TriangleAlertIcon className="size-4" />
        파싱할 수 없는 CSS 색상입니다.
      </code>
      <p className="mt-2 text-xs leading-5 text-text-muted">
        예: <code>#ff5a3d</code>, <code>oklch(70% 0.18 32)</code>,{" "}
        <code>color(display-p3 1 0 0)</code>
      </p>
    </div>
  )
}
