import { useState } from "react"

import { Input } from "@hyunsdev/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hyunsdev/ui/components/select"
import { cn } from "@hyunsdev/ui/lib/utils"

import { ColorAxisBarCanvas } from "@/color-models/ColorAxisBarCanvas"
import { ColorNotationInput } from "@/color-models/ColorNotationInput"
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
  type PresentationControlModelId,
} from "@/presentation/presentation-hsl-hsv-models"
import {
  createDefaultColorPickerCoordinate,
  parseColorPickerColorInput,
  requireColorPickerCoordinate,
  type ColorPickerCoordinate,
  type ColorPickerModelId,
} from "@/presentation/presentation-hsv-picker-models"

const COLOR_PICKER_MODEL_OPTIONS = [
  { id: "hsv", label: "HSV", planeLabel: "Saturation x Value" },
  { id: "hsl", label: "HSL", planeLabel: "Saturation x Lightness" },
] as const satisfies readonly {
  readonly id: ColorPickerModelId
  readonly label: string
  readonly planeLabel: string
}[]

type ColorCoordinateControlDemoProps = {
  readonly modelId: PresentationControlModelId
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
  const [modelId, setModelId] = useState<ColorPickerModelId>("hsv")
  const [coordinate, setCoordinate] = useState<ColorPickerCoordinate>(() =>
    createDefaultColorPickerCoordinate("hsv")
  )
  const [colorInputValue, setColorInputValue] = useState(() =>
    formatCoordinateCssOutput(createDefaultColorPickerCoordinate("hsv"))
  )
  const selectedModel = getColorPickerModelOption(modelId)
  const plane = requirePresentationPlane(
    modelId,
    "s",
    modelId === "hsl" ? "l" : "v"
  )

  const changeCoordinate = (nextCoordinate: ColorCoordinate) => {
    const colorPickerCoordinate = requireColorPickerCoordinate(nextCoordinate)

    setCoordinate(colorPickerCoordinate)
    setColorInputValue(formatCoordinateCssOutput(colorPickerCoordinate))
  }

  const changeColorInputValue = (nextValue: string) => {
    setColorInputValue(nextValue)

    const nextCoordinate = parseColorPickerColorInput(
      nextValue,
      modelId,
      coordinate.h
    )

    if (nextCoordinate) {
      setCoordinate(nextCoordinate)
    }
  }

  const changeModelId = (nextModelId: ColorPickerModelId) => {
    const nextCoordinate =
      parseColorPickerColorInput(colorInputValue, nextModelId, coordinate.h) ??
      createDefaultColorPickerCoordinate(nextModelId)

    setModelId(nextModelId)
    setCoordinate(nextCoordinate)
    setColorInputValue(formatCoordinateCssOutput(nextCoordinate))
  }

  return (
    <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(2rem,3.2cqw)] gap-[1cqw]">
      <div className="col-span-2 grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] items-end gap-[1cqw]">
        <label className="grid gap-1.5 text-xs">
          <span className="font-medium">Color model</span>
          <Select
            value={modelId}
            onValueChange={(nextValue) => {
              if (isColorPickerModelId(nextValue)) {
                changeModelId(nextValue)
              }
            }}
          >
            <SelectTrigger
              size="sm"
              className="w-full justify-between bg-background-primary/75"
              aria-label="Color picker model"
            >
              <SelectValue aria-label={selectedModel.label}>
                {selectedModel.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              {COLOR_PICKER_MODEL_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <p className="pb-1 text-xs leading-tight font-medium text-text-muted">
          {selectedModel.planeLabel}
        </p>
      </div>
      <ColorPlaneCanvas
        coordinate={coordinate}
        plane={plane}
        className="w-[24cqw] max-w-full justify-self-end shadow-none"
        onChange={changeCoordinate}
      />
      <HsvHueRail coordinate={coordinate} onChange={changeCoordinate} />
      <div className="col-span-2 grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] items-center gap-[1cqw]">
        <ColorPreviewPanel coordinate={coordinate} compact />
        <ColorNotationInput
          label="CSS color"
          inputAriaLabel={`${selectedModel.label} picker CSS color`}
          value={colorInputValue}
          onChange={changeColorInputValue}
        />
      </div>
    </div>
  )
}

function getColorPickerModelOption(modelId: ColorPickerModelId) {
  return COLOR_PICKER_MODEL_OPTIONS.find((option) => option.id === modelId) ??
    COLOR_PICKER_MODEL_OPTIONS[0]
}

function isColorPickerModelId(value: string): value is ColorPickerModelId {
  return COLOR_PICKER_MODEL_OPTIONS.some((option) => option.id === value)
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
  readonly modelId: PresentationControlModelId
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
