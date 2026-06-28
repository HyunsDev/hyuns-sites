import type {
  CieXyzChromaticity,
  CieXyzGamutDefinition,
  CieXyzGamutId,
} from "./cie-xyz-gamut-data.ts"
import { CIE_XYZ_GAMUTS } from "./cie-xyz-gamut-data.ts"
import {
  createRgbToXyzMatrix,
  multiplyMatrixPoint,
} from "./cie-xyz-gamut-space.ts"
import type { XyzPoint } from "./cie-xyz-gamut-space.ts"

export type CieRgbChannelId = "b" | "g" | "r"

export type CieRgbInputFields = {
  readonly b: string
  readonly g: string
  readonly r: string
}

export type CieRgbInput = {
  readonly b: number
  readonly g: number
  readonly r: number
}

export type CieRgbInputPreset = {
  readonly id: string
  readonly label: string
  readonly value: CieRgbInputFields
}

export type LinearRgb = {
  readonly b: number
  readonly g: number
  readonly r: number
}

export type CieRgbGamutPoint = {
  readonly chromaticity: CieXyzChromaticity | null
  readonly encodedRgb: CieRgbInput
  readonly label: string
  readonly lineColor: string
  readonly linearRgb: LinearRgb
  readonly previewColor: string
  readonly shortLabel: string
  readonly targetId: CieXyzGamutId
  readonly xyz: XyzPoint
}

export type CieRgbInputParseResult =
  | {
      readonly input: CieRgbInput
      readonly status: "parsed"
    }
  | {
      readonly message: string
      readonly status: "invalid"
    }

export type CieRgbGamutComparison =
  | {
      readonly input: CieRgbInput
      readonly points: readonly CieRgbGamutPoint[]
      readonly status: "parsed"
    }
  | {
      readonly message: string
      readonly status: "invalid"
    }

export const DEFAULT_CIE_RGB_INPUT = {
  b: "0",
  g: "0",
  r: "255",
} as const satisfies CieRgbInputFields

export const CIE_RGB_INPUT_PRESETS = [
  { id: "red", label: "Red", value: { b: "0", g: "0", r: "255" } },
  { id: "green", label: "Green", value: { b: "0", g: "255", r: "0" } },
  { id: "blue", label: "Blue", value: { b: "255", g: "0", r: "0" } },
  { id: "white", label: "White", value: { b: "255", g: "255", r: "255" } },
  { id: "cyan", label: "Cyan", value: { b: "255", g: "255", r: "0" } },
  { id: "magenta", label: "Magenta", value: { b: "255", g: "0", r: "255" } },
  { id: "yellow", label: "Yellow", value: { b: "0", g: "255", r: "255" } },
] as const satisfies readonly CieRgbInputPreset[]

type ChannelParseResult =
  | {
      readonly status: "parsed"
      readonly value: number
    }
  | {
      readonly message: string
      readonly status: "invalid"
    }

const BT2020_ALPHA = 1.09929682680944
const BT2020_BETA = 0.018053968510807
const BT2020_LINEAR_THRESHOLD = 4.5 * BT2020_BETA

function parseChannel(value: string, label: string): ChannelParseResult {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return { status: "invalid", message: `${label} 값을 입력해 주세요.` }
  }

  const channel = Number(trimmed)

  if (!Number.isFinite(channel) || !Number.isInteger(channel)) {
    return { status: "invalid", message: `${label} 값은 0-255 정수여야 합니다.` }
  }

  if (channel < 0 || channel > 255) {
    return { status: "invalid", message: `${label} 값은 0-255 범위여야 합니다.` }
  }

  return { status: "parsed", value: channel }
}

function readParsedChannel(result: ChannelParseResult) {
  switch (result.status) {
    case "parsed":
      return result.value
    case "invalid":
      return null
    default:
      return assertNever(result)
  }
}

function readParseError(result: ChannelParseResult) {
  switch (result.status) {
    case "parsed":
      return null
    case "invalid":
      return result.message
    default:
      return assertNever(result)
  }
}

export function parseCieRgbInput(
  fields: CieRgbInputFields
): CieRgbInputParseResult {
  const parsedR = parseChannel(fields.r, "R")
  const parsedG = parseChannel(fields.g, "G")
  const parsedB = parseChannel(fields.b, "B")
  const firstError =
    readParseError(parsedR) ?? readParseError(parsedG) ?? readParseError(parsedB)

  if (firstError) {
    return { status: "invalid", message: firstError }
  }

  const r = readParsedChannel(parsedR)
  const g = readParsedChannel(parsedG)
  const b = readParsedChannel(parsedB)

  if (r === null || g === null || b === null) {
    return { status: "invalid", message: "RGB 값을 파싱할 수 없습니다." }
  }

  return { status: "parsed", input: { b, g, r } }
}

function decodeSrgbChannel(channel: number) {
  const encoded = channel / 255

  return encoded <= 0.04045
    ? encoded / 12.92
    : ((encoded + 0.055) / 1.055) ** 2.4
}

function decodeBt2020Channel(channel: number) {
  const encoded = channel / 255

  return encoded < BT2020_LINEAR_THRESHOLD
    ? encoded / 4.5
    : ((encoded + BT2020_ALPHA - 1) / BT2020_ALPHA) ** (1 / 0.45)
}

function decodeChannel(targetId: CieXyzGamutId, channel: number) {
  switch (targetId) {
    case "srgb":
    case "display-p3":
      return decodeSrgbChannel(channel)
    case "bt2020":
      return decodeBt2020Channel(channel)
    default:
      return assertNever(targetId)
  }
}

function createLinearRgb(targetId: CieXyzGamutId, input: CieRgbInput): LinearRgb {
  return {
    b: decodeChannel(targetId, input.b),
    g: decodeChannel(targetId, input.g),
    r: decodeChannel(targetId, input.r),
  }
}

function formatCssUnitChannel(channel: number) {
  return formatCieRgbNumber(channel / 255)
}

function createPreviewColor(targetId: CieXyzGamutId, input: CieRgbInput) {
  switch (targetId) {
    case "srgb":
      return `rgb(${input.r} ${input.g} ${input.b})`
    case "display-p3":
      return `color(display-p3 ${formatCssUnitChannel(
        input.r
      )} ${formatCssUnitChannel(input.g)} ${formatCssUnitChannel(input.b)})`
    case "bt2020":
      return `color(rec2020 ${formatCssUnitChannel(
        input.r
      )} ${formatCssUnitChannel(input.g)} ${formatCssUnitChannel(input.b)})`
    default:
      return assertNever(targetId)
  }
}

function xyzToChromaticity(point: XyzPoint): CieXyzChromaticity | null {
  const sum = point.x + point.y + point.z

  return sum > 0 ? { x: point.x / sum, y: point.y / sum } : null
}

function createGamutPoint(
  gamut: CieXyzGamutDefinition,
  input: CieRgbInput
): CieRgbGamutPoint {
  const linearRgb = createLinearRgb(gamut.id, input)
  const xyz = multiplyMatrixPoint(createRgbToXyzMatrix(gamut), {
    x: linearRgb.r,
    y: linearRgb.g,
    z: linearRgb.b,
  })

  return {
    chromaticity: xyzToChromaticity(xyz),
    encodedRgb: input,
    label: gamut.label,
    lineColor: gamut.lineColor,
    linearRgb,
    previewColor: createPreviewColor(gamut.id, input),
    shortLabel: gamut.shortLabel,
    targetId: gamut.id,
    xyz,
  }
}

export function createCieRgbGamutComparison(
  fields: CieRgbInputFields
): CieRgbGamutComparison {
  const parsed = parseCieRgbInput(fields)

  switch (parsed.status) {
    case "invalid":
      return { status: "invalid", message: parsed.message }
    case "parsed":
      return {
        status: "parsed",
        input: parsed.input,
        points: CIE_XYZ_GAMUTS.map((gamut) =>
          createGamutPoint(gamut, parsed.input)
        ),
      }
    default:
      return assertNever(parsed)
  }
}

export function formatCieRgbNumber(value: number) {
  return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")
}

function assertNever(value: never): never {
  throw new RangeError(`Unexpected CIE RGB gamut value: ${String(value)}`)
}
