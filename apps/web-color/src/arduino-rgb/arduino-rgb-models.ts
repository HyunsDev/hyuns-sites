import {
  hsl as toHslColor,
  hsv as toHsvColor,
  oklch as toOklchColor,
  rgb as toRgbColor,
} from "culori"
import type { Hsl, Hsv, Oklch, Rgb } from "culori"

export type ArduinoRgb = {
  readonly b: number
  readonly g: number
  readonly r: number
}

export type ColorModelAxis = {
  readonly id: string
  readonly label: string
  readonly max: number
  readonly min: number
  readonly step: number
  readonly unit: "degree" | "number" | "percent"
}

export const COLOR_MODEL_IDS = ["rgb", "hsl", "hsv", "cmyk", "oklch"] as const

export type ColorModelId = (typeof COLOR_MODEL_IDS)[number]

export type ColorModelDefinition = {
  readonly axes: readonly ColorModelAxis[]
  readonly fromRgb: (rgb: ArduinoRgb) => readonly number[]
  readonly id: ColorModelId
  readonly label: string
  readonly toRgb: (values: readonly number[]) => ArduinoRgb
}

export const DEFAULT_ARDUINO_RGB: ArduinoRgb = { r: 255, g: 96, b: 36 }

const RGB_AXES: readonly ColorModelAxis[] = [
  { id: "r", label: "Red", min: 0, max: 255, step: 1, unit: "number" },
  { id: "g", label: "Green", min: 0, max: 255, step: 1, unit: "number" },
  { id: "b", label: "Blue", min: 0, max: 255, step: 1, unit: "number" },
]

const HSL_AXES: readonly ColorModelAxis[] = [
  { id: "h", label: "Hue", min: 0, max: 360, step: 1, unit: "degree" },
  { id: "s", label: "Sat", min: 0, max: 100, step: 1, unit: "percent" },
  { id: "l", label: "Light", min: 0, max: 100, step: 1, unit: "percent" },
]

const HSV_AXES: readonly ColorModelAxis[] = [
  { id: "h", label: "Hue", min: 0, max: 360, step: 1, unit: "degree" },
  { id: "s", label: "Sat", min: 0, max: 100, step: 1, unit: "percent" },
  { id: "v", label: "Value", min: 0, max: 100, step: 1, unit: "percent" },
]

const CMYK_AXES: readonly ColorModelAxis[] = [
  { id: "c", label: "Cyan", min: 0, max: 100, step: 1, unit: "percent" },
  { id: "m", label: "Mag", min: 0, max: 100, step: 1, unit: "percent" },
  { id: "y", label: "Yellow", min: 0, max: 100, step: 1, unit: "percent" },
  { id: "k", label: "Key", min: 0, max: 100, step: 1, unit: "percent" },
]

const OKLCH_AXES: readonly ColorModelAxis[] = [
  { id: "l", label: "Light", min: 0, max: 100, step: 1, unit: "percent" },
  { id: "c", label: "Chroma", min: 0, max: 0.4, step: 0.005, unit: "number" },
  { id: "h", label: "Hue", min: 0, max: 360, step: 1, unit: "degree" },
]

export const COLOR_MODELS: readonly ColorModelDefinition[] = [
  {
    id: "rgb",
    label: "RGB",
    axes: RGB_AXES,
    fromRgb: (rgb) => [rgb.r, rgb.g, rgb.b],
    toRgb: (values) => ({
      r: clampByte(valueAt(values, 0, 0)),
      g: clampByte(valueAt(values, 1, 0)),
      b: clampByte(valueAt(values, 2, 0)),
    }),
  },
  {
    id: "hsl",
    label: "HSL",
    axes: HSL_AXES,
    fromRgb: (rgb) => {
      const color = toHslColor(toCuloriRgb(rgb))

      return [color.h ?? 0, color.s * 100, color.l * 100]
    },
    toRgb: (values) =>
      culoriRgbToArduinoRgb(
        toRgbColor({
          mode: "hsl",
          h: valueAt(values, 0, 0),
          s: valueAt(values, 1, 0) / 100,
          l: valueAt(values, 2, 0) / 100,
        } satisfies Hsl)
      ),
  },
  {
    id: "hsv",
    label: "HSV",
    axes: HSV_AXES,
    fromRgb: (rgb) => {
      const color = toHsvColor(toCuloriRgb(rgb))

      return [color.h ?? 0, color.s * 100, color.v * 100]
    },
    toRgb: (values) =>
      culoriRgbToArduinoRgb(
        toRgbColor({
          mode: "hsv",
          h: valueAt(values, 0, 0),
          s: valueAt(values, 1, 0) / 100,
          v: valueAt(values, 2, 0) / 100,
        } satisfies Hsv)
      ),
  },
  {
    id: "cmyk",
    label: "CMYK",
    axes: CMYK_AXES,
    fromRgb: rgbToCmykValues,
    toRgb: cmykValuesToRgb,
  },
  {
    id: "oklch",
    label: "OKLCH",
    axes: OKLCH_AXES,
    fromRgb: (rgb) => {
      const color = toOklchColor(toCuloriRgb(rgb))

      return [color.l * 100, color.c, color.h ?? 0]
    },
    toRgb: (values) =>
      culoriRgbToArduinoRgb(
        toRgbColor({
          mode: "oklch",
          l: valueAt(values, 0, 0) / 100,
          c: valueAt(values, 1, 0),
          h: valueAt(values, 2, 0),
        } satisfies Oklch)
      ),
  },
]

export function getColorModelDefinition(
  modelId: ColorModelId
): ColorModelDefinition {
  const model = COLOR_MODELS.find((item) => item.id === modelId)

  if (!model) {
    throw new RangeError(`Unknown Arduino RGB color model: ${modelId}`)
  }

  return model
}

export function setModelAxisValue({
  axisIndex,
  value,
  values,
}: {
  readonly axisIndex: number
  readonly value: number
  readonly values: readonly number[]
}): readonly number[] {
  return values.map((currentValue, currentIndex) =>
    currentIndex === axisIndex ? value : currentValue
  )
}

export function formatArduinoRgb(rgb: ArduinoRgb): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export function formatAxisValue({
  axis,
  value,
}: {
  readonly axis: ColorModelAxis
  readonly value: number
}): string {
  switch (axis.unit) {
    case "degree":
      return `${Math.round(value)}deg`
    case "number":
      return Number.isInteger(value) ? `${value}` : value.toFixed(3)
    case "percent":
      return `${Math.round(value)}%`
    default:
      return assertNeverUnit(axis.unit)
  }
}

function cmykValuesToRgb(values: readonly number[]): ArduinoRgb {
  const c = valueAt(values, 0, 0) / 100
  const m = valueAt(values, 1, 0) / 100
  const y = valueAt(values, 2, 0) / 100
  const k = valueAt(values, 3, 0) / 100

  return {
    r: clampByte(255 * (1 - c) * (1 - k)),
    g: clampByte(255 * (1 - m) * (1 - k)),
    b: clampByte(255 * (1 - y) * (1 - k)),
  }
}

function rgbToCmykValues(rgb: ArduinoRgb): readonly number[] {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const k = 1 - Math.max(r, g, b)

  if (k >= 1) {
    return [0, 0, 0, 100]
  }

  return [
    ((1 - r - k) / (1 - k)) * 100,
    ((1 - g - k) / (1 - k)) * 100,
    ((1 - b - k) / (1 - k)) * 100,
    k * 100,
  ]
}

function toCuloriRgb(rgb: ArduinoRgb): Rgb {
  return {
    mode: "rgb",
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
  }
}

function culoriRgbToArduinoRgb(color: Rgb): ArduinoRgb {
  return {
    r: clampByte(color.r * 255),
    g: clampByte(color.g * 255),
    b: clampByte(color.b * 255),
  }
}

function clampByte(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(255, Math.max(0, Math.round(value)))
}

function valueAt(
  values: readonly number[],
  index: number,
  fallback: number
): number {
  return values[index] ?? fallback
}

function assertNeverUnit(unit: never): never {
  throw new RangeError(`Unknown Arduino RGB value unit: ${unit}`)
}
