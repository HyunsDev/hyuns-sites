import { useMemo, useState } from "react"

import { Input } from "@hyunsdev/ui/components/input"
import { cn } from "@hyunsdev/ui/lib/utils"

import { ColorAxisBarCanvas } from "@/color-models/ColorAxisBarCanvas"
import type {
  ColorCoordinate,
  RgbCoordinate,
} from "@/color-models/color-coordinate-utils"

const INITIAL_RGB_COORDINATE = {
  modelId: "rgb",
  r: 255,
  g: 0,
  b: 0,
} satisfies RgbCoordinate

type RgbAxisId = "r" | "g" | "b"

type RgbAxisDefinition = {
  readonly axisId: RgbAxisId
  readonly label: string
}

const RGB_AXES = [
  { axisId: "r", label: "R" },
  { axisId: "g", label: "G" },
  { axisId: "b", label: "B" },
] satisfies readonly RgbAxisDefinition[]

export function RgbMachineFriendlySlide() {
  const [coordinate, setCoordinate] = useState<RgbCoordinate>(
    INITIAL_RGB_COORDINATE
  )
  const hexColor = useMemo(() => formatRgbHex(coordinate), [coordinate])

  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label="RGB: 기계가 좋아하는 색 모델"
    >
      <h1 className="absolute top-[11.8%] left-[6.8%] text-[clamp(1.25rem,2.9cqw,2.5rem)] leading-[1.2] font-bold tracking-normal">
        RGB: 기계가 좋아하는 색 모델
      </h1>
      <RgbColorPreview
        className="absolute top-[34%] left-[18.85%] h-[30.2%] w-[17%]"
        coordinate={coordinate}
        hexColor={hexColor}
      />
      <RgbAxisControlPanel
        className="absolute top-[40%] left-[40.2%] w-[46.8%]"
        coordinate={coordinate}
        onCoordinateChange={setCoordinate}
      />
    </section>
  )
}

type RgbColorPreviewProps = {
  readonly className?: string
  readonly coordinate: RgbCoordinate
  readonly hexColor: string
}

function RgbColorPreview({
  className,
  coordinate,
  hexColor,
}: RgbColorPreviewProps) {
  const textColor = getReadablePreviewTextColor(coordinate)

  return (
    <div
      className={cn(
        "grid content-end justify-start overflow-hidden rounded-sm p-[1.25cqw]",
        className
      )}
      style={{ backgroundColor: hexColor, color: textColor }}
    >
      <div className="grid justify-items-start gap-[0.4cqh] text-left font-bold">
        <span className="text-[clamp(0.75rem,3.15cqw,2.35rem)] leading-none tracking-normal">
          RGB
        </span>
        <span className="font-mono text-[clamp(0.5rem,2.2cqw,2rem)] leading-none tracking-normal">
          {hexColor}
        </span>
      </div>
    </div>
  )
}

type RgbAxisControlPanelProps = {
  readonly className?: string
  readonly coordinate: RgbCoordinate
  readonly onCoordinateChange: (coordinate: RgbCoordinate) => void
}

function RgbAxisControlPanel({
  className,
  coordinate,
  onCoordinateChange,
}: RgbAxisControlPanelProps) {
  const handleAxisBarChange = (nextCoordinate: ColorCoordinate) => {
    if (nextCoordinate.modelId === "rgb") {
      onCoordinateChange(nextCoordinate)
    }
  }

  return (
    <div className={cn("grid gap-[3.1cqh]", className)}>
      {RGB_AXES.map((axis) => (
        <RgbAxisControlRow
          key={axis.axisId}
          axisId={axis.axisId}
          coordinate={coordinate}
          label={axis.label}
          onAxisBarChange={handleAxisBarChange}
          onCoordinateChange={onCoordinateChange}
        />
      ))}
    </div>
  )
}

type RgbAxisControlRowProps = {
  readonly axisId: RgbAxisId
  readonly coordinate: RgbCoordinate
  readonly label: string
  readonly onAxisBarChange: (coordinate: ColorCoordinate) => void
  readonly onCoordinateChange: (coordinate: RgbCoordinate) => void
}

function RgbAxisControlRow({
  axisId,
  coordinate,
  label,
  onAxisBarChange,
  onCoordinateChange,
}: RgbAxisControlRowProps) {
  const value = readRgbAxisValue(coordinate, axisId)

  return (
    <label className="grid grid-cols-[minmax(1.4rem,4.7cqw)_minmax(0,1fr)_minmax(4.8rem,10.2cqw)] items-center gap-[1.04cqw]">
      <span className="text-[clamp(1rem,2.2cqw,2rem)] leading-none font-bold tracking-normal">
        {label}
      </span>
      <ColorAxisBarCanvas
        axisId={axisId}
        coordinate={coordinate}
        modelId="rgb"
        className="h-[clamp(1.6rem,3.7cqh,2.5rem)] rounded-sm border-border bg-background-primary shadow-none"
        onChange={onAxisBarChange}
      />
      <Input
        type="number"
        min={0}
        max={255}
        step={1}
        value={value}
        className="h-[clamp(1.6rem,3.7cqh,2.5rem)] min-w-0 rounded-sm border-field-border bg-field-background px-[0.8cqw] text-center font-mono text-[clamp(0.85rem,1.7cqw,1.5rem)] leading-none font-bold text-field-text"
        aria-label={`${label} channel`}
        onChange={(event) => {
          onCoordinateChange(
            setRgbAxisValue(
              coordinate,
              axisId,
              clampRgbChannel(Number(event.currentTarget.value))
            )
          )
        }}
      />
    </label>
  )
}

function readRgbAxisValue(coordinate: RgbCoordinate, axisId: RgbAxisId) {
  switch (axisId) {
    case "r":
      return coordinate.r
    case "g":
      return coordinate.g
    case "b":
      return coordinate.b
  }
}

function setRgbAxisValue(
  coordinate: RgbCoordinate,
  axisId: RgbAxisId,
  value: number
): RgbCoordinate {
  switch (axisId) {
    case "r":
      return { ...coordinate, r: value }
    case "g":
      return { ...coordinate, g: value }
    case "b":
      return { ...coordinate, b: value }
  }
}

function clampRgbChannel(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(255, Math.max(0, Math.round(value)))
}

function formatRgbHex(coordinate: RgbCoordinate) {
  return `#${[coordinate.r, coordinate.g, coordinate.b]
    .map((channel) => clampRgbChannel(channel).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`
}

function getReadablePreviewTextColor(coordinate: RgbCoordinate) {
  const r = coordinate.r / 255
  const g = coordinate.g / 255
  const b = coordinate.b / 255
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance > 0.58 ? "#111111" : "#ffffff"
}
