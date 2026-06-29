import { cn } from "@hyunsdev/ui/lib/utils"

import { PresentationSolidModelVisual } from "@/presentation/PresentationSolidModelVisual"
import {
  createHslHsvComparisonRows,
  createHslLightnessTrapSwatches,
  createHsvAxisPaletteRows,
  HSL_HSV_SECTION_MODELS,
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
  return (
    <div className="grid grid-cols-4 gap-[1.25cqw]">
      {createHslLightnessTrapSwatches().map((swatch) => (
        <div key={swatch.label} className="grid gap-[1.2cqh]">
          <div
            className="aspect-square rounded-md border border-border"
            style={{ backgroundColor: swatch.color }}
          />
          <div className="grid gap-[0.45cqh]">
            <span className="text-[clamp(0.78rem,1.35cqw,1.15rem)] leading-none font-bold">
              {swatch.label}
            </span>
            <code className="text-[clamp(0.56rem,0.9cqw,0.76rem)] leading-none text-text-muted">
              HSL L = 50%
            </code>
          </div>
        </div>
      ))}
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
      <div className={cn("grid grid-cols-10 gap-[0.5cqw]", dense && "gap-[0.42cqw]")}>
        {swatches.map((swatch) => (
          <div key={`${label}-${swatch.label}`} className="grid gap-[0.5cqh]">
            <div
              className={cn(
                "rounded-sm border border-border",
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
