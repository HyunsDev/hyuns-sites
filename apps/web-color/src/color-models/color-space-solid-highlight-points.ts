import { converter } from "culori"
import type { Color } from "culori"

import { hueChromaCubeToPoint } from "./color-space-hue-cube.ts"
import type { ColorSpaceModelId } from "./color-space-models.ts"
import type { Vector3Point } from "./color-space-samples.ts"

const LAB_CHROMA_MAX = 200
const OKLAB_CHROMA_MAX = 0.48
const XYY_EPSILON = 0.000001
const CIE_D65_WHITE = { x: 0.3127, y: 0.329 } as const
const XYZ_D65_WHITE = {
  x: CIE_D65_WHITE.x / CIE_D65_WHITE.y,
  y: 1,
  z: (1 - CIE_D65_WHITE.x - CIE_D65_WHITE.y) / CIE_D65_WHITE.y,
} as const
const XY_AXIS_MAX = { x: 0.8, y: 0.9 } as const

const toRgb = converter("rgb")
const toHsl = converter("hsl")
const toHsv = converter("hsv")
const toHwb = converter("hwb")
const toLab = converter("lab")
const toLch = converter("lch")
const toOklab = converter("oklab")
const toOklch = converter("oklch")
const toXyz65 = converter("xyz65")

export function getSolidHighlightPoint(
  modelId: ColorSpaceModelId,
  color: Color
): Vector3Point | null {
  switch (modelId) {
    case "rgb":
      return finitePoint(toRgbPoint(color))
    case "hsl":
      return finitePoint(toHslPoint(color))
    case "hsl-cube":
      return finitePoint(toHslCubePoint(color))
    case "hsv":
      return finitePoint(toHsvPoint(color))
    case "hsv-cube":
      return finitePoint(toHsvCubePoint(color))
    case "hwb":
      return finitePoint(toHwbPoint(color))
    case "hwb-cube":
      return finitePoint(toHwbCubePoint(color))
    case "lab":
      return finitePoint(toLabPoint(color))
    case "lch":
      return finitePoint(toLchPoint(color))
    case "lch-cube":
      return finitePoint(toLchCubePoint(color))
    case "oklab":
      return finitePoint(toOklabPoint(color))
    case "oklch":
      return finitePoint(toOklchPoint(color))
    case "oklch-cube":
      return finitePoint(toOklchCubePoint(color))
    case "xyz":
      return finitePoint(toXyzModelPoint(color))
    case "xyy":
      return finitePoint(toXyyModelPoint(color))
    default:
      return assertNeverModel(modelId)
  }
}

function normalizeHue(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 0
  }

  return ((value % 360) + 360) % 360
}

function normalizeUnit(value: number) {
  return value * 2 - 1
}

function polarToPoint(
  hue: number,
  radius: number,
  y: number
): Vector3Point {
  const radians = (hue / 180) * Math.PI

  return {
    x: Math.cos(radians) * radius,
    y,
    z: Math.sin(radians) * radius,
  }
}

function hueCubeToPoint(
  hue: number,
  yUnit: number,
  zUnit: number
): Vector3Point {
  return {
    x: normalizeUnit(hue / 360),
    y: normalizeUnit(yUnit),
    z: normalizeUnit(zUnit),
  }
}

function finitePoint(point: Vector3Point): Vector3Point | null {
  return Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    Number.isFinite(point.z)
    ? point
    : null
}

function toRgbPoint(color: Color): Vector3Point {
  const rgb = toRgb(color)

  return {
    x: normalizeUnit(rgb.r),
    y: normalizeUnit(rgb.g),
    z: normalizeUnit(rgb.b),
  }
}

function toHslPoint(color: Color): Vector3Point {
  const hsl = toHsl(color)
  const radius = hsl.s * (1 - Math.abs(2 * hsl.l - 1))

  return polarToPoint(normalizeHue(hsl.h), radius, normalizeUnit(hsl.l))
}

function toHslCubePoint(color: Color): Vector3Point {
  const hsl = toHsl(color)

  return hueCubeToPoint(normalizeHue(hsl.h), hsl.l, hsl.s)
}

function toHsvPoint(color: Color): Vector3Point {
  const hsv = toHsv(color)

  return polarToPoint(
    normalizeHue(hsv.h),
    hsv.s * hsv.v,
    normalizeUnit(hsv.v)
  )
}

function toHsvCubePoint(color: Color): Vector3Point {
  const hsv = toHsv(color)

  return hueCubeToPoint(normalizeHue(hsv.h), hsv.v, hsv.s)
}

function toHwbPoint(color: Color): Vector3Point {
  const hwb = toHwb(color)
  const amount = hwb.w > hwb.b ? hwb.w : hwb.b
  const y = hwb.w > hwb.b ? amount : -amount

  return polarToPoint(normalizeHue(hwb.h), 1 - amount, y)
}

function toHwbCubePoint(color: Color): Vector3Point {
  const hwb = toHwb(color)

  return hueCubeToPoint(normalizeHue(hwb.h), hwb.w, hwb.b)
}

function toLabPoint(color: Color): Vector3Point {
  const lab = toLab(color)

  return {
    x: lab.a / LAB_CHROMA_MAX,
    y: normalizeUnit(lab.l / 100),
    z: lab.b / LAB_CHROMA_MAX,
  }
}

function toLchPoint(color: Color): Vector3Point {
  const lch = toLch(color)

  return polarToPoint(
    normalizeHue(lch.h),
    lch.c / LAB_CHROMA_MAX,
    normalizeUnit(lch.l / 100)
  )
}

function toLchCubePoint(color: Color): Vector3Point {
  const lch = toLch(color)

  return hueChromaCubeToPoint(
    normalizeHue(lch.h),
    lch.c / LAB_CHROMA_MAX,
    lch.l / 100
  )
}

function toOklabPoint(color: Color): Vector3Point {
  const oklab = toOklab(color)

  return {
    x: oklab.a / OKLAB_CHROMA_MAX,
    y: normalizeUnit(oklab.l),
    z: oklab.b / OKLAB_CHROMA_MAX,
  }
}

function toOklchPoint(color: Color): Vector3Point {
  const oklch = toOklch(color)

  return polarToPoint(
    normalizeHue(oklch.h),
    oklch.c / OKLAB_CHROMA_MAX,
    normalizeUnit(oklch.l)
  )
}

function toOklchCubePoint(color: Color): Vector3Point {
  const oklch = toOklch(color)

  return hueChromaCubeToPoint(
    normalizeHue(oklch.h),
    oklch.c / OKLAB_CHROMA_MAX,
    oklch.l
  )
}

function toXyzModelPoint(color: Color): Vector3Point {
  const xyz = toXyz65(color)

  return {
    x: normalizeXyzChannel(xyz.x, XYZ_D65_WHITE.x),
    y: normalizeXyzChannel(xyz.y, XYZ_D65_WHITE.y),
    z: normalizeXyzChannel(xyz.z, XYZ_D65_WHITE.z),
  }
}

function toXyyModelPoint(color: Color): Vector3Point {
  const xyz = toXyz65(color)
  const sum = xyz.x + xyz.y + xyz.z
  const chromaticity =
    sum <= XYY_EPSILON
      ? CIE_D65_WHITE
      : {
          x: xyz.x / sum,
          y: xyz.y / sum,
        }

  return {
    x: normalizeXyChannel(chromaticity.x, XY_AXIS_MAX.x),
    y: normalizeXyzChannel(xyz.y, XYZ_D65_WHITE.y),
    z: normalizeXyChannel(chromaticity.y, XY_AXIS_MAX.y),
  }
}

function normalizeXyzChannel(value: number, whiteValue: number) {
  return (value / whiteValue) * 2 - 1
}

function normalizeXyChannel(value: number, maxValue: number) {
  return (value / maxValue) * 2 - 1
}

function assertNeverModel(modelId: never): never {
  throw new RangeError(`Unknown solid highlight model: ${modelId}`)
}
