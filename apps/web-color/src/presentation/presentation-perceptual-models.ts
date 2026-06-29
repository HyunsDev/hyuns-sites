import type { Color } from "culori"

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
  readonly color: string
  readonly inTarget: boolean
  readonly label: string
}

export type GamutChromaRow = {
  readonly label: string
  readonly swatches: readonly GamutChromaSwatch[]
  readonly targetId: GamutClippingTargetId
}

export type ComparisonSwatch = {
  readonly color: string
  readonly inSrgb: boolean
  readonly label: string
}

export type ComparisonRow = {
  readonly label: "Lab" | "OKLCH"
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
  return GAMUT_CLIPPING_TARGETS.map((target) => ({
    label: target.label,
    targetId: target.id,
    swatches: CHROMA_STEPS.map((chroma) => {
      const result = analyzeGamutClipping({
        targetId: target.id,
        lightness: 68,
        chroma,
        hue: 305,
      })

      return {
        color: result.sourceHex,
        inTarget: result.inTarget,
        label: chroma.toFixed(2),
      }
    }),
  }))
}

export function createLabToOklabComparisonRows(): readonly ComparisonRow[] {
  const rows = createInterpolationRows({
    startColor: { mode: "rgb", r: 0.08, g: 0.18, b: 1 } satisfies Color,
    endColor: { mode: "rgb", r: 1, g: 0.18, b: 0.82 } satisfies Color,
    hueStrategyId: "shorter",
    stepCount: 7,
  })

  return rows
    .filter(isLabOrOklchRow)
    .map((row) => ({
      label: row.label,
      swatches: row.steps.map((step) => ({
        color: step.hex,
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
