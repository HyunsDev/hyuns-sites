import assert from "node:assert/strict"
import test from "node:test"

import {
  createDefaultSolidSliceState,
  getSolidSliceAxes,
  isSolidSliceModel,
} from "./color-space-solid-slice-models.ts"
import {
  createSolidSliceCoordinate,
  getSolidSliceCoordinateModelId,
  toSolidSliceValue,
} from "./color-space-solid-slice-coordinate.ts"

test("solid slice support includes Lab axes", () => {
  assert.equal(isSolidSliceModel("lab"), true)
  assert.deepEqual(
    getSolidSliceAxes("lab").map((axis) => axis.id),
    ["l", "a", "b"]
  )
  assert.deepEqual(createDefaultSolidSliceState("lab"), {
    axisId: "b",
    value: 0,
  })
})

test("solid slice axes expose presentation coordinate labels", () => {
  assert.deepEqual(
    getSolidSliceAxes("rgb").map((axis) => [
      axis.coordinateLabel,
      axis.label,
      axis.color,
    ]),
    [
      ["X axis", "Red", "#ef4444"],
      ["Y axis", "Green", "#22c55e"],
      ["Z axis", "Blue", "#3b82f6"],
    ]
  )
  assert.deepEqual(
    getSolidSliceAxes("hsl").map((axis) => [
      axis.coordinateLabel,
      axis.label,
      axis.color,
    ]),
    [
      ["Angle", "Hue", "#f59e0b"],
      ["Radius", "Saturation", "#06b6d4"],
      ["Vertical axis", "Lightness", "#64748b"],
    ]
  )
  assert.deepEqual(
    getSolidSliceAxes("lch").map((axis) => [
      axis.coordinateLabel,
      axis.label,
      axis.color,
    ]),
    [
      ["Angle", "Hue", "#f59e0b"],
      ["Radius", "Chroma", "#10b981"],
      ["Vertical axis", "Lightness", "#64748b"],
    ]
  )
  assert.deepEqual(
    getSolidSliceAxes("lch-cube").map((axis) => [
      axis.coordinateLabel,
      axis.label,
      axis.color,
    ]),
    [
      ["X axis", "Hue", "#f59e0b"],
      ["Z axis", "Chroma", "#10b981"],
      ["Y axis", "Lightness", "#64748b"],
    ]
  )
})

test("solid slice coordinates adapt normalized slice values to axis bars", () => {
  assert.equal(getSolidSliceCoordinateModelId("hsl-cube"), "hsl")
  assert.deepEqual(
    createSolidSliceCoordinate({
      modelId: "rgb",
      axisId: "r",
      value: 0.5,
    }),
    {
      modelId: "rgb",
      r: 127.5,
      g: 127.5,
      b: 127.5,
    }
  )

  const lightnessAxis = getSolidSliceAxes("oklch")[2]

  assert.ok(lightnessAxis)
  assert.equal(toSolidSliceValue(lightnessAxis, 70), 0.7)
})
