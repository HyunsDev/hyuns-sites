import {
  analyzeGamutClipping,
  GAMUT_CLIPPING_TARGETS,
  type GamutClippingTargetId,
} from "../color-models/color-gamut-clipping-models.ts"
import {
  createInterpolationRows,
  formatInterpolationStepPosition,
  type InterpolationRow,
  type InterpolationStep,
} from "../color-models/color-interpolation-models.ts"
import {
  formatCssColor,
  type CssColorNotation,
} from "../color-models/color-css-format.ts"

export type PurposeStep = {
  readonly caption: string
  readonly label: string
}

export type GamutChromaSwatch = {
  readonly renderedColor: string
  readonly requestedColor: string
  readonly inTarget: boolean
  readonly label: string
}

export type GamutChromaRow = {
  readonly edgeLabel: string
  readonly label: string
  readonly swatches: readonly GamutChromaSwatch[]
  readonly targetId: GamutClippingTargetId
}

export type ComparisonSwatch = {
  readonly color: string
  readonly css: string
  readonly emphasisLabel: string | null
  readonly inSrgb: boolean
  readonly label: string
  readonly metrics: string
}

export type ComparisonRow = {
  readonly endCss: string
  readonly label: "Lab" | "OKLCH"
  readonly note: string
  readonly startCss: string
  readonly swatches: readonly ComparisonSwatch[]
}

export type ComparisonPalette = {
  readonly id: string
  readonly label: string
  readonly rows: readonly ComparisonRow[]
}

export const PERCEPTUAL_MODEL_STEPS = [
  { label: "RGB/HSL", caption: "device math" },
  { label: "Lab/LCH", caption: "perceptual distance" },
  { label: "Oklab/OKLCH", caption: "modern UI design" },
] as const satisfies readonly PurposeStep[]

export const PART_1_PURPOSE_STEPS = [
  { label: "RGB", caption: "표시" },
  { label: "HSL/HSV", caption: "선택" },
  { label: "Lab/LCH", caption: "지각 차이" },
  { label: "Oklab/OKLCH", caption: "UI 설계" },
] as const satisfies readonly PurposeStep[]

const CHROMA_STEPS = [
  0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.28, 0.32, 0.36, 0.4, 0.44,
] as const

const LAB_TO_OKLAB_COMPARISON_PALETTES = [
  {
    id: "violet-amber",
    label: "Violet -> Amber",
    startColor: "#6366f1",
    endColor: "#f97316",
  },
  {
    id: "cyan-rose",
    label: "Cyan -> Rose",
    startColor: "#06b6d4",
    endColor: "#f43f5e",
  },
  {
    id: "mint-sky",
    label: "Mint -> Sky",
    startColor: "#6ee7b7",
    endColor: "#93c5fd",
  },
] as const

export function createGamutChromaRows(): readonly GamutChromaRow[] {
  return GAMUT_CLIPPING_TARGETS.map((target) => {
    const swatches = CHROMA_STEPS.map((chroma) => {
      const result = analyzeGamutClipping({
        targetId: target.id,
        lightness: 68,
        chroma,
        hue: 150,
      })

      return {
        renderedColor: result.mappedHex,
        requestedColor: result.sourceHex,
        inTarget: result.inTarget,
        label: chroma.toFixed(2),
      }
    })

    return {
      edgeLabel: getGamutEdgeLabel(swatches),
      label: target.label,
      targetId: target.id,
      swatches,
    }
  })
}

export function createLabToOklabComparisonRows(): readonly ComparisonRow[] {
  return createLabToOklabComparisonRowsForPalette(
    LAB_TO_OKLAB_COMPARISON_PALETTES[0]
  )
}

export function createLabToOklabComparisonPalettes(): readonly ComparisonPalette[] {
  return LAB_TO_OKLAB_COMPARISON_PALETTES.map((palette) => ({
    id: palette.id,
    label: palette.label,
    rows: createLabToOklabComparisonRowsForPalette(palette),
  }))
}

function createLabToOklabComparisonRowsForPalette(
  palette: (typeof LAB_TO_OKLAB_COMPARISON_PALETTES)[number]
): readonly ComparisonRow[] {
  const rows = createInterpolationRows({
    startColor: palette.startColor,
    endColor: palette.endColor,
    hueStrategyId: "shorter",
    stepCount: 11,
  })

  return rows
    .filter(isLabOrOklchRow)
    .map((row) => ({
      endCss: formatComparisonStepCss(row.label, row.steps[row.steps.length - 1]),
      label: row.label,
      note: row.label === "Lab" ? "탁한 중간" : "선명한 중간",
      startCss: formatComparisonStepCss(row.label, row.steps[0]),
      swatches: row.steps.map((step) => ({
        color: step.hex,
        css: formatComparisonStepCss(row.label, step),
        emphasisLabel: getComparisonEmphasisLabel(row.label, step.position),
        inSrgb: step.inSrgb,
        label: formatInterpolationStepPosition(step.position),
        metrics: formatComparisonStepMetrics(row.label, step),
      })),
    }))
}

function isLabOrOklchRow(
  row: InterpolationRow
): row is InterpolationRow & { readonly label: "Lab" | "OKLCH" } {
  return row.label === "Lab" || row.label === "OKLCH"
}

function getComparisonEmphasisLabel(
  label: "Lab" | "OKLCH",
  position: number
) {
  if (position !== 0.5) {
    return null
  }

  return label === "Lab" ? "탁한 중간" : "선명한 중간"
}

function formatComparisonStepCss(
  label: "Lab" | "OKLCH",
  step: InterpolationStep | undefined
) {
  if (!step) {
    return ""
  }

  return formatCssColor(step.color, getComparisonNotation(label))
}

function formatComparisonStepMetrics(
  label: "Lab" | "OKLCH",
  step: InterpolationStep
) {
  const css = formatComparisonStepCss(label, step)
  const start = css.indexOf("(")
  const end = css.lastIndexOf(")")

  return start > 0 && end > start ? css.slice(start + 1, end) : css
}

function getComparisonNotation(label: "Lab" | "OKLCH"): CssColorNotation {
  return label === "Lab" ? "lab" : "oklch"
}

function getGamutEdgeLabel(swatches: readonly GamutChromaSwatch[]) {
  const firstOutOfGamutSwatch = swatches.find((swatch) => !swatch.inTarget)

  return firstOutOfGamutSwatch
    ? `edge ${firstOutOfGamutSwatch.label}`
    : "inside"
}
