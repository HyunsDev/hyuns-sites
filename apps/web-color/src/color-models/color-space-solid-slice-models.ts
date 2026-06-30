import type { ColorSpaceModelId } from "@/color-models/color-space-models"

export type SolidSliceModelId = Extract<
  ColorSpaceModelId,
  | "hsl"
  | "hsl-cube"
  | "hsv"
  | "hsv-cube"
  | "lab"
  | "lch"
  | "lch-cube"
  | "oklch"
  | "oklch-cube"
  | "rgb"
>
export type SolidSliceAxisId =
  | "a"
  | "b"
  | "c"
  | "g"
  | "h"
  | "l"
  | "r"
  | "s"
  | "v"

export type SolidSliceAxis = {
  readonly color: string
  readonly coordinateLabel: string
  readonly defaultValue: number
  readonly id: SolidSliceAxisId
  readonly label: string
  readonly max: number
  readonly min: number
  readonly step: number
  readonly unit: "degree" | "number" | "percent"
}

export type SolidSliceState = {
  readonly axisId: SolidSliceAxisId
  readonly value: number
}

const SLICE_AXES_BY_MODEL = {
  rgb: [
    {
      id: "r",
      color: "#ef4444",
      coordinateLabel: "X axis",
      label: "Red",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.5,
      unit: "number",
    },
    {
      id: "g",
      color: "#22c55e",
      coordinateLabel: "Y axis",
      label: "Green",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.5,
      unit: "number",
    },
    {
      id: "b",
      color: "#3b82f6",
      coordinateLabel: "Z axis",
      label: "Blue",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.5,
      unit: "number",
    },
  ],
  hsl: [
    {
      id: "h",
      color: "#f59e0b",
      coordinateLabel: "Angle",
      label: "Hue",
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 24,
      unit: "degree",
    },
    {
      id: "s",
      color: "#06b6d4",
      coordinateLabel: "Radius",
      label: "Saturation",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 1,
      unit: "percent",
    },
    {
      id: "l",
      color: "#64748b",
      coordinateLabel: "Vertical axis",
      label: "Lightness",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.5,
      unit: "percent",
    },
  ],
  "hsl-cube": [
    {
      id: "h",
      color: "#f59e0b",
      coordinateLabel: "X axis",
      label: "Hue",
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 24,
      unit: "degree",
    },
    {
      id: "s",
      color: "#06b6d4",
      coordinateLabel: "Z axis",
      label: "Saturation",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 1,
      unit: "percent",
    },
    {
      id: "l",
      color: "#64748b",
      coordinateLabel: "Y axis",
      label: "Lightness",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.5,
      unit: "percent",
    },
  ],
  hsv: [
    {
      id: "h",
      color: "#f59e0b",
      coordinateLabel: "Angle",
      label: "Hue",
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 24,
      unit: "degree",
    },
    {
      id: "s",
      color: "#a855f7",
      coordinateLabel: "Radius",
      label: "Saturation",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 1,
      unit: "percent",
    },
    {
      id: "v",
      color: "#64748b",
      coordinateLabel: "Vertical axis",
      label: "Value",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.75,
      unit: "percent",
    },
  ],
  "hsv-cube": [
    {
      id: "h",
      color: "#f59e0b",
      coordinateLabel: "X axis",
      label: "Hue",
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 24,
      unit: "degree",
    },
    {
      id: "s",
      color: "#a855f7",
      coordinateLabel: "Z axis",
      label: "Saturation",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 1,
      unit: "percent",
    },
    {
      id: "v",
      color: "#64748b",
      coordinateLabel: "Y axis",
      label: "Value",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.75,
      unit: "percent",
    },
  ],
  lab: [
    {
      id: "l",
      color: "#64748b",
      coordinateLabel: "Vertical axis",
      label: "Lightness",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.62,
      unit: "percent",
    },
    {
      id: "a",
      color: "#db2777",
      coordinateLabel: "a axis",
      label: "Green - Red",
      min: -200,
      max: 200,
      step: 1,
      defaultValue: 0,
      unit: "number",
    },
    {
      id: "b",
      color: "#eab308",
      coordinateLabel: "b axis",
      label: "Blue - Yellow",
      min: -200,
      max: 200,
      step: 1,
      defaultValue: 0,
      unit: "number",
    },
  ],
  lch: [
    {
      id: "h",
      color: "#f59e0b",
      coordinateLabel: "Angle",
      label: "Hue",
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 32,
      unit: "degree",
    },
    {
      id: "c",
      color: "#10b981",
      coordinateLabel: "Radius",
      label: "Chroma",
      min: 0,
      max: 150,
      step: 1,
      defaultValue: 74,
      unit: "number",
    },
    {
      id: "l",
      color: "#64748b",
      coordinateLabel: "Vertical axis",
      label: "Lightness",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.62,
      unit: "percent",
    },
  ],
  "lch-cube": [
    {
      id: "h",
      color: "#f59e0b",
      coordinateLabel: "X axis",
      label: "Hue",
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 32,
      unit: "degree",
    },
    {
      id: "c",
      color: "#10b981",
      coordinateLabel: "Y axis",
      label: "Chroma",
      min: 0,
      max: 150,
      step: 1,
      defaultValue: 74,
      unit: "number",
    },
    {
      id: "l",
      color: "#64748b",
      coordinateLabel: "Z axis",
      label: "Lightness",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.62,
      unit: "percent",
    },
  ],
  oklch: [
    {
      id: "h",
      color: "#f59e0b",
      coordinateLabel: "Angle",
      label: "Hue",
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 32,
      unit: "degree",
    },
    {
      id: "c",
      color: "#e11d48",
      coordinateLabel: "Radius",
      label: "Chroma",
      min: 0,
      max: 0.4,
      step: 0.005,
      defaultValue: 0.18,
      unit: "number",
    },
    {
      id: "l",
      color: "#64748b",
      coordinateLabel: "Vertical axis",
      label: "Lightness",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.7,
      unit: "percent",
    },
  ],
  "oklch-cube": [
    {
      id: "h",
      color: "#f59e0b",
      coordinateLabel: "X axis",
      label: "Hue",
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 32,
      unit: "degree",
    },
    {
      id: "c",
      color: "#e11d48",
      coordinateLabel: "Y axis",
      label: "Chroma",
      min: 0,
      max: 0.4,
      step: 0.005,
      defaultValue: 0.18,
      unit: "number",
    },
    {
      id: "l",
      color: "#64748b",
      coordinateLabel: "Z axis",
      label: "Lightness",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.7,
      unit: "percent",
    },
  ],
} as const satisfies Record<SolidSliceModelId, readonly SolidSliceAxis[]>

export function isSolidSliceModel(
  modelId: ColorSpaceModelId
): modelId is SolidSliceModelId {
  return (
    modelId === "rgb" ||
    modelId === "hsl" ||
    modelId === "hsl-cube" ||
    modelId === "hsv" ||
    modelId === "hsv-cube" ||
    modelId === "lab" ||
    modelId === "lch" ||
    modelId === "lch-cube" ||
    modelId === "oklch" ||
    modelId === "oklch-cube"
  )
}

export function getSolidSliceAxes(modelId: SolidSliceModelId) {
  return SLICE_AXES_BY_MODEL[modelId]
}

export function createDefaultSolidSliceState(
  modelId: SolidSliceModelId
): SolidSliceState {
  const axes = getSolidSliceAxes(modelId)
  const axis = axes[axes.length - 1]

  if (!axis) {
    throw new RangeError(`Missing slice axis for ${modelId}`)
  }

  return { axisId: axis.id, value: axis.defaultValue }
}

export function getSolidSliceAxis(
  modelId: SolidSliceModelId,
  axisId: SolidSliceAxisId
) {
  return getSolidSliceAxes(modelId).find((axis) => axis.id === axisId)
}
