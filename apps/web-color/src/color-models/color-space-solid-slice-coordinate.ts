import {
  getSolidSliceAxes,
  type SolidSliceAxis,
  type SolidSliceAxisId,
  type SolidSliceModelId,
} from "./color-space-solid-slice-models.ts"
import type {
  ColorCoordinate,
  ColorCoordinateModelId,
} from "./color-coordinate-utils.ts"

export function getSolidSliceCoordinateModelId(
  modelId: SolidSliceModelId
): ColorCoordinateModelId {
  switch (modelId) {
    case "rgb":
      return "rgb"
    case "hsl":
    case "hsl-cube":
      return "hsl"
    case "hsv":
    case "hsv-cube":
      return "hsv"
    case "lab":
      return "lab"
    case "lch":
    case "lch-cube":
      return "lch"
    case "oklch":
    case "oklch-cube":
      return "oklch"
    default:
      return assertNeverModel(modelId)
  }
}

export function createSolidSliceCoordinate({
  axisId,
  modelId,
  value,
}: {
  readonly axisId: SolidSliceAxisId
  readonly modelId: SolidSliceModelId
  readonly value: number
}): ColorCoordinate {
  const controlModelId = getSolidSliceCoordinateModelId(modelId)
  const channel = (nextAxisId: SolidSliceAxisId) =>
    toCoordinateValue(
      requireSliceAxis(modelId, nextAxisId),
      readSliceValue(modelId, axisId, value, nextAxisId)
    )

  switch (controlModelId) {
    case "rgb":
      return {
        modelId: "rgb",
        r: channel("r"),
        g: channel("g"),
        b: channel("b"),
      }
    case "hsl":
      return {
        modelId: "hsl",
        h: channel("h"),
        s: channel("s"),
        l: channel("l"),
      }
    case "hsv":
      return {
        modelId: "hsv",
        h: channel("h"),
        s: channel("s"),
        v: channel("v"),
      }
    case "lab":
      return {
        modelId: "lab",
        l: channel("l"),
        a: channel("a"),
        b: channel("b"),
      }
    case "lch":
      return {
        modelId: "lch",
        l: channel("l"),
        c: channel("c"),
        h: channel("h"),
      }
    case "oklab":
      throw new RangeError("OKLab slice controls are not supported")
    case "oklch":
      return {
        modelId: "oklch",
        l: channel("l"),
        c: channel("c"),
        h: channel("h"),
      }
    default:
      return assertNeverCoordinateModel(controlModelId)
  }
}

export function toSolidSliceValue(axis: SolidSliceAxis, value: number) {
  if (axis.unit === "percent") {
    return value / 100
  }

  if (axis.id === "r" || axis.id === "g" || axis.id === "b") {
    return value / 255
  }

  return value
}

function toCoordinateValue(axis: SolidSliceAxis, value: number) {
  if (axis.unit === "percent") {
    return value * 100
  }

  if (axis.id === "r" || axis.id === "g" || axis.id === "b") {
    return value * 255
  }

  return value
}

function readSliceValue(
  modelId: SolidSliceModelId,
  activeAxisId: SolidSliceAxisId,
  activeValue: number,
  axisId: SolidSliceAxisId
) {
  return axisId === activeAxisId
    ? activeValue
    : requireSliceAxis(modelId, axisId).defaultValue
}

function requireSliceAxis(
  modelId: SolidSliceModelId,
  axisId: SolidSliceAxisId
) {
  const axis = getSolidSliceAxes(modelId).find((item) => item.id === axisId)

  if (!axis) {
    throw new RangeError(`Missing ${axisId} slice axis for ${modelId}`)
  }

  return axis
}

function assertNeverModel(modelId: never): never {
  throw new RangeError(`Unknown slice coordinate model: ${modelId}`)
}

function assertNeverCoordinateModel(modelId: never): never {
  throw new RangeError(`Unknown slice coordinate control model: ${modelId}`)
}
