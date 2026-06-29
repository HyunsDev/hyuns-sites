import { useMemo, useState } from "react"

import { Badge } from "@hyunsdev/ui/components/badge"
import { cn } from "@hyunsdev/ui/lib/utils"

import { ColorNotationInput } from "@/color-models/ColorNotationInput"
import {
  createGradientComparisonRows,
  createHslOklchPaletteComparisonRows,
  createOklchLightnessScale,
  createOklchPaletteScale,
  OKLCH_USE_CASES,
  type GradientComparisonRow,
  type PaletteComparisonRow,
  type PaletteSwatch,
} from "@/presentation/presentation-oklch-practice-models"

export function HslOklchPaletteComparison() {
  return (
    <div className="grid gap-[1.4cqw]">
      {createHslOklchPaletteComparisonRows().map((row) => (
        <PaletteComparisonStrip key={row.id} row={row} />
      ))}
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

function PaletteComparisonStrip({ row }: PaletteComparisonStripProps) {
  return (
    <div className="grid gap-[0.6cqw]">
      <code className="font-mono text-[clamp(0.7rem,1.05cqw,0.88rem)] font-bold text-text-muted">
        {row.label}
      </code>
      <PaletteSwatchGrid swatches={row.swatches} compact />
    </div>
  )
}

type PaletteSwatchGridProps = {
  readonly compact?: boolean
  readonly swatches: readonly PaletteSwatch[]
}

function PaletteSwatchGrid({ compact = false, swatches }: PaletteSwatchGridProps) {
  return (
    <div className="grid grid-cols-10 overflow-hidden rounded-md border border-border">
      {swatches.map((swatch) => (
        <div
          key={swatch.label}
          className={cn(
            "grid min-w-0 content-end",
            compact ? "h-[5.4cqw] min-h-8" : "h-[10cqw] min-h-16"
          )}
          style={{
            backgroundColor: swatch.color,
            backgroundImage: swatch.inSrgb
              ? "none"
              : "repeating-linear-gradient(135deg, rgba(255,255,255,.34) 0 5px, rgba(0,0,0,.2) 5px 10px)",
          }}
          title={swatch.css}
        >
          <code className="bg-background-primary/76 px-[0.35cqw] py-[0.25cqw] text-center text-[clamp(0.48rem,0.82cqw,0.68rem)] leading-none text-text-normal">
            {swatch.label}
          </code>
        </div>
      ))}
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
