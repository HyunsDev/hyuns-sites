import { CieRgbGamutCanvas } from "@/color-models/CieRgbGamutCanvas"
import type { CieXyzGamutId } from "@/color-models/cie-xyz-gamut-data"
import { HyunsUiAccentFamilyDemo } from "@/presentation/PresentationHyunsUiOklchVisuals"
import { LightnessComparisonGrid } from "@/presentation/PresentationHslHsvVisuals"
import { OklchLightnessSystemDemo } from "@/presentation/PresentationOklchPaletteVisuals"
import { ColorModelDecisionTable } from "@/presentation/PresentationOklchSystemVisuals"
import {
  AxisLabel,
  ContrastCard,
  EllipseMarker,
  FormulaCard,
  MetricChip,
  ScopeLane,
  SwatchRows,
} from "@/presentation/PresentationAppendixVisualPrimitives"

const RGB_GAMUT_IDS = [
  "srgb",
  "display-p3",
] as const satisfies readonly CieXyzGamutId[]

const CHROMA_LIMIT_ROWS = [
  {
    label: "yellow",
    swatches: ["oklch(78% 0.08 95)", "oklch(78% 0.16 95)", "oklch(78% 0.22 95)"],
  },
  {
    label: "blue",
    swatches: ["oklch(62% 0.08 260)", "oklch(62% 0.16 260)", "oklch(62% 0.22 260)"],
  },
  {
    label: "red",
    swatches: ["oklch(64% 0.08 28)", "oklch(64% 0.16 28)", "oklch(64% 0.22 28)"],
  },
] as const

const CHROMA_STRATEGY_ROWS = [
  {
    label: "safe",
    swatches: ["oklch(88% 0.025 260)", "oklch(72% 0.035 260)", "oklch(48% 0.03 260)"],
  },
  {
    label: "brand",
    swatches: ["oklch(86% 0.07 260)", "oklch(68% 0.12 260)", "oklch(46% 0.1 260)"],
  },
  {
    label: "vivid",
    swatches: ["oklch(84% 0.13 260)", "oklch(66% 0.22 260)", "oklch(44% 0.2 260)"],
  },
] as const

export function AppendixScopeVisual() {
  return (
    <div className="grid gap-[1cqw]">
      <ScopeLane title="main flow" items={["모델 선택", "좌표 감각", "UI 팔레트"]} />
      <ScopeLane title="appendix" items={["사양 범위", "용어", "수식", "검증 caveat"]} muted />
    </div>
  )
}

export function AppendixTerminologyVisual() {
  return (
    <div className="grid gap-[0.8cqw]">
      {[
        ["notation", "CSS에 쓰는 문법", "oklch(70% .18 32)"],
        ["model", "색을 읽는 축", "L / C / H"],
        ["space", "좌표가 의미를 갖는 기준", "sRGB / Display P3"],
        ["gamut", "표시 가능한 범위", "inside / outside"],
      ].map(([title, description, example]) => (
        <div
          key={title}
          className="grid grid-cols-[5.2rem_minmax(0,1fr)] gap-[1cqw] rounded-md border border-border bg-background-primary/84 p-[0.9cqw]"
        >
          <code className="font-mono text-[clamp(0.62rem,0.95cqw,0.82rem)] font-bold">
            {title}
          </code>
          <div className="grid gap-[0.25cqw]">
            <span className="text-[clamp(0.62rem,0.95cqw,0.82rem)] leading-tight font-bold">
              {description}
            </span>
            <code className="truncate text-[clamp(0.5rem,0.76cqw,0.66rem)] text-text-muted">
              {example}
            </code>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AppendixRgbFamilyVisual() {
  return (
    <div className="grid gap-[0.8cqw]">
      <CieRgbGamutCanvas
        className="h-[34cqh] min-h-0 rounded-md border border-border bg-background-primary/84"
        gamutIds={RGB_GAMUT_IDS}
        points={[]}
      />
      <div className="grid grid-cols-3 gap-[0.7cqw]">
        <MetricChip label="sRGB" value="baseline" />
        <MetricChip label="P3" value="wider" />
        <MetricChip label="BT.2020" value="widest" />
      </div>
    </div>
  )
}

export function AppendixHslLightnessVisual() {
  return (
    <div className="grid gap-[1.2cqw]">
      <FormulaCard expression="L = (max(R,G,B) + min(R,G,B)) / 2" label="HSL Lightness" />
      <LightnessComparisonGrid />
    </div>
  )
}

export function AppendixPerceptualUniformityVisual() {
  return (
    <div className="grid gap-[1cqw]">
      <div className="relative h-[34cqh] overflow-hidden rounded-md border border-border bg-background-primary/84">
        <EllipseMarker className="top-[18%] left-[14%] h-[14%] w-[28%] rotate-[18deg]" />
        <EllipseMarker className="top-[20%] left-[56%] h-[26%] w-[14%] rotate-[-28deg]" />
        <EllipseMarker className="top-[58%] left-[22%] h-[20%] w-[18%] rotate-[42deg]" />
        <EllipseMarker className="top-[54%] left-[64%] h-[11%] w-[28%] rotate-[-8deg]" />
        <span className="absolute inset-x-[10%] bottom-[10%] h-px bg-border" />
        <span className="absolute bottom-[5%] left-[10%] font-mono text-[clamp(0.52rem,0.8cqw,0.7rem)] text-text-muted">
          same visible delta is not same coordinate delta
        </span>
      </div>
      <FormulaCard expression="Delta E = approximate perceptual distance" label="measurement" />
    </div>
  )
}

export function AppendixLchPolarVisual() {
  return (
    <div className="relative h-[45cqh] overflow-hidden rounded-md border border-border bg-background-primary/84">
      <span className="absolute top-1/2 left-[10%] right-[10%] h-px bg-border" />
      <span className="absolute top-[10%] bottom-[10%] left-1/2 w-px bg-border" />
      <span className="absolute top-1/2 left-1/2 h-[2px] w-[31%] origin-left -translate-y-1/2 rotate-[-32deg] bg-text-normal" />
      <span className="absolute top-[27%] left-[73%] rounded-md border border-border bg-background-secondary px-[0.65cqw] py-[0.35cqw] font-mono text-[clamp(0.52rem,0.82cqw,0.72rem)] font-bold">
        H
      </span>
      <span className="absolute top-[43%] left-[58%] rounded-md border border-border bg-background-secondary px-[0.65cqw] py-[0.35cqw] font-mono text-[clamp(0.52rem,0.82cqw,0.72rem)] font-bold">
        C
      </span>
      <span className="absolute top-[45%] left-[48%] size-[1.2cqw] min-h-2 min-w-2 rounded-full bg-text-normal" />
      <AxisLabel className="right-[6%] top-[46%]" label="a*" />
      <AxisLabel className="left-[48%] top-[6%]" label="b*" />
    </div>
  )
}

export function AppendixOklchChromaLimitVisual() {
  return <SwatchRows rows={CHROMA_LIMIT_ROWS} />
}

export function AppendixOklchContrastVisual() {
  return (
    <div className="grid grid-cols-2 gap-[1cqw]">
      <ContrastCard background="oklch(96% 0.01 260)" foreground="oklch(22% 0.02 260)" ratio="13.2:1" />
      <ContrastCard background="oklch(72% 0.16 32)" foreground="oklch(64% 0.14 32)" ratio="1.3:1" weak />
      <ContrastCard background="oklch(18% 0.02 260)" foreground="oklch(92% 0.01 260)" ratio="12.4:1" />
      <ContrastCard background="oklch(58% 0.18 260)" foreground="oklch(50% 0.16 260)" ratio="1.4:1" weak />
    </div>
  )
}

export function AppendixOklchLightnessVisual() {
  return <OklchLightnessSystemDemo />
}

export function AppendixOklchHclRolesVisual() {
  return <HyunsUiAccentFamilyDemo />
}

export function AppendixOklchChromaStrategyVisual() {
  return <SwatchRows rows={CHROMA_STRATEGY_ROWS} />
}

export function AppendixOklchChecklistVisual() {
  return (
    <div className="grid gap-[1.4cqw]">
      <div className="grid grid-cols-3 gap-[0.8cqw]">
        <MetricChip label="1. H" value="direction" />
        <MetricChip label="2. L" value="role scale" />
        <MetricChip label="3. C" value="gamut fit" />
      </div>
      <ColorModelDecisionTable />
    </div>
  )
}
