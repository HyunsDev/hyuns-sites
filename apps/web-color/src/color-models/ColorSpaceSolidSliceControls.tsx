import { ColorAxisBarCanvas } from "@/color-models/ColorAxisBarCanvas"
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
import {
  createSolidSliceCoordinate,
  getSolidSliceCoordinateModelId,
  toSolidSliceValue,
} from "@/color-models/color-space-solid-slice-coordinate"
import type { ColorSpaceModelId } from "@/color-models/color-space-models"
import { readColorCoordinateAxis } from "@/color-models/color-coordinate-utils"
import type {
  ColorCoordinate,
  ColorCoordinateModelId,
} from "@/color-models/color-coordinate-utils"
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
      sliceEnabled={sliceEnabled}
      onSliceChange={onSliceChange}
    />
  )
}

function AxisSliceBar({
  axis,
  coordinate,
  coordinateModelId,
  disabled,
  isActive,
  onSliceChange,
  value,
}: {
  readonly axis: ReturnType<typeof getSolidSliceAxes>[number]
  readonly coordinate: ColorCoordinate
  readonly coordinateModelId: ColorCoordinateModelId
  readonly disabled: boolean
  readonly isActive: boolean
  readonly onSliceChange: (slice: SolidSliceState) => void
  readonly value: number
}) {
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
        <div
          aria-disabled={disabled}
          className={cn(disabled && "pointer-events-none")}
        >
          <ColorAxisBarCanvas
            axisId={axis.id}
            coordinate={coordinate}
            modelId={coordinateModelId}
            className="h-7 shadow-none"
            onChange={(nextCoordinate) => {
              if (disabled) {
                return
              }

              onSliceChange({
                axisId: axis.id,
                value: toSolidSliceValue(
                  axis,
                  readColorCoordinateAxis(nextCoordinate, axis.id)
                ),
              })
            }}
          />
        </div>
        <code className="justify-self-end text-[0.68rem] leading-none text-text-muted">
          {formatSliceValue(value, axis.unit)}
        </code>
      </div>
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

  const coordinateModelId = getSolidSliceCoordinateModelId(modelId)
  const coordinate = createSolidSliceCoordinate({
    axisId: activeAxis.id,
    modelId,
    value,
  })

  return (
    <div className={cn("grid gap-1.5", className)}>
      {axes.map((axis) => (
        <AxisSliceBar
          key={axis.id}
          axis={axis}
          coordinate={coordinate}
          coordinateModelId={coordinateModelId}
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
