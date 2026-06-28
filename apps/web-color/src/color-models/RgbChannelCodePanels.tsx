import {
  CheckIcon,
  CopyIcon,
  GaugeIcon,
  HashIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Badge } from "@hyunsdev/ui/components/badge"
import { Button } from "@hyunsdev/ui/components/button"
import { cn } from "@hyunsdev/ui/lib/utils"
import { RGB_CHANNEL_CODE_PRESETS } from "./rgb-channel-code-models.ts"
import type {
  RgbChannelCodeResult,
  RgbChannelCodeRow,
  RgbChannelGamutCard,
} from "./rgb-channel-code-models.ts"

export function IntroPanel({
  parsed,
  result,
}: {
  readonly parsed: boolean
  readonly result: RgbChannelCodeResult | null
}) {
  return (
    <div className="max-w-sm rounded-md border border-border bg-background-primary/90 p-4 shadow-sm backdrop-blur">
      <code className="flex items-center gap-2 text-sm font-bold">
        <GaugeIcon className="size-4" />
        RGB 채널 코드 비교
      </code>
      <p className="mt-1 hidden text-xs leading-5 text-text-muted sm:block">
        Hex 또는 0-255 RGB 채널을 sRGB와 Display P3 코드로 동시에 표시합니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant={parsed ? "normal" : "destructive"}>
          {parsed ? "parsed" : "invalid"}
        </Badge>
        {result && (
          <>
            <Badge variant="outline">{result.inputType}</Badge>
            <Badge variant="outline">
              {result.channels.r} {result.channels.g} {result.channels.b}
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
        <span className="font-medium">Hex or RGB channel input</span>
        <span className="grid grid-cols-[2.75rem_1fr] gap-2">
          <input
            type="color"
            value={pickerValue}
            className="h-10 w-11 rounded-md border border-border bg-transparent p-1"
            aria-label="RGB channel color picker"
            onChange={(event) => onInputChange(event.currentTarget.value)}
          />
          <input
            value={inputValue}
            className={cn(
              "h-10 min-w-0 rounded-md border border-field-border bg-background-primary px-3 font-mono text-xs ring-offset-background-primary transition outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
              !parsed && "border-border-error text-text-error"
            )}
            aria-label="Hex or RGB channel text input"
            onChange={(event) => onInputChange(event.currentTarget.value)}
          />
        </span>
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {RGB_CHANNEL_CODE_PRESETS.map((preset) => (
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

export function GamutCodeCard({
  card,
  copiedKey,
  onCopy,
}: {
  readonly card: RgbChannelGamutCard
  readonly copiedKey: string | null
  readonly onCopy: (key: string, value: string) => void
}) {
  return (
    <section className="grid min-w-0 gap-3 rounded-md border border-border bg-background-primary/92 p-3 shadow-sm backdrop-blur">
      <div
        className="h-24 rounded-md border border-border"
        style={{ backgroundColor: card.swatchColor }}
      />
      <div className="grid gap-1">
        <code className="flex items-center gap-2 text-sm font-bold">
          <HashIcon className="size-4" />
          {card.title}
        </code>
        <p className="text-xs leading-5 text-text-muted">{card.description}</p>
      </div>
      <div className="grid gap-2">
        {card.rows.map((row) => {
          const key = `${card.id}:${row.id}`

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
  readonly row: RgbChannelCodeRow
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

export function InvalidInputPanel() {
  return (
    <div className="rounded-md border border-border-error/40 bg-background-primary/92 p-4 text-sm shadow-sm backdrop-blur">
      <code className="flex items-center gap-2 font-bold text-text-error">
        <TriangleAlertIcon className="size-4" />
        RGB 채널로 해석할 수 없는 입력입니다.
      </code>
      <p className="mt-2 text-xs leading-5 text-text-muted">
        예: <code>#ffffff</code>, <code>#fff</code>, <code>255 255 255</code>,{" "}
        <code>255, 0, 0</code>
      </p>
    </div>
  )
}
