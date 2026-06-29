import type { RgbCoordinate } from "@/color-models/color-coordinate-utils"

export const INITIAL_RGB_COORDINATE = {
  modelId: "rgb",
  r: 255,
  g: 0,
  b: 0,
} satisfies RgbCoordinate

export const RGB_LIMITS_BASE_COORDINATE = {
  modelId: "rgb",
  r: 255,
  g: 96,
  b: 64,
} satisfies RgbCoordinate

export const RGB_LIMITS_INITIAL_COORDINATE = {
  modelId: "rgb",
  r: 160,
  g: 96,
  b: 64,
} satisfies RgbCoordinate

export type RgbAxisId = "r" | "g" | "b"

export type RgbAxisDefinition = {
  readonly axisId: RgbAxisId
  readonly label: string
}

export const RGB_AXES = [
  { axisId: "r", label: "R" },
  { axisId: "g", label: "G" },
  { axisId: "b", label: "B" },
] satisfies readonly RgbAxisDefinition[]

export type RgbDerivedMetrics = {
  readonly brightness: number
  readonly hue: number
  readonly saturation: number
}

export function readRgbAxisValue(coordinate: RgbCoordinate, axisId: RgbAxisId) {
  switch (axisId) {
    case "r":
      return coordinate.r
    case "g":
      return coordinate.g
    case "b":
      return coordinate.b
  }
}

export function setRgbAxisValue(
  coordinate: RgbCoordinate,
  axisId: RgbAxisId,
  value: number
): RgbCoordinate {
  switch (axisId) {
    case "r":
      return { ...coordinate, r: clampRgbChannel(value) }
    case "g":
      return { ...coordinate, g: clampRgbChannel(value) }
    case "b":
      return { ...coordinate, b: clampRgbChannel(value) }
  }
}

export function clampRgbChannel(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(255, Math.max(0, Math.round(value)))
}

export function formatRgbHex(coordinate: RgbCoordinate) {
  return `#${[coordinate.r, coordinate.g, coordinate.b]
    .map((channel) => clampRgbChannel(channel).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`
}

export function getReadablePreviewTextColor(coordinate: RgbCoordinate) {
  const r = coordinate.r / 255
  const g = coordinate.g / 255
  const b = coordinate.b / 255
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance > 0.58 ? "#111111" : "#ffffff"
}

export function getRgbDerivedMetrics(
  coordinate: RgbCoordinate
): RgbDerivedMetrics {
  const r = clampRgbChannel(coordinate.r) / 255
  const g = clampRgbChannel(coordinate.g) / 255
  const b = clampRgbChannel(coordinate.b) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const brightness = Math.round(max * 100)
  const saturation = max === 0 ? 0 : Math.round((delta / max) * 100)

  if (delta === 0) {
    return {
      brightness,
      hue: 0,
      saturation,
    }
  }

  let hue = 0

  if (max === r) {
    hue = ((g - b) / delta) % 6
  } else if (max === g) {
    hue = (b - r) / delta + 2
  } else {
    hue = (r - g) / delta + 4
  }

  return {
    brightness,
    hue: Math.round((hue * 60 + 360) % 360),
    saturation,
  }
}
