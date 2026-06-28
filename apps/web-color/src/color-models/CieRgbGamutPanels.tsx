import {
  CrosshairIcon,
  GaugeIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Badge } from "@hyunsdev/ui/components/badge"
import { Button } from "@hyunsdev/ui/components/button"
import { cn } from "@hyunsdev/ui/lib/utils"
import {
  CIE_RGB_INPUT_PRESETS,
  formatCieRgbNumber,
} from "@/color-models/cie-rgb-gamut-models"
import type {
  CieRgbChannelId,
  CieRgbGamutComparison,
  CieRgbGamutPoint,
  CieRgbInputFields,
} from "@/color-models/cie-rgb-gamut-models"

const RGB_CHANNELS = [
  { id: "r", label: "R" },
  { id: "g", label: "G" },
  { id: "b", label: "B" },
] as const satisfies readonly {
  readonly id: CieRgbChannelId
  readonly label: string
}[]

export function CieRgbIntroPanel({
  comparison,
}: {
  readonly comparison: CieRgbGamutComparison
}) {
  return (
    <div className="max-w-sm rounded-md border border-border bg-background-primary/90 p-4 shadow-sm backdrop-blur">
      <code className="flex items-center gap-2 text-sm font-bold">
        <CrosshairIcon className="size-4" />
        CIE 1931 RGB 색역 비교
      </code>
      <p className="mt-1 hidden text-xs leading-5 text-text-muted sm:block">
        같은 0-255 RGB 코드를 sRGB, Display P3, BT.2020 기준으로 각각 해석해
        xy 색도도 위의 위치 차이를 봅니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant={comparison.status === "parsed" ? "normal" : "destructive"}>
          {comparison.status === "parsed" ? "parsed" : "invalid"}
        </Badge>
        <Badge variant="outline">D65 white</Badge>
        <Badge variant="outline">encoded RGB</Badge>
      </div>
    </div>
  )
}

export function CieRgbInputPanel({
  comparison,
  fields,
  onChannelChange,
  onPresetSelect,
}: {
  readonly comparison: CieRgbGamutComparison
  readonly fields: CieRgbInputFields
  readonly onChannelChange: (channelId: CieRgbChannelId, value: string) => void
  readonly onPresetSelect: (value: CieRgbInputFields) => void
}) {
  return (
    <section className="grid w-full max-w-[min(100%,44rem)] gap-3 rounded-md border border-border bg-background-primary/90 p-3 shadow-sm backdrop-blur">
      <div className="grid grid-cols-3 gap-2">
        {RGB_CHANNELS.map((channel) => (
          <label key={channel.id} className="grid gap-1.5 text-xs">
            <span className="font-medium">{channel.label}</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={255}
              step={1}
              value={fields[channel.id]}
              aria-label={`${channel.label} channel`}
              className={cn(
                "h-10 min-w-0 rounded-md border border-field-border bg-background-primary px-3 font-mono text-xs ring-offset-background-primary transition outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
                comparison.status === "invalid" &&
                  "border-border-error text-text-error"
              )}
              onChange={(event) =>
                onChannelChange(channel.id, event.currentTarget.value)
              }
            />
          </label>
        ))}
      </div>
      {comparison.status === "invalid" && (
        <p className="flex items-center gap-2 text-xs text-text-error">
          <TriangleAlertIcon className="size-4" />
          {comparison.message}
        </p>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-7">
        {CIE_RGB_INPUT_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            type="button"
            variant="outline"
            className="min-w-0 justify-start overflow-hidden text-xs"
            onClick={() => onPresetSelect(preset.value)}
          >
            <span className="truncate">{preset.label}</span>
          </Button>
        ))}
      </div>
    </section>
  )
}

function formatChromaticity(point: CieRgbGamutPoint) {
  return point.chromaticity
    ? `x ${formatCieRgbNumber(point.chromaticity.x)} / y ${formatCieRgbNumber(
        point.chromaticity.y
      )}`
    : "xy undefined"
}

function createSrgbFallback(point: CieRgbGamutPoint) {
  return `rgb(${point.encodedRgb.r} ${point.encodedRgb.g} ${point.encodedRgb.b})`
}

export function CieRgbPointSummaryPanel({
  className,
  comparison,
}: {
  readonly className?: string
  readonly comparison: CieRgbGamutComparison
}) {
  if (comparison.status === "invalid") {
    return (
      <section
        className={cn(
          "grid gap-2 rounded-md border border-border-error/40 bg-background-primary/92 p-3 text-sm shadow-sm backdrop-blur",
          className
        )}
      >
        <code className="flex items-center gap-2 font-bold text-text-error">
          <TriangleAlertIcon className="size-4" />
          RGB 입력을 확인해 주세요.
        </code>
        <p className="text-xs leading-5 text-text-muted">
          각 채널은 0부터 255까지의 정수로 입력합니다.
        </p>
      </section>
    )
  }

  return (
    <section
      className={cn(
        "grid gap-3 rounded-md border border-border bg-background-primary/92 p-3 shadow-sm backdrop-blur",
        className
      )}
    >
      <code className="flex items-center gap-2 text-sm font-bold">
        <GaugeIcon className="size-4" />
        RGB({comparison.input.r}, {comparison.input.g}, {comparison.input.b})
      </code>
      <div className="grid gap-2">
        {comparison.points.map((point) => (
          <div
            key={point.targetId}
            className="grid gap-2 rounded-md bg-background-secondary/60 p-2 sm:grid-cols-[5rem_1fr] sm:items-center"
          >
            <div
              className="h-12 rounded-md border"
              style={{
                backgroundColor: createSrgbFallback(point),
                backgroundImage: `linear-gradient(${point.previewColor}, ${point.previewColor})`,
                borderColor: point.lineColor,
              }}
            />
            <div className="grid min-w-0 gap-1">
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-xs font-medium">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: point.lineColor }}
                  />
                  <span className="truncate">{point.label}</span>
                </span>
                <code className="shrink-0 text-[0.68rem] text-text-muted">
                  Y {formatCieRgbNumber(point.xyz.y)}
                </code>
              </div>
              <code className="text-xs leading-5 text-text-normal">
                {formatChromaticity(point)}
              </code>
              <code className="break-all text-[0.68rem] leading-4 text-text-muted">
                {point.previewColor}
              </code>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
