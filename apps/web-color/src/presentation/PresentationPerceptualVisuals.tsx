import { cn } from "@hyunsdev/ui/lib/utils"

import { PresentationSolidModelVisual } from "@/presentation/PresentationSolidModelVisual"
import {
  createGamutChromaRows,
  PART_1_PURPOSE_STEPS,
  PERCEPTUAL_MODEL_STEPS,
  type GamutChromaSwatch,
  type PurposeStep,
} from "@/presentation/presentation-perceptual-models"

export function PerceptualNeedDiagram() {
  return (
    <div className="grid gap-[2cqw]">
      <PurposeSteps steps={PERCEPTUAL_MODEL_STEPS} />
      <div className="grid grid-cols-2 gap-[1.2cqw]">
        <MetricTile label="same numbers" value="Δ 20" />
        <MetricTile label="same perception" value="?" active />
      </div>
    </div>
  )
}

export function LabAxisDiagram() {
  return (
    <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] items-center gap-[2cqw]">
      <SolidModelFrame modelId="lab" />
      <div className="grid gap-[1.2cqw]">
        <AxisTile label="L" caption="Lightness" />
        <AxisTile label="a" caption="Green <-> Red" />
        <AxisTile label="b" caption="Blue <-> Yellow" />
      </div>
    </div>
  )
}

export function LchPolarDiagram() {
  return (
    <div className="grid min-h-0 grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] items-center gap-[2cqw]">
      <div className="relative aspect-square rounded-md border border-border bg-background-primary/84">
        <div className="absolute inset-[12%] rounded-full border border-border" />
        <div className="absolute top-1/2 left-1/2 h-px w-[34%] origin-left -translate-y-1/2 rotate-[32deg] bg-text-normal" />
        <div className="absolute top-1/2 left-1/2 size-[1.1cqw] min-h-2 min-w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-muted" />
        <div className="absolute top-[36%] left-[68%] size-[1.6cqw] min-h-3 min-w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-normal" />
        <code className="absolute top-[31%] left-[72%] text-[clamp(0.58rem,1cqw,0.86rem)] leading-none font-bold">
          point
        </code>
        <code className="absolute top-[45%] left-[57%] text-[clamp(0.58rem,1cqw,0.86rem)] leading-none text-text-muted">
          C
        </code>
        <code className="absolute top-[53%] left-[64%] text-[clamp(0.58rem,1cqw,0.86rem)] leading-none text-text-muted">
          H
        </code>
      </div>
      <SolidModelFrame modelId="lch" />
    </div>
  )
}

export function GamutCautionDiagram() {
  return (
    <div className="grid gap-[1.25cqw]">
      {createGamutChromaRows().map((row) => (
        <div key={row.targetId} className="grid gap-[0.55cqw]">
          <div className="flex items-center justify-between gap-[1cqw]">
            <span className="font-mono text-[clamp(0.62rem,1.05cqw,0.88rem)] leading-none font-bold text-text-normal">
              {row.label}
            </span>
            <code className="text-[clamp(0.52rem,0.82cqw,0.68rem)] leading-none font-bold text-text-muted">
              {row.edgeLabel}
            </code>
          </div>
          <div className="grid grid-cols-12 overflow-hidden rounded-md border border-border bg-background-primary/84">
            {row.swatches.map((swatch) => (
              <GamutChromaChip
                key={`${row.targetId}-${swatch.label}`}
                swatch={swatch}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

type GamutChromaChipProps = {
  readonly swatch: GamutChromaSwatch
}

function GamutChromaChip({ swatch }: GamutChromaChipProps) {
  return (
    <div
      className={cn(
        "grid h-[5.4cqw] min-h-9 grid-rows-[0.36fr_1fr] border-r border-border last:border-r-0",
        !swatch.inTarget && "ring-1 ring-inset ring-text-normal/45"
      )}
      title={`${swatch.label} ${swatch.inTarget ? "inside" : "mapped"}`}
    >
      <div style={{ backgroundColor: swatch.requestedColor }} />
      <div
        className="relative"
        style={{ backgroundColor: swatch.renderedColor }}
      >
        {!swatch.inTarget && (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.42)_0_4px,rgba(0,0,0,.2)_4px_8px)]" />
        )}
      </div>
    </div>
  )
}

export function ColorModelPurposeMap() {
  return <PurposeSteps steps={PART_1_PURPOSE_STEPS} activeIndex={3} />
}

type SolidModelFrameProps = {
  readonly modelId: "lab" | "lch" | "oklch"
}

function SolidModelFrame({ modelId }: SolidModelFrameProps) {
  return (
    <div className="relative h-[36cqw] min-h-40 overflow-hidden rounded-md border border-border bg-background-primary/84">
      <PresentationSolidModelVisual
        modelId={modelId}
        variant="section"
        className="top-[4%] h-[86%] w-[86%] min-w-0"
      />
    </div>
  )
}

type AxisTileProps = {
  readonly caption: string
  readonly label: string
}

function AxisTile({ caption, label }: AxisTileProps) {
  return (
    <div className="grid min-h-[7.1cqw] content-center rounded-md border border-border bg-background-primary/84 p-[1.2cqw]">
      <span className="text-[clamp(1.1rem,2.25cqw,1.85rem)] leading-none font-bold">
        {label}
      </span>
      <span className="mt-[0.45cqw] font-mono text-[clamp(0.56rem,0.95cqw,0.78rem)] leading-tight text-text-muted">
        {caption}
      </span>
    </div>
  )
}

type PurposeStepsProps = {
  readonly activeIndex?: number
  readonly steps: readonly PurposeStep[]
}

function PurposeSteps({ activeIndex = -1, steps }: PurposeStepsProps) {
  return (
    <div
      className={cn(
        "grid items-stretch gap-[1cqw]",
        steps.length === 4 ? "grid-cols-4" : "grid-cols-3"
      )}
    >
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={cn(
            "grid min-h-[16cqh] content-center justify-items-center rounded-md border border-border bg-background-primary/84 p-[1.3cqw] text-center",
            index === activeIndex && "border-text-normal bg-background-primary"
          )}
        >
          <span className="text-[clamp(0.9rem,1.75cqw,1.35rem)] leading-tight font-bold text-balance">
            {step.label}
          </span>
          <span className="mt-[0.8cqw] font-mono text-[clamp(0.52rem,0.9cqw,0.72rem)] leading-tight text-text-muted">
            {step.caption}
          </span>
        </div>
      ))}
    </div>
  )
}

type MetricTileProps = {
  readonly active?: boolean
  readonly label: string
  readonly value: string
}

function MetricTile({ active = false, label, value }: MetricTileProps) {
  return (
    <div
      className={cn(
        "grid min-h-[11cqh] content-center rounded-md border border-border bg-background-primary/84 p-[1.4cqw]",
        active && "border-text-normal bg-background-primary"
      )}
    >
      <code className="text-[clamp(1.1rem,2.6cqw,2.1rem)] leading-none font-bold">
        {value}
      </code>
      <span className="mt-[0.8cqw] text-[clamp(0.72rem,1.2cqw,1rem)] leading-tight text-text-muted">
        {label}
      </span>
    </div>
  )
}
