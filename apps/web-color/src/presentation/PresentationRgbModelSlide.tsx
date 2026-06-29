import { useMemo, useState } from "react"

import { Input } from "@hyunsdev/ui/components/input"
import { cn } from "@hyunsdev/ui/lib/utils"

import { ColorAxisBarCanvas } from "@/color-models/ColorAxisBarCanvas"
import type {
  ColorCoordinate,
  RgbCoordinate,
} from "@/color-models/color-coordinate-utils"
import {
  PresentationSlideShell,
  SlideKeyword,
  SlideKeywords,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import {
  formatRgbHex,
  getReadablePreviewTextColor,
  getRgbDerivedMetrics,
  INITIAL_RGB_COORDINATE,
  readRgbAxisValue,
  RGB_AXES,
  RGB_LIMITS_BASE_COORDINATE,
  RGB_LIMITS_INITIAL_COORDINATE,
  setRgbAxisValue,
  type RgbAxisId,
  type RgbDerivedMetrics,
} from "@/presentation/presentation-rgb-models"

export function RgbModelSlide() {
  const [coordinate, setCoordinate] = useState<RgbCoordinate>(
    INITIAL_RGB_COORDINATE
  )
  const hexColor = useMemo(() => formatRgbHex(coordinate), [coordinate])

  return (
    <PresentationSlideShell
      ariaLabel="RGB: 기계가 좋아하는 색 모델"
      title="RGB: 기계가 좋아하는 색 모델"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideVisualStage className="grid place-items-center">
          <RgbColorPreview
            className="aspect-square w-[min(24cqw,37cqh)]"
            coordinate={coordinate}
            hexColor={hexColor}
          />
        </SlideVisualStage>
        <div className="grid gap-[4cqh]">
          <div className="grid gap-[1cqh]">
            <p className="font-mono text-[clamp(0.92rem,1.65cqw,1.35rem)] leading-none font-bold text-text-muted">
              #RRGGBB
            </p>
            <p className="text-[clamp(0.9rem,1.7cqw,1.4rem)] leading-[1.25] font-semibold text-text-muted">
              R / G / B
            </p>
          </div>
          <RgbAxisControlPanel
            coordinate={coordinate}
            onCoordinateChange={setCoordinate}
          />
        </div>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function RgbStrengthsSlide() {
  return (
    <PresentationSlideShell ariaLabel="RGB의 장점" title="RGB의 장점">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>표시 장치에 가깝다</SlideKeyword>
          <SlideKeyword>저장과 출력이 편리하다</SlideKeyword>
        </SlideKeywords>
        <RgbChannelStack />
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function RgbLimitsSlide() {
  return (
    <PresentationSlideShell ariaLabel="RGB의 한계" title="RGB의 한계">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>색조를 바꾸기 어렵다</SlideKeyword>
          <SlideKeyword>채도를 바꾸기 어렵다</SlideKeyword>
          <SlideKeyword>밝기를 감으로 맞추게 된다</SlideKeyword>
        </SlideKeywords>
        <RgbAdjustmentProblemDemo />
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

type RgbColorPreviewProps = {
  readonly className?: string
  readonly coordinate: RgbCoordinate
  readonly hexColor: string
  readonly label?: string
}

export function RgbColorPreview({
  className,
  coordinate,
  hexColor,
  label = "RGB",
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
          {label}
        </span>
        <span className="font-mono text-[clamp(0.5rem,2.2cqw,2rem)] leading-none tracking-normal">
          {hexColor}
        </span>
      </div>
    </div>
  )
}

type RgbAxisControlPanelProps = {
  readonly axisIds?: readonly RgbAxisId[]
  readonly className?: string
  readonly coordinate: RgbCoordinate
  readonly density?: "compact" | "default"
  readonly onCoordinateChange: (coordinate: RgbCoordinate) => void
}

export function RgbAxisControlPanel({
  axisIds,
  className,
  coordinate,
  density = "default",
  onCoordinateChange,
}: RgbAxisControlPanelProps) {
  const visibleAxes = axisIds
    ? RGB_AXES.filter((axis) => axisIds.includes(axis.axisId))
    : RGB_AXES

  const handleAxisBarChange = (nextCoordinate: ColorCoordinate) => {
    if (nextCoordinate.modelId === "rgb") {
      onCoordinateChange(nextCoordinate)
    }
  }

  return (
    <div className={cn("grid gap-[3.1cqh]", className)}>
      {visibleAxes.map((axis) => (
        <RgbAxisControlRow
          key={axis.axisId}
          axisId={axis.axisId}
          coordinate={coordinate}
          density={density}
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
  readonly density: "compact" | "default"
  readonly label: string
  readonly onAxisBarChange: (coordinate: ColorCoordinate) => void
  readonly onCoordinateChange: (coordinate: RgbCoordinate) => void
}

function RgbAxisControlRow({
  axisId,
  coordinate,
  density,
  label,
  onAxisBarChange,
  onCoordinateChange,
}: RgbAxisControlRowProps) {
  const value = readRgbAxisValue(coordinate, axisId)

  return (
    <label
      className={cn(
        "grid items-center",
        density === "compact"
          ? "grid-cols-[1.4rem_minmax(6rem,1fr)_4.3rem] gap-2"
          : "grid-cols-[minmax(1.4rem,4.7cqw)_minmax(0,1fr)_minmax(4.8rem,10.2cqw)] gap-[1.04cqw]"
      )}
    >
      <span
        className={cn(
          "leading-none font-bold tracking-normal",
          density === "compact"
            ? "text-[clamp(0.9rem,1.55cqw,1.35rem)]"
            : "text-[clamp(1rem,2.2cqw,2rem)]"
        )}
      >
        {label}
      </span>
      <ColorAxisBarCanvas
        axisId={axisId}
        coordinate={coordinate}
        modelId="rgb"
        className="h-8 shadow-none"
        onChange={onAxisBarChange}
      />
      <Input
        type="number"
        min={0}
        max={255}
        step={1}
        value={value}
        aria-label={`${label} channel`}
        onChange={(event) => {
          onCoordinateChange(
            setRgbAxisValue(
              coordinate,
              axisId,
              Number(event.currentTarget.value)
            )
          )
        }}
      />
    </label>
  )
}

type RgbChannelStackProps = {
  readonly className?: string
}

function RgbChannelStack({ className }: RgbChannelStackProps) {
  return (
    <div
      className={cn(
        "grid min-h-0 grid-cols-[minmax(0,0.95fr)_2.8rem_minmax(0,1fr)] items-center gap-[1.7cqw]",
        className
      )}
    >
      <div className="grid min-h-0 gap-[1.7cqh]">
        <RgbChannelLayer label="R" value="255" className="bg-[#ff2d55]" />
        <RgbChannelLayer label="G" value="96" className="bg-[#34c759]" />
        <RgbChannelLayer label="B" value="64" className="bg-[#0a84ff]" />
      </div>
      <div className="relative grid items-center justify-items-center">
        <div className="h-px w-full bg-border" />
        <div className="absolute size-2.5 rotate-45 border-t border-r border-border bg-background-secondary" />
      </div>
      <div className="grid min-h-0 gap-[1.7cqh]">
        <div className="relative isolate h-[30cqh] overflow-hidden rounded-sm border border-border bg-[#101010]">
          <div className="absolute top-[10%] left-[13%] h-[52%] w-[58%] rounded-[0.2rem] bg-[#ff2d55] opacity-80 mix-blend-screen" />
          <div className="absolute top-[23%] left-[25%] h-[52%] w-[58%] rounded-[0.2rem] bg-[#34c759] opacity-80 mix-blend-screen" />
          <div className="absolute top-[36%] left-[37%] h-[52%] w-[58%] rounded-[0.2rem] bg-[#0a84ff] opacity-80 mix-blend-screen" />
        </div>
        <div className="grid h-[9cqh] content-center rounded-sm bg-[#ff6040] px-[1.15cqw] text-left text-[#111111]">
          <span className="font-mono text-[clamp(0.7rem,1.6cqw,1.3rem)] leading-none font-bold tracking-normal">
            rgb(255 96 64)
          </span>
        </div>
      </div>
    </div>
  )
}

type RgbChannelLayerProps = {
  readonly className?: string
  readonly label: string
  readonly value: string
}

function RgbChannelLayer({ className, label, value }: RgbChannelLayerProps) {
  return (
    <div
      className={cn(
        "grid h-[10.2cqh] grid-cols-[auto_1fr] items-center gap-[1cqw] rounded-sm p-[1cqw] text-white",
        className
      )}
    >
      <span className="grid size-[3.4cqw] min-h-10 min-w-10 place-items-center rounded-[0.2rem] bg-black/22 text-[clamp(0.85rem,1.8cqw,1.45rem)] leading-none font-bold">
        {label}
      </span>
      <span className="font-mono text-[clamp(0.72rem,1.45cqw,1.16rem)] leading-none font-bold">
        {value}
      </span>
    </div>
  )
}

type RgbAdjustmentProblemDemoProps = {
  readonly className?: string
}

function RgbAdjustmentProblemDemo({ className }: RgbAdjustmentProblemDemoProps) {
  const [coordinate, setCoordinate] = useState<RgbCoordinate>(
    RGB_LIMITS_INITIAL_COORDINATE
  )
  const hexColor = useMemo(() => formatRgbHex(coordinate), [coordinate])
  const baseHexColor = formatRgbHex(RGB_LIMITS_BASE_COORDINATE)
  const baseMetrics = getRgbDerivedMetrics(RGB_LIMITS_BASE_COORDINATE)
  const currentMetrics = getRgbDerivedMetrics(coordinate)

  return (
    <div className={cn("grid min-h-0 gap-[2.2cqh]", className)}>
      <div className="grid grid-cols-[minmax(0,0.82fr)_auto_minmax(0,0.82fr)] items-stretch gap-[1.2cqw]">
        <RgbMiniSwatch label="before" color={baseHexColor} />
        <div className="grid items-center text-text-muted">
          <div className="h-px w-[2.4cqw] bg-border" />
        </div>
        <RgbMiniSwatch label="after" color={hexColor} />
      </div>
      <div className="grid gap-[1.5cqh] border-y border-border/70 py-[2cqh]">
        <RgbAxisControlPanel
          coordinate={coordinate}
          density="compact"
          onCoordinateChange={setCoordinate}
        />
      </div>
      <div className="grid content-center gap-[1.35cqh]">
        <RgbMetricShiftRow
          label="Hue"
          max={360}
          suffix="deg"
          before={baseMetrics.hue}
          after={currentMetrics.hue}
        />
        <RgbMetricShiftRow
          label="Saturation"
          max={100}
          suffix="%"
          before={baseMetrics.saturation}
          after={currentMetrics.saturation}
        />
        <RgbMetricShiftRow
          label="Brightness"
          max={100}
          suffix="%"
          before={baseMetrics.brightness}
          after={currentMetrics.brightness}
        />
      </div>
    </div>
  )
}

type RgbMiniSwatchProps = {
  readonly color: string
  readonly label: string
}

function RgbMiniSwatch({ color, label }: RgbMiniSwatchProps) {
  return (
    <div
      className="grid h-[13cqh] content-end rounded-sm p-[1cqw]"
      style={{ backgroundColor: color }}
    >
      <span className="font-mono text-[clamp(0.58rem,1.1cqw,0.9rem)] leading-none font-bold tracking-normal text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]">
        {label}
      </span>
      <span className="font-mono text-[clamp(0.58rem,1.1cqw,0.9rem)] leading-none font-bold tracking-normal text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]">
        {color}
      </span>
    </div>
  )
}

type RgbMetricShiftRowProps = {
  readonly after: number
  readonly before: number
  readonly label: keyof RgbDerivedMetrics | "Brightness" | "Hue" | "Saturation"
  readonly max: number
  readonly suffix: string
}

function RgbMetricShiftRow({
  after,
  before,
  label,
  max,
  suffix,
}: RgbMetricShiftRowProps) {
  const beforeRatio = Math.max(0, Math.min(1, before / max))
  const afterRatio = Math.max(0, Math.min(1, after / max))

  return (
    <div className="grid gap-[0.7cqh]">
      <div className="flex items-center justify-between gap-[1cqw]">
        <span className="text-[clamp(0.68rem,1.42cqw,1.1rem)] leading-none font-bold tracking-normal">
          {label}
        </span>
        <span className="font-mono text-[clamp(0.58rem,1.15cqw,0.95rem)] leading-none font-bold text-text-muted">
          {before}
          {suffix}
          {" -> "}
          {after}
          {suffix}
        </span>
      </div>
      <div className="relative h-[1.1cqh] min-h-1.5 overflow-hidden rounded-full bg-background-primary">
        <span
          className="absolute inset-y-0 left-0 bg-border"
          style={{ width: `${beforeRatio * 100}%` }}
        />
        <span
          className="absolute inset-y-0 left-0 bg-text-normal"
          style={{ width: `${afterRatio * 100}%` }}
        />
      </div>
    </div>
  )
}
