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
  if (!sliceEnabled || !isSolidSliceModel(modelId)) {
    return null
  }

  return (
    <SupportedSliceControls
      className={className}
      modelId={modelId}
      axisId={slice.axisId}
      value={slice.value}
      onSliceChange={onSliceChange}
    />
  )
}

function AxisSliceSlider({
  axis,
  isActive,
  onSliceChange,
  value,
}: {
  readonly axis: ReturnType<typeof getSolidSliceAxes>[number]
  readonly isActive: boolean
  readonly onSliceChange: (slice: SolidSliceState) => void
  readonly value: number
}) {
  const sliderLabel = `${axis.label} slice value`

  return (
    <div
      className={cn(
        "grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2 text-xs",
        !isActive && "opacity-70"
      )}
    >
      <span
        className={cn(
          "min-w-0 truncate font-medium",
          isActive ? "text-text-normal" : "text-text-muted"
        )}
      >
        {axis.label}
      </span>
      <div className="grid min-w-0 grid-cols-[minmax(5rem,1fr)_3.75rem] items-center gap-2">
        <LabeledSlider
          min={axis.min}
          max={axis.max}
          step={axis.step}
          value={[value]}
          ariaLabel={sliderLabel}
          onValueChange={(values) => {
            const nextValue = values[0]

            if (nextValue !== undefined) {
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
  max,
  min,
  onValueChange,
  step,
  value,
}: {
  readonly ariaLabel: string
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
  }, [ariaLabel])

  return (
    <div ref={sliderHostRef}>
      <Slider
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
  value,
}: {
  readonly className?: string
  readonly axisId: SolidSliceAxisId
  readonly modelId: SolidSliceModelId
  readonly onSliceChange: (slice: SolidSliceState) => void
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
          isActive={axis.id === activeAxis.id}
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
