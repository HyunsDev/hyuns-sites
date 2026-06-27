import type {
  ColorModelAxis,
  ColorModelDefinition,
} from "./arduino-rgb-models.ts"

export function getModelAxisValue({
  axis,
  axisIndex,
  values,
}: {
  readonly axis: ColorModelAxis
  readonly axisIndex: number
  readonly values: readonly number[]
}): number {
  return values[axisIndex] ?? axis.min
}

export function getModelAxisRatio({
  axis,
  value,
}: {
  readonly axis: ColorModelAxis
  readonly value: number
}): number {
  return clampRatio((value - axis.min) / (axis.max - axis.min))
}

export function getModelAxisValueFromRatio({
  axis,
  ratio,
}: {
  readonly axis: ColorModelAxis
  readonly ratio: number
}): number {
  const rawValue = axis.min + (axis.max - axis.min) * clampRatio(ratio)

  return clampAxisValue(axis, roundToStep(rawValue, axis.step))
}

export function setModelAxisValueFromRatio({
  axisIndex,
  model,
  ratio,
  values,
}: {
  readonly axisIndex: number
  readonly model: ColorModelDefinition
  readonly ratio: number
  readonly values: readonly number[]
}): readonly number[] {
  const axis = requireModelAxis(model, axisIndex)

  return setModelAxisValue({
    axisIndex,
    value: getModelAxisValueFromRatio({ axis, ratio }),
    values,
  })
}

export function nudgeModelAxisValue({
  axisIndex,
  direction,
  model,
  values,
}: {
  readonly axisIndex: number
  readonly direction: number
  readonly model: ColorModelDefinition
  readonly values: readonly number[]
}): readonly number[] {
  const axis = requireModelAxis(model, axisIndex)
  const currentValue = getModelAxisValue({ axis, axisIndex, values })
  const nextValue = clampAxisValue(axis, currentValue + axis.step * direction)

  return setModelAxisValue({ axisIndex, value: nextValue, values })
}

export function requireModelAxis(
  model: ColorModelDefinition,
  axisIndex: number
): ColorModelAxis {
  const axis = model.axes[axisIndex]

  if (!axis) {
    throw new RangeError(`Missing axis ${axisIndex} for ${model.id}`)
  }

  return axis
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

function clampAxisValue(axis: ColorModelAxis, value: number): number {
  return Math.min(axis.max, Math.max(axis.min, value))
}

function clampRatio(ratio: number): number {
  if (!Number.isFinite(ratio)) {
    return 0
  }

  return Math.min(1, Math.max(0, ratio))
}

function roundToStep(value: number, step: number): number {
  if (step <= 0) {
    return value
  }

  const steppedValue = Math.round(value / step) * step

  return Number(steppedValue.toFixed(getDecimalPlaces(step)))
}

function getDecimalPlaces(value: number): number {
  const decimalPart = String(value).split(".")[1]

  return decimalPart?.length ?? 0
}
