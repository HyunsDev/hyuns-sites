import type {
  ColorModelAxis,
  ColorModelDefinition,
  ColorModelId,
} from "./arduino-rgb-models.ts"
import {
  getModelAxisRatio,
  getModelAxisValue,
  getModelAxisValueFromRatio,
  requireModelAxis,
  setModelAxisValue,
} from "./arduino-rgb-axis-values.ts"

export type ColorModelPlane = {
  readonly fixedAxisIndices: readonly number[]
  readonly id: string
  readonly label: string
  readonly modelId: ColorModelId
  readonly xAxisIndex: number
  readonly yAxisIndex: number
}

export type PlaneMarkerPosition = {
  readonly x: number
  readonly y: number
}

export function getColorModelPlanes(
  model: ColorModelDefinition
): readonly ColorModelPlane[] {
  return model.axes.flatMap((xAxis, xAxisIndex) =>
    model.axes.slice(xAxisIndex + 1).map((yAxis, relativeIndex) => {
      const yAxisIndex = xAxisIndex + relativeIndex + 1

      return {
        fixedAxisIndices: getFixedAxisIndices({
          axisCount: model.axes.length,
          xAxisIndex,
          yAxisIndex,
        }),
        id: `${model.id}-${xAxis.id}-${yAxis.id}`,
        label: `${formatAxisToken(xAxis)} x ${formatAxisToken(yAxis)}`,
        modelId: model.id,
        xAxisIndex,
        yAxisIndex,
      }
    })
  )
}

export function getPreferredColorModelPlane(
  model: ColorModelDefinition
): ColorModelPlane {
  const plane = getColorModelPlanes(model)[0]

  if (!plane) {
    throw new RangeError(`Missing coordinate plane for ${model.id}`)
  }

  return plane
}

export function getColorModelPlaneById({
  model,
  planeId,
}: {
  readonly model: ColorModelDefinition
  readonly planeId: string
}): ColorModelPlane {
  const planes = getColorModelPlanes(model)
  const selectedPlane = planes.find((plane) => plane.id === planeId)
  const fallbackPlane = planes[0]

  if (selectedPlane) {
    return selectedPlane
  }

  if (!fallbackPlane) {
    throw new RangeError(`Missing coordinate plane for ${model.id}`)
  }

  return fallbackPlane
}

export function setModelPlaneValues({
  model,
  plane,
  values,
  xRatio,
  yRatio,
}: {
  readonly model: ColorModelDefinition
  readonly plane: ColorModelPlane
  readonly values: readonly number[]
  readonly xRatio: number
  readonly yRatio: number
}): readonly number[] {
  assertPlaneModel(model, plane)

  const xAxis = requireModelAxis(model, plane.xAxisIndex)
  const yAxis = requireModelAxis(model, plane.yAxisIndex)
  const withX = setModelAxisValue({
    axisIndex: plane.xAxisIndex,
    value: getModelAxisValueFromRatio({ axis: xAxis, ratio: xRatio }),
    values,
  })

  return setModelAxisValue({
    axisIndex: plane.yAxisIndex,
    value: getModelAxisValueFromRatio({ axis: yAxis, ratio: 1 - yRatio }),
    values: withX,
  })
}

export function getModelPlaneMarkerPosition({
  model,
  plane,
  values,
}: {
  readonly model: ColorModelDefinition
  readonly plane: ColorModelPlane
  readonly values: readonly number[]
}): PlaneMarkerPosition {
  assertPlaneModel(model, plane)

  const xAxis = requireModelAxis(model, plane.xAxisIndex)
  const yAxis = requireModelAxis(model, plane.yAxisIndex)
  const xValue = getModelAxisValue({
    axis: xAxis,
    axisIndex: plane.xAxisIndex,
    values,
  })
  const yValue = getModelAxisValue({
    axis: yAxis,
    axisIndex: plane.yAxisIndex,
    values,
  })

  return {
    x: getModelAxisRatio({ axis: xAxis, value: xValue }),
    y: 1 - getModelAxisRatio({ axis: yAxis, value: yValue }),
  }
}

function getFixedAxisIndices({
  axisCount,
  xAxisIndex,
  yAxisIndex,
}: {
  readonly axisCount: number
  readonly xAxisIndex: number
  readonly yAxisIndex: number
}): readonly number[] {
  return Array.from({ length: axisCount }, (_, axisIndex) => axisIndex).filter(
    (axisIndex) => axisIndex !== xAxisIndex && axisIndex !== yAxisIndex
  )
}

function assertPlaneModel(
  model: ColorModelDefinition,
  plane: ColorModelPlane
): void {
  if (plane.modelId !== model.id) {
    throw new RangeError(`Plane ${plane.id} does not belong to ${model.id}`)
  }
}

function formatAxisToken(axis: ColorModelAxis): string {
  return axis.id.toUpperCase()
}
