import {
  CrosshairIcon,
  TriangleAlertIcon,
} from "lucide-react"

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

export function CieRgbIntroPanel() {
  return (
    <div className="inline-flex rounded-md border border-border bg-background-primary/90 px-3 py-2 shadow-sm backdrop-blur">
      <code className="flex items-center gap-2 text-xs font-bold sm:text-sm">
        <CrosshairIcon className="size-4" />
        CIE 1931 RGB 색역 비교
      </code>
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
    <section className="grid w-full max-w-[min(100%,40rem)] gap-2 rounded-md border border-border bg-background-primary/90 p-2 shadow-sm backdrop-blur">
      <div className="grid grid-cols-3 gap-2">
        {RGB_CHANNELS.map((channel) => (
          <label key={channel.id} className="grid gap-1 text-[0.68rem] sm:text-xs">
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
                "h-9 min-w-0 rounded-md border border-field-border bg-background-primary px-2 font-mono text-xs ring-offset-background-primary transition outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
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
            className="h-8 min-w-0 justify-start overflow-hidden px-2 text-xs"
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
    ? `x ${formatCieRgbNumber(point.chromaticity.x)}  y ${formatCieRgbNumber(
        point.chromaticity.y
      )}  Y ${formatCieRgbNumber(point.xyz.y)}`
    : "xy undefined"
}

function createSrgbFallback(point: CieRgbGamutPoint) {
  return `rgb(${point.encodedRgb.r} ${point.encodedRgb.g} ${point.encodedRgb.b})`
}

export function CieRgbPreviewColumn({
  className,
  comparison,
}: {
  readonly className?: string
  readonly comparison: CieRgbGamutComparison
}) {
  if (comparison.status === "invalid") {
    return null
  }

  return (
    <section
      aria-label="색공간별 RGB 색 미리보기"
      className={cn(
        "grid grid-cols-[3.25rem_minmax(8rem,auto)] overflow-hidden rounded-md border border-border bg-background-primary/92 shadow-sm backdrop-blur sm:grid-cols-[3.75rem_minmax(10rem,auto)]",
        className
      )}
    >
      <div className="grid">
        {comparison.points.map((point) => (
          <div
            key={point.targetId}
            className="h-12 w-[3.25rem] sm:h-14 sm:w-[3.75rem]"
            title={`${point.label}: ${point.previewColor}`}
            style={{
              backgroundColor: createSrgbFallback(point),
              backgroundImage: `linear-gradient(${point.previewColor}, ${point.previewColor})`,
            }}
          />
        ))}
      </div>
      <div className="grid">
        {comparison.points.map((point) => (
          <div
            key={point.targetId}
            className="grid h-12 min-w-0 content-center gap-0.5 border-l border-border/60 bg-background-primary/88 px-2 sm:h-14"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: point.lineColor }}
              />
              <span className="truncate text-[0.68rem] font-medium sm:text-xs">
                {point.label}
              </span>
            </div>
            <code className="truncate text-[0.62rem] leading-3 text-text-muted tabular-nums sm:text-[0.68rem] sm:leading-4">
              {formatChromaticity(point)}
            </code>
          </div>
        ))}
      </div>
    </section>
  )
}
