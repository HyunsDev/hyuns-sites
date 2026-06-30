import {
  analyzeGamutClipping,
  GAMUT_CLIPPING_TARGETS,
  type GamutClippingTargetId,
} from "../color-models/color-gamut-clipping-models.ts"
import {
  createInterpolationRows,
  type InterpolationRow,
} from "../color-models/color-interpolation-models.ts"

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
  readonly emphasisLabel: string | null
  readonly inSrgb: boolean
  readonly label: string
}

export type ComparisonRow = {
  readonly label: "Lab" | "OKLCH"
  readonly note: string
  readonly swatches: readonly ComparisonSwatch[]
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
  const rows = createInterpolationRows({
    startColor: "#6366f1",
    endColor: "#f97316",
    hueStrategyId: "shorter",
    stepCount: 7,
  })

  return rows
    .filter(isLabOrOklchRow)
    .map((row) => ({
      label: row.label,
      note: row.label === "Lab" ? "muted midpoint" : "clearer chroma path",
      swatches: row.steps.map((step) => ({
        color: step.hex,
        emphasisLabel: getComparisonEmphasisLabel(row.label, step.position),
        inSrgb: step.inSrgb,
        label: `${Math.round(step.position * 100)}%`,
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

  return label === "Lab" ? "muted middle" : "cleaner middle"
}

function getGamutEdgeLabel(swatches: readonly GamutChromaSwatch[]) {
  const firstOutOfGamutSwatch = swatches.find((swatch) => !swatch.inTarget)

  return firstOutOfGamutSwatch
    ? `edge ${firstOutOfGamutSwatch.label}`
    : "inside"
}
