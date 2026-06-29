import { useState } from "react"

import { Input } from "@hyunsdev/ui/components/input"
import { cn } from "@hyunsdev/ui/lib/utils"

import { ColorAxisBarCanvas } from "@/color-models/ColorAxisBarCanvas"
import { ColorPlaneCanvas } from "@/color-models/ColorPlaneCanvas"
import { COLOR_COORDINATE_MODEL_BY_ID } from "@/color-models/color-coordinate-utils"
import {
  createDefaultColorCoordinate,
  readColorCoordinateAxis,
  setColorCoordinateAxis,
  type ColorCoordinate,
  type ColorCoordinateAxis,
  type ColorCoordinateAxisId,
} from "@/color-models/color-coordinate-utils"
import {
  formatCoordinateCssOutput,
  getDisplayColor,
  requirePresentationPlane,
  type HslHsvModelId,
} from "@/presentation/presentation-hsl-hsv-models"

type ColorCoordinateControlDemoProps = {
  readonly modelId: HslHsvModelId
  readonly planeAxisIds: {
    readonly x: ColorCoordinateAxisId
    readonly y: ColorCoordinateAxisId
  }
}

export function ColorCoordinateControlDemo({
  modelId,
  planeAxisIds,
}: ColorCoordinateControlDemoProps) {
  const [coordinate, setCoordinate] = useState<ColorCoordinate>(() =>
    createDefaultColorCoordinate(modelId)
  )
  const model = COLOR_COORDINATE_MODEL_BY_ID[modelId]
  const plane = requirePresentationPlane(modelId, planeAxisIds.x, planeAxisIds.y)

  return (
    <div className="grid min-h-0 grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-[3.2cqw]">
      <div className="grid min-h-0 gap-[2.4cqh]">
        <ColorPreviewPanel coordinate={coordinate} />
        <ColorPlaneCanvas
          coordinate={coordinate}
          plane={plane}
          className="w-full shadow-none"
          onChange={setCoordinate}
        />
      </div>
      <div className="grid gap-[2.55cqh]">
        {model.axes.map((axis) => (
          <CoordinateAxisControlRow
            key={axis.id}
            axis={axis}
            coordinate={coordinate}
            modelId={modelId}
            onChange={setCoordinate}
          />
        ))}
      </div>
    </div>
  )
}

export function HsvColorPickerDemo() {
  const [coordinate, setCoordinate] = useState<ColorCoordinate>(() =>
    createDefaultColorCoordinate("hsv")
  )
  const plane = requirePresentationPlane("hsv", "s", "v")

  return (
    <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(2rem,3.2cqw)] gap-[1cqw]">
      <ColorPlaneCanvas
        coordinate={coordinate}
        plane={plane}
        className="w-[24cqw] max-w-full justify-self-end shadow-none"
        onChange={setCoordinate}
      />
      <HsvHueRail coordinate={coordinate} onChange={setCoordinate} />
      <div className="col-span-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[1cqw]">
        <ColorPreviewPanel coordinate={coordinate} compact />
        <div className="grid content-center gap-[0.6cqh] rounded-md border border-border bg-background-primary/84 p-[1cqw]">
          <span className="font-mono text-[clamp(0.62rem,1cqw,0.9rem)] leading-none font-bold text-text-muted">
            CSS output
          </span>
          <code className="text-[clamp(0.78rem,1.45cqw,1.2rem)] leading-tight font-bold break-all">
            {formatCoordinateCssOutput(coordinate)}
          </code>
        </div>
      </div>
    </div>
  )
}

type ColorPreviewPanelProps = {
  readonly compact?: boolean
  readonly coordinate: ColorCoordinate
}

function ColorPreviewPanel({ compact = false, coordinate }: ColorPreviewPanelProps) {
  const color = getDisplayColor(coordinate)

  return (
    <div
      className={cn(
        "grid content-end rounded-md border border-border p-[1.25cqw]",
        compact ? "min-h-[9cqh]" : "min-h-[18cqh]"
      )}
      style={{ backgroundColor: color }}
    >
      <code className="text-[clamp(0.78rem,1.55cqw,1.3rem)] leading-none font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.75)]">
        {color}
      </code>
    </div>
  )
}

type CoordinateAxisControlRowProps = {
  readonly axis: ColorCoordinateAxis
  readonly coordinate: ColorCoordinate
  readonly modelId: HslHsvModelId
  readonly onChange: (coordinate: ColorCoordinate) => void
}

function CoordinateAxisControlRow({
  axis,
  coordinate,
  modelId,
  onChange,
}: CoordinateAxisControlRowProps) {
  const value = readColorCoordinateAxis(coordinate, axis.id)

  return (
    <label className="grid grid-cols-[minmax(1.4rem,4.2cqw)_minmax(0,1fr)_minmax(4.6rem,8cqw)] items-center gap-[1cqw]">
      <span className="text-[clamp(0.92rem,1.9cqw,1.6rem)] leading-none font-bold tracking-normal">
        {axis.shortLabel}
      </span>
      <ColorAxisBarCanvas
        axisId={axis.id}
        coordinate={coordinate}
        modelId={modelId}
        className="h-8 shadow-none"
        onChange={onChange}
      />
      <Input
        type="number"
        min={axis.min}
        max={axis.max}
        step={axis.step}
        value={value}
        aria-label={`${axis.label} axis`}
        onChange={(event) =>
          onChange(setColorCoordinateAxis(coordinate, axis.id, Number(event.currentTarget.value)))
        }
      />
    </label>
  )
}

type HsvHueRailProps = {
  readonly coordinate: ColorCoordinate
  readonly onChange: (coordinate: ColorCoordinate) => void
}

function HsvHueRail({ coordinate, onChange }: HsvHueRailProps) {
  const hue = readColorCoordinateAxis(coordinate, "h")
  const hueRatio = hue / 360

  const updateFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))

    onChange(setColorCoordinateAxis(coordinate, "h", ratio * 360))
  }

  return (
    <div
      className="relative overflow-hidden rounded-md border border-border shadow-sm"
      aria-label="Hue color axis bar"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        updateFromPointer(event)
      }}
      onPointerMove={(event) => {
        if (event.buttons === 1) {
          updateFromPointer(event)
        }
      }}
      style={{
        background:
          "linear-gradient(to bottom, hsl(0 100% 50%), hsl(60 100% 50%), hsl(120 100% 50%), hsl(180 100% 50%), hsl(240 100% 50%), hsl(300 100% 50%), hsl(360 100% 50%))",
      }}
    >
      <span
        className="pointer-events-none absolute left-0 h-0.5 w-full -translate-y-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.85)]"
        style={{ top: `${hueRatio * 100}%` }}
      />
    </div>
  )
}
