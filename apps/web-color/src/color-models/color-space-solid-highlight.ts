import type { Color } from "culori"

import type { LinearDisplayColor } from "./color-sample-rendering.ts"
import type { ColorSampleRenderOptions } from "./color-sample-rendering.ts"
import { toColorSampleRenderColor } from "./color-sample-rendering.ts"
import type { ColorSpaceModelId } from "./color-space-models.ts"
import type { Vector3Point } from "./color-space-samples.ts"
import type { SolidColorSpaceMesh } from "./color-space-solid-mesh.ts"
import {
  getSolidHighlightChannelSet,
  getSolidHighlightCoordinateMode,
  type SolidHighlightColorMode,
  type SolidHighlightChannel,
} from "./color-space-solid-highlight-coordinates.ts"
import {
  createSolidHighlightLine,
  createSolidHighlightSurface,
  type SolidColorSpaceHighlightLine,
} from "./color-space-solid-highlight-geometry.ts"
import { getSolidHighlightPoint } from "./color-space-solid-highlight-points.ts"
import { parseCssColorInput } from "./css-color-notation-models.ts"

export type SolidColorSpaceHighlightKind = "line" | "point" | "surface"

export type SolidColorSpaceHighlight =
  | {
      readonly color: LinearDisplayColor
      readonly freeChannels: readonly string[]
      readonly kind: "point"
      readonly label: string
      readonly position: Vector3Point
    }
  | {
      readonly freeChannels: readonly string[]
      readonly kind: "line"
      readonly label: string
      readonly line: SolidColorSpaceHighlightLine
    }
  | {
      readonly freeChannels: readonly string[]
      readonly kind: "surface"
      readonly label: string
      readonly mesh: SolidColorSpaceMesh
    }

export type SolidColorSpaceHighlightResult =
  | {
      readonly status: "empty"
    }
  | {
      readonly status: "invalid"
    }
  | {
      readonly highlight: SolidColorSpaceHighlight
      readonly status: "ready"
    }
  | {
      readonly status: "unsupported"
    }

type SolidColorSpaceHighlightInput = {
  readonly modelId: ColorSpaceModelId
  readonly options: ColorSampleRenderOptions
  readonly value: string
}

const FALLBACK_HIGHLIGHT_COLOR = { r: 1, g: 1, b: 1 } as const

export function createSolidColorSpaceHighlight({
  modelId,
  options,
  value,
}: SolidColorSpaceHighlightInput): SolidColorSpaceHighlightResult {
  const trimmedValue = value.trim()

  if (trimmedValue.length === 0) {
    return { status: "empty" }
  }

  const parseResult = parseCssColorInput(trimmedValue)

  if (parseResult.status === "invalid") {
    return { status: "invalid" }
  }

  const channelSet = getSolidHighlightChannelSet(parseResult.color)
  const freeChannels = channelSet
    ? channelSet.channels.filter((channel) => channel.value === null)
    : []

  if (freeChannels.length === 0) {
    return createPointHighlight({
      color: parseResult.color,
      label: trimmedValue,
      modelId,
      options,
    })
  }

  if (!channelSet || freeChannels.length > 2) {
    return { status: "unsupported" }
  }

  const coordinateMode = getSolidHighlightCoordinateMode(modelId)

  if (coordinateMode !== channelSet.mode) {
    return { status: "unsupported" }
  }

  if (freeChannels.length === 1) {
    const freeChannel = freeChannels[0]

    return freeChannel
      ? createLineHighlight({
          channels: channelSet.channels,
          freeChannel,
          label: trimmedValue,
          mode: channelSet.mode,
          modelId,
          options,
        })
      : { status: "unsupported" }
  }

  const firstChannel = freeChannels[0]
  const secondChannel = freeChannels[1]

  return firstChannel && secondChannel
    ? createSurfaceHighlight({
        channels: channelSet.channels,
        firstChannel,
        label: trimmedValue,
        mode: channelSet.mode,
        modelId,
        options,
        secondChannel,
      })
    : { status: "unsupported" }
}

function createPointHighlight({
  color,
  label,
  modelId,
  options,
}: {
  readonly color: Color
  readonly label: string
  readonly modelId: ColorSpaceModelId
  readonly options: ColorSampleRenderOptions
}): SolidColorSpaceHighlightResult {
  const position = getSolidHighlightPoint(modelId, color)

  if (!position) {
    return { status: "unsupported" }
  }

  return {
    highlight: {
      color: toHighlightColor(color, options),
      freeChannels: [],
      kind: "point",
      label,
      position,
    },
    status: "ready",
  }
}

function createLineHighlight({
  channels,
  freeChannel,
  label,
  mode,
  modelId,
  options,
}: {
  readonly channels: readonly SolidHighlightChannel[]
  readonly freeChannel: SolidHighlightChannel
  readonly label: string
  readonly mode: SolidHighlightColorMode
  readonly modelId: ColorSpaceModelId
  readonly options: ColorSampleRenderOptions
}): SolidColorSpaceHighlightResult {
  return {
    highlight: {
      freeChannels: [freeChannel.id],
      kind: "line",
      label,
      line: createSolidHighlightLine({
        channels,
        freeChannel,
        mode,
        modelId,
        options,
      }),
    },
    status: "ready",
  }
}

function createSurfaceHighlight({
  channels,
  firstChannel,
  label,
  mode,
  modelId,
  options,
  secondChannel,
}: {
  readonly channels: readonly SolidHighlightChannel[]
  readonly firstChannel: SolidHighlightChannel
  readonly label: string
  readonly mode: SolidHighlightColorMode
  readonly modelId: ColorSpaceModelId
  readonly options: ColorSampleRenderOptions
  readonly secondChannel: SolidHighlightChannel
}): SolidColorSpaceHighlightResult {
  return {
    highlight: {
      freeChannels: [firstChannel.id, secondChannel.id],
      kind: "surface",
      label,
      mesh: createSolidHighlightSurface({
        channels,
        firstChannel,
        label,
        mode,
        modelId,
        options,
        secondChannel,
      }),
    },
    status: "ready",
  }
}

function toHighlightColor(
  color: Color,
  options: ColorSampleRenderOptions
): LinearDisplayColor {
  return toColorSampleRenderColor(color, options) ?? FALLBACK_HIGHLIGHT_COLOR
}
