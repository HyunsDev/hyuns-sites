import { useMemo, useState } from "react"

import { Badge } from "@hyunsdev/ui/components/badge"
import { cn } from "@hyunsdev/ui/lib/utils"

import { ColorNotationInput } from "@/color-models/ColorNotationInput"
import {
  createGradientComparisonRows,
  createHslOklchPaletteComparisonGroups,
  createOklchLightnessScale,
  createOklchPaletteScale,
  OKLCH_USE_CASES,
  type GradientComparisonRow,
  type PaletteComparisonGroup,
  type PaletteComparisonRow,
  type PaletteSwatch,
} from "@/presentation/presentation-oklch-practice-models"

const LIGHTNESS_ROLE_MARKERS = [
  {
    color: "oklch(96% 0.015 260)",
    label: "background",
    lightness: "L 96",
  },
  {
    color: "oklch(92% 0.018 260)",
    label: "surface",
    lightness: "L 92",
  },
  {
    color: "oklch(82% 0.022 260)",
    label: "border",
    lightness: "L 82",
  },
  {
    color: "oklch(18% 0.018 260)",
    label: "text",
    lightness: "L 18",
  },
] as const

export function HslOklchPaletteComparison() {
  const groups = createHslOklchPaletteComparisonGroups()
  const scaleSwatches = groups[0]?.rows[0]?.swatches ?? []

  return (
    <div className="grid gap-[0.85cqw]">
      {groups.map((group) => (
        <PaletteComparisonGroupBlock key={group.id} group={group} />
      ))}
      <PaletteScaleLabels swatches={scaleSwatches} />
    </div>
  )
}

export function OklchUseCaseChips() {
  return (
    <div className="flex flex-wrap gap-[0.8cqw]">
      {OKLCH_USE_CASES.map((useCase) => (
        <Badge key={useCase} variant="outline" className="font-mono">
          {useCase}
        </Badge>
      ))}
    </div>
  )
}

export function OklchLightnessSystemDemo() {
  return (
    <div className="grid gap-[1.6cqw]">
      <OklchLightnessRamp />
      <div className="grid grid-cols-4 gap-[0.75cqw]">
        {LIGHTNESS_ROLE_MARKERS.map((marker) => (
          <div
            key={marker.label}
            className="grid overflow-hidden rounded-md border border-border bg-background-primary/84"
          >
            <div
              className="h-[3.6cqw] min-h-6"
              style={{ backgroundColor: marker.color }}
            />
            <div className="grid gap-[0.25cqw] p-[0.55cqw]">
              <span className="truncate text-[clamp(0.52rem,0.82cqw,0.7rem)] font-bold">
                {marker.label}
              </span>
              <code className="text-[clamp(0.48rem,0.72cqw,0.6rem)] leading-none text-text-muted">
                {marker.lightness}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function OklchLightnessRamp() {
  return (
    <div className="grid gap-[1.4cqw]">
      <PaletteSwatchGrid swatches={createOklchLightnessScale()} />
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-[1cqw]">
        <code className="font-mono text-[clamp(0.7rem,1.1cqw,0.92rem)] font-bold text-text-muted">
          L
        </code>
        <div className="h-px bg-border" />
      </div>
    </div>
  )
}

export function OklchBrandPaletteGenerator() {
  const [colorInput, setColorInput] = useState("oklch(70% 0.18 32)")
  const result = useMemo(
    () => createOklchPaletteScale(colorInput),
    [colorInput]
  )

  return (
    <div className="grid gap-[1.6cqw]">
      <ColorNotationInput
        label="base color"
        value={colorInput}
        onChange={setColorInput}
      />
      <PaletteSwatchGrid swatches={result.swatches} />
      <code
        className={cn(
          "truncate text-[clamp(0.58rem,0.95cqw,0.78rem)] leading-none text-text-muted",
          result.status === "invalid" && "text-field-text-error"
        )}
      >
        {result.status === "parsed" ? result.baseColor : "invalid color"}
      </code>
    </div>
  )
}

export function GradientInterpolationComparison() {
  return (
    <div className="grid gap-[1.25cqw]">
      {createGradientComparisonRows().map((row) => (
        <GradientRow key={row.id} row={row} />
      ))}
    </div>
  )
}

type PaletteComparisonStripProps = {
  readonly row: PaletteComparisonRow
}

type PaletteComparisonGroupBlockProps = {
  readonly group: PaletteComparisonGroup
}

function PaletteComparisonGroupBlock({ group }: PaletteComparisonGroupBlockProps) {
  return (
    <div className="grid gap-[0.45cqw] rounded-md border border-border bg-background-primary/72 p-[0.65cqw]">
      <code className="font-mono text-[clamp(0.7rem,1.05cqw,0.88rem)] font-bold text-text-muted">
        {group.label}
      </code>
      <div className="grid gap-[0.45cqw]">
        {group.rows.map((row) => (
          <PaletteComparisonStrip key={`${group.id}-${row.id}`} row={row} />
        ))}
      </div>
    </div>
  )
}

function PaletteComparisonStrip({ row }: PaletteComparisonStripProps) {
  return (
    <div className="grid grid-cols-[3.2rem_minmax(0,1fr)] items-center gap-[0.65cqw]">
      <code className="font-mono text-[clamp(0.52rem,0.76cqw,0.66rem)] font-bold text-text-muted">
        {row.label}
      </code>
      <PaletteSwatchGrid swatches={row.swatches} compact showLabels={false} />
    </div>
  )
}

type PaletteSwatchGridProps = {
  readonly compact?: boolean
  readonly showLabels?: boolean
  readonly swatches: readonly PaletteSwatch[]
}

function PaletteSwatchGrid({
  compact = false,
  showLabels = true,
  swatches,
}: PaletteSwatchGridProps) {
  return (
    <div className="grid grid-cols-10 overflow-hidden rounded-md border border-border">
      {swatches.map((swatch) => (
        <div
          key={swatch.label}
          className={cn(
            "grid min-w-0 content-end",
            compact ? "h-[2.25cqw] min-h-5" : "h-[10cqw] min-h-16"
          )}
          style={{
            backgroundColor: swatch.color,
            backgroundImage: swatch.inSrgb
              ? "none"
              : "repeating-linear-gradient(135deg, rgba(255,255,255,.34) 0 5px, rgba(0,0,0,.2) 5px 10px)",
          }}
          title={swatch.css}
        >
          {showLabels && (
            <code className="bg-background-primary/76 px-[0.35cqw] py-[0.22cqw] text-center text-[clamp(0.42rem,0.64cqw,0.58rem)] leading-none text-text-normal">
              {swatch.label}
            </code>
          )}
        </div>
      ))}
    </div>
  )
}

type PaletteScaleLabelsProps = {
  readonly swatches: readonly PaletteSwatch[]
}

function PaletteScaleLabels({ swatches }: PaletteScaleLabelsProps) {
  return (
    <div className="grid grid-cols-[3.2rem_minmax(0,1fr)] gap-[0.65cqw] px-[0.65cqw]">
      <span aria-hidden="true" />
      <div className="grid grid-cols-10">
        {swatches.map((swatch) => (
          <code
            key={swatch.label}
            className="min-w-0 text-center font-mono text-[clamp(0.42rem,0.64cqw,0.58rem)] leading-none text-text-muted"
          >
            {swatch.label}
          </code>
        ))}
      </div>
    </div>
  )
}

type GradientRowProps = {
  readonly row: GradientComparisonRow
}

function GradientRow({ row }: GradientRowProps) {
  const gradient = `linear-gradient(90deg, ${row.swatches
    .map((swatch) => swatch.color)
    .join(", ")})`

  return (
    <div className="grid gap-[0.55cqw]">
      <div className="flex items-center justify-between gap-[1cqw]">
        <code className="font-mono text-[clamp(0.68rem,1cqw,0.86rem)] font-bold text-text-muted">
          {row.label}
        </code>
        {!row.swatches.every((swatch) => swatch.inSrgb) && (
          <span className="text-[clamp(0.52rem,0.78cqw,0.68rem)] text-text-muted">
            clipped
          </span>
        )}
      </div>
      <div
        className="h-[5.2cqw] min-h-8 rounded-sm border border-border"
        style={{ background: gradient }}
      />
    </div>
  )
}
