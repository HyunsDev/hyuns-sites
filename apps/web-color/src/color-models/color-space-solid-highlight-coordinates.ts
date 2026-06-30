import type { Color } from "culori"

import type { ColorSpaceModelId } from "./color-space-models.ts"

export type SolidHighlightColorMode =
  | "hsl"
  | "hsv"
  | "hwb"
  | "lab"
  | "lch"
  | "oklab"
  | "oklch"
  | "rgb"

export type SolidHighlightChannelId =
  | "a"
  | "b"
  | "c"
  | "g"
  | "h"
  | "l"
  | "r"
  | "s"
  | "v"
  | "w"

export type SolidHighlightChannel = {
  readonly id: SolidHighlightChannelId
  readonly max: number
  readonly min: number
  readonly segments: number
  readonly value: number | null
}

export type SolidHighlightChannelSet = {
  readonly channels: readonly SolidHighlightChannel[]
  readonly mode: SolidHighlightColorMode
}

export type SolidHighlightChannelOverride = {
  readonly id: SolidHighlightChannelId
  readonly value: number
}

const LAB_CHROMA_MAX = 200
const OKLAB_CHROMA_MAX = 0.48
const UNIT_SEGMENTS = 24
const HUE_SEGMENTS = 72
const CARTESIAN_SEGMENTS = 32
export function getSolidHighlightCoordinateMode(
  modelId: ColorSpaceModelId
): SolidHighlightColorMode | null {
  switch (modelId) {
    case "rgb":
      return "rgb"
    case "hsl":
    case "hsl-cube":
      return "hsl"
    case "hsv":
    case "hsv-cube":
      return "hsv"
    case "hwb":
    case "hwb-cube":
      return "hwb"
    case "lab":
      return "lab"
    case "lch":
    case "lch-cube":
      return "lch"
    case "oklab":
      return "oklab"
    case "oklch":
    case "oklch-cube":
      return "oklch"
    case "xyz":
    case "xyy":
      return null
    default:
      return assertNeverModel(modelId)
  }
}

export function getSolidHighlightChannelSet(
  color: Color
): SolidHighlightChannelSet | null {
  switch (color.mode) {
    case "rgb":
      return channelSet("rgb", [
        channel("r", 0, 1, UNIT_SEGMENTS, color),
        channel("g", 0, 1, UNIT_SEGMENTS, color),
        channel("b", 0, 1, UNIT_SEGMENTS, color),
      ])
    case "hsl":
      return channelSet("hsl", [
        channel("h", 0, 360, HUE_SEGMENTS, color),
        channel("s", 0, 1, UNIT_SEGMENTS, color),
        channel("l", 0, 1, UNIT_SEGMENTS, color),
      ])
    case "hwb":
      return channelSet("hwb", [
        channel("h", 0, 360, HUE_SEGMENTS, color),
        channel("w", 0, 1, UNIT_SEGMENTS, color),
        channel("b", 0, 1, UNIT_SEGMENTS, color),
      ])
    case "lab":
      return channelSet("lab", [
        channel("l", 0, 100, UNIT_SEGMENTS, color),
        channel("a", -LAB_CHROMA_MAX, LAB_CHROMA_MAX, CARTESIAN_SEGMENTS, color),
        channel("b", -LAB_CHROMA_MAX, LAB_CHROMA_MAX, CARTESIAN_SEGMENTS, color),
      ])
    case "lch":
      return channelSet("lch", [
        channel("l", 0, 100, UNIT_SEGMENTS, color),
        channel("c", 0, LAB_CHROMA_MAX, CARTESIAN_SEGMENTS, color),
        channel("h", 0, 360, HUE_SEGMENTS, color),
      ])
    case "oklab":
      return channelSet("oklab", [
        channel("l", 0, 1, UNIT_SEGMENTS, color),
        channel("a", -OKLAB_CHROMA_MAX, OKLAB_CHROMA_MAX, CARTESIAN_SEGMENTS, color),
        channel("b", -OKLAB_CHROMA_MAX, OKLAB_CHROMA_MAX, CARTESIAN_SEGMENTS, color),
      ])
    case "oklch":
      return channelSet("oklch", [
        channel("l", 0, 1, UNIT_SEGMENTS, color),
        channel("c", 0, OKLAB_CHROMA_MAX, CARTESIAN_SEGMENTS, color),
        channel("h", 0, 360, HUE_SEGMENTS, color),
      ])
    default:
      return null
  }
}

export function createColorFromSolidHighlightChannels({
  channels,
  mode,
  overrides,
}: {
  readonly channels: readonly SolidHighlightChannel[]
  readonly mode: SolidHighlightColorMode
  readonly overrides: readonly SolidHighlightChannelOverride[]
}): Color {
  switch (mode) {
    case "rgb":
      return {
        mode,
        r: readChannelValue({ channels, id: "r", overrides }),
        g: readChannelValue({ channels, id: "g", overrides }),
        b: readChannelValue({ channels, id: "b", overrides }),
      }
    case "hsl":
      return {
        mode,
        h: readChannelValue({ channels, id: "h", overrides }),
        s: readChannelValue({ channels, id: "s", overrides }),
        l: readChannelValue({ channels, id: "l", overrides }),
      }
    case "hsv":
      return {
        mode,
        h: readChannelValue({ channels, id: "h", overrides }),
        s: readChannelValue({ channels, id: "s", overrides }),
        v: readChannelValue({ channels, id: "v", overrides }),
      }
    case "hwb":
      return {
        mode,
        h: readChannelValue({ channels, id: "h", overrides }),
        w: readChannelValue({ channels, id: "w", overrides }),
        b: readChannelValue({ channels, id: "b", overrides }),
      }
    case "lab":
      return {
        mode,
        l: readChannelValue({ channels, id: "l", overrides }),
        a: readChannelValue({ channels, id: "a", overrides }),
        b: readChannelValue({ channels, id: "b", overrides }),
      }
    case "lch":
      return {
        mode,
        l: readChannelValue({ channels, id: "l", overrides }),
        c: readChannelValue({ channels, id: "c", overrides }),
        h: readChannelValue({ channels, id: "h", overrides }),
      }
    case "oklab":
      return {
        mode,
        l: readChannelValue({ channels, id: "l", overrides }),
        a: readChannelValue({ channels, id: "a", overrides }),
        b: readChannelValue({ channels, id: "b", overrides }),
      }
    case "oklch":
      return {
        mode,
        l: readChannelValue({ channels, id: "l", overrides }),
        c: readChannelValue({ channels, id: "c", overrides }),
        h: readChannelValue({ channels, id: "h", overrides }),
      }
    default:
      return assertNeverHighlightMode(mode)
  }
}

function channelSet(
  mode: SolidHighlightColorMode,
  channels: readonly SolidHighlightChannel[]
): SolidHighlightChannelSet {
  return { channels, mode }
}

function channel(
  id: SolidHighlightChannelId,
  min: number,
  max: number,
  segments: number,
  color: Color
): SolidHighlightChannel {
  return { id, min, max, segments, value: readOptionalChannel(color, id) }
}

function readOptionalChannel(
  color: Color,
  channelId: SolidHighlightChannelId
) {
  const value: unknown = Reflect.get(color, channelId)

  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function readChannelValue({
  channels,
  id,
  overrides,
}: {
  readonly channels: readonly SolidHighlightChannel[]
  readonly id: SolidHighlightChannelId
  readonly overrides: readonly SolidHighlightChannelOverride[]
}) {
  const override = overrides.find((item) => item.id === id)

  if (override) {
    return override.value
  }

  const channelValue = channels.find((item) => item.id === id)?.value

  return channelValue ?? 0
}

function assertNeverModel(modelId: never): never {
  throw new RangeError(`Unknown solid highlight model: ${modelId}`)
}

function assertNeverHighlightMode(mode: never): never {
  throw new RangeError(`Unknown solid highlight mode: ${mode}`)
}
