import { useEffect, useRef } from "react"

import { Slider } from "@hyunsdev/ui/components/slider"
import {
  getSolidSliceAxes,
  getSolidSliceAxis,
  isSolidSliceModel,
} from "@/color-models/color-space-solid-slice"
import type {
  SolidSliceAxisId,
  SolidSliceModelId,
  SolidSliceState,
} from "@/color-models/color-space-solid-slice"
import type { ColorSpaceModelId } from "@/color-models/color-space-models"
import { cn } from "@hyunsdev/ui/lib/utils"

type ColorSpaceSolidSliceControlsProps = {
  readonly className?: string
  readonly modelId: ColorSpaceModelId
  readonly onSliceChange: (slice: SolidSliceState) => void
  readonly slice: SolidSliceState
  readonly sliceEnabled: boolean
}

export function ColorSpaceSolidSliceControls({
  className,
  modelId,
  onSliceChange,
  slice,
  sliceEnabled,
}: ColorSpaceSolidSliceControlsProps) {
  if (!isSolidSliceModel(modelId)) {
    return null
  }

  return (
    <SupportedSliceControls
      className={className}
      modelId={modelId}
      axisId={slice.axisId}
      value={slice.value}
      sliceEnabled={sliceEnabled}
      onSliceChange={onSliceChange}
    />
  )
}

function AxisSliceSlider({
  axis,
  disabled,
  isActive,
  onSliceChange,
  value,
}: {
  readonly axis: ReturnType<typeof getSolidSliceAxes>[number]
  readonly disabled: boolean
  readonly isActive: boolean
  readonly onSliceChange: (slice: SolidSliceState) => void
  readonly value: number
}) {
  const sliderLabel = `${axis.label} slice value`

  return (
    <div
      className={cn(
        "grid grid-cols-[8rem_minmax(0,1fr)] items-center gap-2 text-xs",
        !disabled && !isActive && "opacity-70"
      )}
    >
      <span
        className={cn(
          "flex min-w-0 items-center gap-1.5 truncate font-medium",
          isActive ? "text-text-normal" : "text-text-muted"
        )}
        style={{ color: axis.color }}
      >
        <span
          className="size-1.5 shrink-0 rounded-full bg-current"
          aria-hidden="true"
        />
        <span className="min-w-0 truncate">
          {axis.coordinateLabel}: {axis.label}
        </span>
      </span>
      <div className="grid min-w-0 grid-cols-[minmax(5rem,1fr)_3.75rem] items-center gap-2">
        <LabeledSlider
          disabled={disabled}
          min={axis.min}
          max={axis.max}
          step={axis.step}
          value={[value]}
          ariaLabel={sliderLabel}
          onValueChange={(values) => {
            const nextValue = values[0]

            if (!disabled && nextValue !== undefined) {
              onSliceChange({ axisId: axis.id, value: nextValue })
            }
          }}
        />
        <code className="justify-self-end text-[0.68rem] leading-none text-text-muted">
          {formatSliceValue(value, axis.unit)}
        </code>
      </div>
    </div>
  )
}

function LabeledSlider({
  ariaLabel,
  disabled,
  max,
  min,
  onValueChange,
  step,
  value,
}: {
  readonly ariaLabel: string
  readonly disabled: boolean
  readonly max: number
  readonly min: number
  readonly onValueChange: (value: readonly number[]) => void
  readonly step: number
  readonly value: number[]
}) {
  const sliderHostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sliderHost = sliderHostRef.current

    if (!sliderHost) {
      return
    }

    const sliderThumb = sliderHost.querySelector('[role="slider"]')

    if (!sliderThumb) {
      return
    }

    sliderThumb.setAttribute("aria-label", ariaLabel)

    if (disabled) {
      sliderThumb.setAttribute("aria-disabled", "true")
    } else {
      sliderThumb.removeAttribute("aria-disabled")
    }
  }, [ariaLabel, disabled])

  return (
    <div
      ref={sliderHostRef}
      aria-disabled={disabled}
      className={cn(disabled && "pointer-events-none")}
    >
      <Slider
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  )
}

function SupportedSliceControls({
  className,
  axisId,
  modelId,
  onSliceChange,
  sliceEnabled,
  value,
}: {
  readonly className?: string
  readonly axisId: SolidSliceAxisId
  readonly modelId: SolidSliceModelId
  readonly onSliceChange: (slice: SolidSliceState) => void
  readonly sliceEnabled: boolean
  readonly value: number
}) {
  const axes = getSolidSliceAxes(modelId)
  const activeAxis = getSolidSliceAxis(modelId, axisId) ?? axes[0]

  if (!activeAxis) {
    return null
  }

  return (
    <div className={cn("grid gap-1.5", className)}>
      {axes.map((axis) => (
        <AxisSliceSlider
          key={axis.id}
          axis={axis}
          disabled={!sliceEnabled}
          isActive={sliceEnabled && axis.id === activeAxis.id}
          value={axis.id === activeAxis.id ? value : axis.defaultValue}
          onSliceChange={onSliceChange}
        />
      ))}
    </div>
  )
}

function formatSliceValue(
  value: number,
  unit: "degree" | "number" | "percent"
) {
  switch (unit) {
    case "degree":
      return `${Math.round(value)}deg`
    case "percent":
      return `${Math.round(value * 100)}%`
    case "number":
      return value.toFixed(2)
    default:
      return assertNeverUnit(unit)
  }
}

function assertNeverUnit(unit: never): never {
  throw new RangeError(`Unknown slice value unit: ${unit}`)
}
