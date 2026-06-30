import { useMemo } from "react"

import { Input } from "@hyunsdev/ui/components/input"
import { Switch } from "@hyunsdev/ui/components/switch"
import { cn } from "@hyunsdev/ui/lib/utils"

import { ColorAxisBarCanvas } from "@/color-models/ColorAxisBarCanvas"
import {
  COLOR_COORDINATE_MODEL_BY_ID,
  readColorCoordinateAxis,
} from "@/color-models/color-coordinate-utils"
import type {
  ColorCoordinate,
  ColorCoordinateAxis,
  ColorCoordinateModelId,
} from "@/color-models/color-coordinate-utils"
import type { SolidColorSpaceHighlightResult } from "@/color-models/color-space-solid-highlight"
import type { ColorSpaceModelId } from "@/color-models/color-space-models"
import {
  createSolidTargetCoordinate,
  formatSolidTargetCoordinate,
  type SolidTargetCoordinateResult,
} from "@/color-models/color-space-solid-target-coordinate"

type ColorSpaceSolidTargetInputProps = {
  readonly className?: string
  readonly enabled: boolean
  readonly modelId: ColorSpaceModelId
  readonly onChange: (value: string) => void
  readonly onEnabledChange: (enabled: boolean) => void
  readonly result: SolidColorSpaceHighlightResult
  readonly value: string
}

const TARGET_STATUS_LABELS = {
  empty: "off",
  invalid: "invalid",
  line: "line",
  point: "point",
  surface: "surface",
  unsupported: "unsupported",
} as const

export function ColorSpaceSolidTargetInput({
  className,
  enabled,
  modelId,
  onChange,
  onEnabledChange,
  result,
  value,
}: ColorSpaceSolidTargetInputProps) {
  const coordinateResult = useMemo(
    () =>
      enabled
        ? createSolidTargetCoordinate({ modelId, value })
        : ({ status: "empty" } satisfies SolidTargetCoordinateResult),
    [enabled, modelId, value]
  )
  const isRejected = result.status === "invalid" || result.status === "unsupported"
  const statusLabel = getTargetStatusLabel(result)
  const pointSwatchStyle =
    result.status === "ready" && result.highlight.kind === "point"
      ? { backgroundColor: value }
      : undefined

  return (
    <div className={cn("grid gap-1.5 text-xs", className)}>
      <label className="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2">
        <span className="font-medium text-text-muted">CSS Target</span>
        <Switch
          size="sm"
          checked={enabled}
          onCheckedChange={onEnabledChange}
          aria-label="Toggle CSS target"
          className="justify-self-end"
        />
      </label>
      {enabled ? (
        <div className="grid gap-1.5">
          <span className="grid grid-cols-[2rem_minmax(0,1fr)_4.8rem] items-center gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "size-8 shrink-0 rounded-md border border-border bg-background-secondary",
                isRejected && "border-border-error"
              )}
              style={pointSwatchStyle}
            />
            <Input
              type="text"
              value={value}
              aria-label="CSS target color"
              aria-invalid={isRejected ? true : undefined}
              placeholder="oklch(70% 0.18 32)"
              spellCheck={false}
              onChange={(event) => onChange(event.currentTarget.value)}
            />
            <span className="truncate text-right font-mono text-[0.68rem] leading-none text-text-muted">
              {statusLabel}
            </span>
          </span>
          <TargetAxisBars result={coordinateResult} onChange={onChange} />
        </div>
      ) : null}
    </div>
  )
}

function TargetAxisBars({
  onChange,
  result,
}: {
  readonly onChange: (value: string) => void
  readonly result: SolidTargetCoordinateResult
}) {
  switch (result.status) {
    case "ready": {
      const model = COLOR_COORDINATE_MODEL_BY_ID[result.modelId]

      return (
        <div className="grid gap-1.5">
          {model.axes.map((axis) => (
            <TargetAxisBar
              key={axis.id}
              axis={axis}
              coordinate={result.coordinate}
              modelId={result.modelId}
              onChange={onChange}
            />
          ))}
        </div>
      )
    }
    case "partial":
      return (
        <p className="text-[0.68rem] leading-4 text-text-muted">
          Axis bars are unavailable for partial CSS colors.
        </p>
      )
    case "unsupported":
      return (
        <p className="text-[0.68rem] leading-4 text-text-muted">
          Axis bars are unavailable for this model.
        </p>
      )
    case "empty":
    case "invalid":
      return null
    default:
      return assertNeverCoordinateResult(result)
  }
}

function TargetAxisBar({
  axis,
  coordinate,
  modelId,
  onChange,
}: {
  readonly axis: ColorCoordinateAxis
  readonly coordinate: ColorCoordinate
  readonly modelId: ColorCoordinateModelId
  readonly onChange: (value: string) => void
}) {
  const value = readColorCoordinateAxis(coordinate, axis.id)

  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] items-center gap-2 text-xs">
      <span className="min-w-0 truncate font-medium text-text-muted">
        {axis.shortLabel}: {axis.label}
      </span>
      <div className="grid min-w-0 grid-cols-[minmax(5rem,1fr)_3.75rem] items-center gap-2">
        <ColorAxisBarCanvas
          axisId={axis.id}
          coordinate={coordinate}
          modelId={modelId}
          className="h-7 shadow-none"
          onChange={(nextCoordinate) => {
            onChange(formatSolidTargetCoordinate(nextCoordinate))
          }}
        />
        <code className="justify-self-end text-[0.68rem] leading-none text-text-muted">
          {formatAxisValue(value, axis.unit)}
        </code>
      </div>
    </div>
  )
}

function formatAxisValue(value: number, unit: string) {
  switch (unit) {
    case "degree":
      return `${Math.round(value)}deg`
    case "percent":
      return `${Math.round(value)}%`
    case "number":
      return Number.isInteger(value) ? String(value) : value.toFixed(3)
    default:
      return String(value)
  }
}

function getTargetStatusLabel(result: SolidColorSpaceHighlightResult) {
  switch (result.status) {
    case "empty":
      return TARGET_STATUS_LABELS.empty
    case "invalid":
      return TARGET_STATUS_LABELS.invalid
    case "unsupported":
      return TARGET_STATUS_LABELS.unsupported
    case "ready":
      return TARGET_STATUS_LABELS[result.highlight.kind]
    default:
      return assertNeverResult(result)
  }
}

function assertNeverResult(result: never): never {
  throw new RangeError(`Unknown target status: ${result}`)
}

function assertNeverCoordinateResult(result: never): never {
  throw new RangeError(`Unknown target coordinate status: ${result}`)
}
