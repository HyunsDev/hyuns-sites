import { formatHex, toGamut } from "culori"
import type { Color, Oklch } from "culori"

import { formatCssColor } from "../color-models/color-css-format.ts"
import { isColorInGamut } from "../color-models/color-gamut-analysis.ts"
import { PALETTE_STOPS, type PaletteSwatch } from "./presentation-oklch-practice-data.ts"

const mapToSrgb = toGamut("rgb", "oklch")
const CHROMA_FIT_ITERATIONS = 16
const CHROMA_FORMATTING_MARGIN = 0.0015

export function createOklchScale(input: {
  readonly chroma: number
  readonly hue: number
}): readonly PaletteSwatch[] {
  return PALETTE_STOPS.map((stop) =>
    createPaletteSwatch({
      color: fitOklchToSrgb({
        mode: "oklch",
        c: input.chroma,
        h: input.hue,
        l: stop.lightness / 100,
      }),
      label: stop.label,
      lightness: stop.lightness,
    })
  )
}

export function createPaletteSwatch(input: {
  readonly color: Color
  readonly label: string
  readonly lightness: number
}): PaletteSwatch {
  const inSrgb = isColorInGamut(input.color, "rgb")
  const displayColor = inSrgb ? input.color : mapToSrgb(input.color)

  return {
    color: formatHex(displayColor),
    css: formatCssColor(input.color, "oklch"),
    inSrgb,
    label: input.label,
    lightness: input.lightness,
  }
}

function fitOklchToSrgb(color: Oklch): Oklch {
  if (isColorInGamut(color, "rgb") || color.c <= 0) {
    return color
  }

  let lower = 0
  let upper = color.c

  for (let index = 0; index < CHROMA_FIT_ITERATIONS; index += 1) {
    const current = (lower + upper) / 2
    const candidate = { ...color, c: current }

    if (isColorInGamut(candidate, "rgb")) {
      lower = current
    } else {
      upper = current
    }
  }

  return { ...color, c: Math.max(0, lower - CHROMA_FORMATTING_MARGIN) }
}
