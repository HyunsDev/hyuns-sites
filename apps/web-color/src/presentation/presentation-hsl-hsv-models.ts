import { formatHex } from "culori"

import { formatCssColor } from "../color-models/color-css-format.ts"
import {
  getCoordinatePlanes,
  type ColorCoordinatePlane,
} from "../color-models/color-coordinate-plane-models.ts"
import {
  toCuloriColor,
  type ColorCoordinate,
  type ColorCoordinateAxisId,
  type ColorCoordinateModelId,
  type HslCoordinate,
  type HsvCoordinate,
} from "../color-models/color-coordinate-utils.ts"

export type HslHsvModelId = Extract<ColorCoordinateModelId, "hsl" | "hsv">
export type PresentationControlModelId = Extract<
  ColorCoordinateModelId,
  "hsl" | "hsv" | "oklch"
>

export type PresentationColorSwatch = {
  readonly color: string
  readonly coordinate: ColorCoordinate
  readonly label: string
}

export type HsvPresentationColorSwatch = {
  readonly color: string
  readonly coordinate: HsvCoordinate
  readonly label: string
}

export type HsvAxisPaletteRow = {
  readonly axisId: Extract<ColorCoordinateAxisId, "h" | "s" | "v">
  readonly label: string
  readonly swatches: readonly HsvPresentationColorSwatch[]
}

export type HslHsvComparisonRow = {
  readonly label: string
  readonly swatches: readonly PresentationColorSwatch[]
}

export const HSL_HSV_SECTION_MODELS = [
  {
    caption: "Hue / Saturation / Lightness",
    modelId: "hsl",
    title: "HSL",
  },
  {
    caption: "Hue / Saturation / Value",
    modelId: "hsv",
    title: "HSV",
  },
] as const satisfies readonly {
  readonly caption: string
  readonly modelId: HslHsvModelId
  readonly title: string
}[]

const HUE_STEPS = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324] as const
const PERCENT_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const

export function requirePresentationPlane(
  modelId: PresentationControlModelId,
  xAxisId: ColorCoordinateAxisId,
  yAxisId: ColorCoordinateAxisId
): ColorCoordinatePlane {
  const plane = getCoordinatePlanes(modelId).find(
    (item) => item.xAxisId === xAxisId && item.yAxisId === yAxisId
  )

  if (!plane) {
    throw new RangeError(`Missing ${modelId} ${xAxisId} x ${yAxisId} plane`)
  }

  return plane
}

export function getDisplayColor(coordinate: ColorCoordinate) {
  return formatHex(toCuloriColor(coordinate))
}

export function formatCoordinateCssOutput(coordinate: ColorCoordinate) {
  switch (coordinate.modelId) {
    case "hsl":
      return formatCssColor(toCuloriColor(coordinate), "hsl")
    case "hsv":
      return formatCssColor(toCuloriColor(coordinate), "rgb")
    case "oklch":
      return formatCssColor(toCuloriColor(coordinate), "oklch")
    case "lch":
    case "rgb":
      return formatCssColor(toCuloriColor(coordinate), "rgb")
    default:
      return assertNeverCoordinate(coordinate)
  }
}

export function createHsvAxisPaletteRows(): readonly HsvAxisPaletteRow[] {
  return [
    {
      axisId: "h",
      label: "Hue만 변경",
      swatches: HUE_STEPS.map((hue) =>
        createHsvSwatch(`${hue}deg`, { modelId: "hsv", h: hue, s: 90, v: 100 })
      ),
    },
    {
      axisId: "s",
      label: "Saturation만 변경",
      swatches: PERCENT_STEPS.map((saturation) =>
        createHsvSwatch(`${saturation}%`, {
          modelId: "hsv",
          h: 24,
          s: saturation,
          v: 100,
        })
      ),
    },
    {
      axisId: "v",
      label: "Value만 변경",
      swatches: PERCENT_STEPS.map((value) =>
        createHsvSwatch(`${value}%`, { modelId: "hsv", h: 24, s: 90, v: value })
      ),
    },
  ]
}

export function createHslHsvComparisonRows(): readonly HslHsvComparisonRow[] {
  return [
    {
      label: "HSL Lightness",
      swatches: [15, 30, 45, 60, 75].map((lightness) =>
        createSwatch(`${lightness}%`, {
          modelId: "hsl",
          h: 220,
          s: 90,
          l: lightness,
        })
      ),
    },
    {
      label: "HSV Value",
      swatches: [20, 40, 60, 80, 100].map((value) =>
        createSwatch(`${value}%`, { modelId: "hsv", h: 220, s: 90, v: value })
      ),
    },
  ]
}

export function createHslLightnessTrapSwatches() {
  return [
    createSwatch("Blue", { modelId: "hsl", h: 240, s: 100, l: 50 }),
    createSwatch("Yellow", { modelId: "hsl", h: 60, s: 100, l: 50 }),
    createSwatch("Red", { modelId: "hsl", h: 0, s: 100, l: 50 }),
    createSwatch("Green", { modelId: "hsl", h: 120, s: 100, l: 50 }),
  ]
}

function createSwatch(
  label: string,
  coordinate: HslCoordinate | HsvCoordinate
): PresentationColorSwatch {
  return {
    color: getDisplayColor(coordinate),
    coordinate,
    label,
  }
}

function createHsvSwatch(
  label: string,
  coordinate: HsvCoordinate
): HsvPresentationColorSwatch {
  return {
    color: getDisplayColor(coordinate),
    coordinate,
    label,
  }
}

function assertNeverCoordinate(coordinate: never): never {
  throw new RangeError(`Unsupported presentation color coordinate: ${coordinate}`)
}
