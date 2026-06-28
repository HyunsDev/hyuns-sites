import type { ReactNode } from "react"

import { Button } from "@hyunsdev/ui/components/button"

import { ArduinoRgbAxisBar } from "@/arduino-rgb/ArduinoRgbAxisBar"
import { ArduinoRgbPlaneCanvas } from "@/arduino-rgb/ArduinoRgbPlaneCanvas"
import { ArduinoRgbPlanePreview } from "@/arduino-rgb/ArduinoRgbPlanePreview"
import {
  COLOR_MODELS,
  formatAxisValue,
} from "@/arduino-rgb/arduino-rgb-models"
import type {
  ColorModelAxis,
  ColorModelDefinition,
  ColorModelId,
} from "@/arduino-rgb/arduino-rgb-models"
import { getModelAxisValue } from "@/arduino-rgb/arduino-rgb-axis-values"
import type { ColorModelPlane } from "@/arduino-rgb/arduino-rgb-plane-models"

type ArduinoRgbSurfaceControlsProps = {
  readonly activePlane: ColorModelPlane
  readonly children?: ReactNode
  readonly model: ColorModelDefinition
  readonly modelId: ColorModelId
  readonly onModelSelect: (modelId: ColorModelId) => void
  readonly onPlaneSelect: (planeId: string) => void
  readonly onValuesChange: (values: readonly number[]) => void
  readonly planes: readonly ColorModelPlane[]
  readonly values: readonly number[]
}

export function ArduinoRgbSurfaceControls({
  activePlane,
  children,
  model,
  modelId,
  onModelSelect,
  onPlaneSelect,
  onValuesChange,
  planes,
  values,
}: ArduinoRgbSurfaceControlsProps) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-background-primary/90 p-3 shadow-sm backdrop-blur">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {COLOR_MODELS.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={item.id === modelId ? "accent" : "outline"}
            className="justify-center text-xs"
            onClick={() => onModelSelect(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-2">
        <code className="text-[0.68rem] font-medium text-text-muted">
          Surfaces
        </code>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {planes.map((plane) => (
            <ArduinoRgbPlanePreview
              key={plane.id}
              active={plane.id === activePlane.id}
              model={model}
              plane={plane}
              values={values}
              onSelect={() => onPlaneSelect(plane.id)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="grid min-w-0 gap-2">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <code className="truncate text-xs font-bold">
              {activePlane.label}
            </code>
            <code className="shrink-0 text-[0.68rem] text-text-muted">
              {model.label}
            </code>
          </div>
          <ArduinoRgbPlaneCanvas
            model={model}
            plane={activePlane}
            values={values}
            onValuesChange={onValuesChange}
          />
        </div>

        <div className="grid content-start gap-3">
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
            {model.axes.map((axis, axisIndex) => (
              <AxisValueChip
                key={axis.id}
                axis={axis}
                axisIndex={axisIndex}
                values={values}
              />
            ))}
          </div>
          <FixedAxisControls
            model={model}
            plane={activePlane}
            values={values}
            onValuesChange={onValuesChange}
          />
        </div>
      </div>
      {children}
    </section>
  )
}

function AxisValueChip({
  axis,
  axisIndex,
  values,
}: {
  readonly axis: ColorModelAxis
  readonly axisIndex: number
  readonly values: readonly number[]
}) {
  const value = getModelAxisValue({ axis, axisIndex, values })

  return (
    <div className="grid min-w-0 gap-1 rounded-md border border-border bg-background-secondary/70 p-2">
      <span className="truncate text-[0.65rem] font-medium text-text-muted">
        {axis.label}
      </span>
      <code className="truncate text-xs text-text-normal">
        {formatAxisValue({ axis, value })}
      </code>
    </div>
  )
}

function FixedAxisControls({
  model,
  onValuesChange,
  plane,
  values,
}: {
  readonly model: ColorModelDefinition
  readonly onValuesChange: (values: readonly number[]) => void
  readonly plane: ColorModelPlane
  readonly values: readonly number[]
}) {
  return (
    <div className="grid gap-2">
      {plane.fixedAxisIndices.map((axisIndex) => {
        const axis = requireAxis(model, axisIndex)
        const value = getModelAxisValue({ axis, axisIndex, values })

        return (
          <div key={axis.id} className="grid min-w-0 gap-1.5">
            <div className="flex items-center justify-between gap-2 text-[0.68rem]">
              <span className="min-w-0 truncate font-medium">{axis.label}</span>
              <code className="shrink-0 text-text-muted">
                {formatAxisValue({ axis, value })}
              </code>
            </div>
            <ArduinoRgbAxisBar
              axisIndex={axisIndex}
              model={model}
              values={values}
              onValuesChange={onValuesChange}
            />
          </div>
        )
      })}
    </div>
  )
}

function requireAxis(
  model: ColorModelDefinition,
  axisIndex: number
): ColorModelAxis {
  const axis = model.axes[axisIndex]

  if (!axis) {
    throw new RangeError(`Missing axis ${axisIndex} for ${model.id}`)
  }

  return axis
}
