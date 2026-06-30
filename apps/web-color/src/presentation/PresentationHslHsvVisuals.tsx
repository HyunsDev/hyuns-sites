import { cn } from "@hyunsdev/ui/lib/utils"

import { PresentationSolidModelVisual } from "@/presentation/PresentationSolidModelVisual"
import {
  createHslHsvComparisonRows,
  createHslLightnessTrapSwatches,
  createHsvAxisPaletteRows,
  HSL_HSV_SECTION_MODELS,
  type HslLightnessTrapSwatch,
  type PresentationColorSwatch,
} from "@/presentation/presentation-hsl-hsv-models"

export function HslHsvIntroModels() {
  return (
    <div className="absolute inset-x-[10%] top-[6%] h-[58%]">
      <PresentationSolidModelVisual
        modelId="hsl"
        variant="section"
        className="top-[4%] left-[31%] h-[82%] w-[42%] min-w-0"
      />
      <PresentationSolidModelVisual
        modelId="hsv"
        variant="section"
        className="top-[4%] left-[69%] h-[82%] w-[42%] min-w-0"
      />
      <div className="absolute inset-x-[7%] bottom-0 grid grid-cols-2 gap-[5cqw]">
        {HSL_HSV_SECTION_MODELS.map((model) => (
          <div key={model.modelId} className="grid justify-items-center gap-[0.7cqh] text-center">
            <span className="text-[clamp(1rem,2.4cqw,2rem)] leading-none font-bold">
              {model.title}
            </span>
            <span className="font-mono text-[clamp(0.55rem,1cqw,0.9rem)] leading-none font-bold text-text-muted">
              {model.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HslHsvComparisonRows() {
  return (
    <div className="grid gap-[2.4cqh]">
      {createHslHsvComparisonRows().map((row) => (
        <SwatchRow key={row.label} label={row.label} swatches={row.swatches} />
      ))}
    </div>
  )
}

export function HsvAxisPaletteRows() {
  return (
    <div className="grid gap-[1.25cqw]">
      {createHsvAxisPaletteRows().map((row) => (
        <SwatchRow key={row.axisId} label={row.label} swatches={row.swatches} dense />
      ))}
    </div>
  )
}

export function LightnessComparisonGrid() {
  const swatches = createHslLightnessTrapSwatches()

  return (
    <div className="grid gap-[1.25cqh] sm:gap-[2cqh]">
      <div className="hidden grid-cols-4 gap-[1cqw] sm:grid">
        {swatches.map((swatch) => (
          <LightnessTrapSwatchCard key={swatch.label} swatch={swatch} />
        ))}
      </div>
      <div className="grid gap-[0.65cqh] rounded-md border border-border bg-background-primary/84 p-[1cqw] sm:gap-[1.25cqh] sm:p-[1.45cqw]">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[0.85cqw]">
          <span className="text-[clamp(0.56rem,1.05cqw,0.92rem)] leading-none font-bold">
            화면 밝기
          </span>
          <span className="h-px bg-border" />
          <code className="text-[clamp(0.42rem,0.78cqw,0.72rem)] leading-none text-text-muted">
            relative luminance
          </code>
        </div>
        <div className="grid gap-[0.42cqh] sm:gap-[0.85cqh]">
          {swatches.map((swatch) => (
            <LuminanceBar key={swatch.label} swatch={swatch} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ModelFamilyBridge() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[1.5cqw]">
      <BridgeNode title="RGB" caption="device channels" />
      <BridgeArrow />
      <BridgeNode title="HSL / HSV" caption="geometric transform" active />
      <BridgeArrow />
      <BridgeNode title="Lab / OKLCH" caption="perceptual intent" />
    </div>
  )
}

type SwatchRowProps = {
  readonly dense?: boolean
  readonly label: string
  readonly swatches: readonly PresentationColorSwatch[]
}

function SwatchRow({ dense = false, label, swatches }: SwatchRowProps) {
  return (
    <div className={cn("grid", dense ? "gap-[0.45cqw]" : "gap-[0.85cqh]")}>
      <span className="text-[clamp(0.72rem,1.15cqw,1rem)] leading-none font-bold">
        {label}
      </span>
      <div className={cn("grid grid-cols-10 gap-[0.5cqw]", dense && "gap-0")}>
        {swatches.map((swatch, index) => (
          <div key={`${label}-${swatch.label}`} className="grid gap-[0.5cqh]">
            <div
              className={cn(
                "border border-border",
                dense
                  ? [
                      index === swatches.length - 1 ? "border-r" : "border-r-0",
                      index === 0 && "rounded-l-sm",
                      index === swatches.length - 1 && "rounded-r-sm",
                    ]
                  : "rounded-sm",
                dense ? "h-[4.45cqw]" : "aspect-square"
              )}
              style={{ backgroundColor: swatch.color }}
            />
            <code className="text-center text-[clamp(0.48rem,0.72cqw,0.64rem)] leading-none text-text-muted">
              {swatch.label}
            </code>
          </div>
        ))}
      </div>
    </div>
  )
}

type LightnessTrapSwatchCardProps = {
  readonly swatch: HslLightnessTrapSwatch
}

function LightnessTrapSwatchCard({ swatch }: LightnessTrapSwatchCardProps) {
  return (
    <div className="grid gap-[0.9cqh]">
      <div
        className="relative aspect-[1.08/1] overflow-hidden rounded-md border border-border"
        style={{ backgroundColor: swatch.color }}
      >
        <div className="absolute inset-x-[11%] top-1/2 h-px bg-white/76 shadow-[0_0_0_1px_rgba(0,0,0,0.42)]" />
        <code className="absolute right-[8%] bottom-[8%] rounded-sm bg-black/52 px-[0.42cqw] py-[0.42cqh] text-[clamp(0.5rem,0.76cqw,0.68rem)] leading-none font-bold text-white">
          L=50%
        </code>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-[0.6cqw]">
        <span className="text-[clamp(0.72rem,1.15cqw,1rem)] leading-none font-bold">
          {swatch.label}
        </span>
        <code className="text-[clamp(0.56rem,0.82cqw,0.72rem)] leading-none text-text-muted">
          {swatch.relativeLuminancePercent}%
        </code>
      </div>
    </div>
  )
}

function LuminanceBar({ swatch }: LightnessTrapSwatchCardProps) {
  return (
    <div className="grid grid-cols-[minmax(2.25rem,5cqw)_minmax(0,1fr)_minmax(1.7rem,3.2cqw)] items-center gap-[0.85cqw] sm:grid-cols-[minmax(3rem,5cqw)_minmax(0,1fr)_minmax(2.2rem,3.2cqw)]">
      <span className="text-[clamp(0.48rem,0.95cqw,0.82rem)] leading-none font-bold text-text-muted">
        {swatch.label}
      </span>
      <div className="relative h-[1.25cqh] min-h-1.5 overflow-hidden rounded-sm border border-border bg-background-secondary sm:h-[1.9cqh] sm:min-h-3">
        <span
          className="absolute inset-y-0 left-0 rounded-sm"
          style={{
            backgroundColor: swatch.color,
            width: `${swatch.relativeLuminancePercent}%`,
          }}
        />
        <span className="absolute inset-y-[-1px] left-1/2 w-px bg-text-normal/48" />
      </div>
      <code className="text-right text-[clamp(0.44rem,0.82cqw,0.72rem)] leading-none text-text-muted">
        {swatch.relativeLuminancePercent}%
      </code>
    </div>
  )
}

type BridgeNodeProps = {
  readonly active?: boolean
  readonly caption: string
  readonly title: string
}

function BridgeNode({ active = false, caption, title }: BridgeNodeProps) {
  return (
    <div
      className={cn(
        "grid min-h-[22cqh] content-center justify-items-center gap-[1.1cqh] rounded-md border border-border bg-background-primary/86 p-[1.8cqw] text-center",
        active && "border-text-normal bg-background-primary"
      )}
    >
      <span className="text-[clamp(0.95rem,2.1cqw,1.75rem)] leading-none font-bold">
        {title}
      </span>
      <span className="font-mono text-[clamp(0.55rem,0.95cqw,0.8rem)] leading-tight text-text-muted">
        {caption}
      </span>
    </div>
  )
}

function BridgeArrow() {
  return <span className="h-px w-[3cqw] bg-border" />
}
