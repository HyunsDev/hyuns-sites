import assert from "node:assert/strict"
import test from "node:test"

import { getColorModelDefinition } from "./arduino-rgb-models.ts"
import {
  getColorModelPlanes,
  getModelPlaneMarkerPosition,
  setModelPlaneValues,
} from "./arduino-rgb-plane-models.ts"
import { getModelAxisValueFromRatio } from "./arduino-rgb-axis-values.ts"
import type { ColorModelPlane } from "./arduino-rgb-plane-models.ts"

test("getColorModelPlanes creates every two-axis surface for RGB", () => {
  const model = getColorModelDefinition("rgb")
  const planes = getColorModelPlanes(model)

  assert.deepEqual(
    planes.map((plane) => ({
      fixedAxisIndices: plane.fixedAxisIndices,
      label: plane.label,
      xAxisIndex: plane.xAxisIndex,
      yAxisIndex: plane.yAxisIndex,
    })),
    [
      { label: "R x G", xAxisIndex: 0, yAxisIndex: 1, fixedAxisIndices: [2] },
      { label: "R x B", xAxisIndex: 0, yAxisIndex: 2, fixedAxisIndices: [1] },
      { label: "G x B", xAxisIndex: 1, yAxisIndex: 2, fixedAxisIndices: [0] },
    ]
  )
})

test("setModelPlaneValues maps pointer ratios onto plane axes", () => {
  const model = getColorModelDefinition("rgb")
  const plane = requirePlane(getColorModelPlanes(model), 0)

  assert.deepEqual(
    setModelPlaneValues({
      model,
      plane,
      values: [10, 20, 30],
      xRatio: 1,
      yRatio: 0,
    }),
    [255, 255, 30]
  )
})

test("getModelAxisValueFromRatio respects decimal axis steps", () => {
  const model = getColorModelDefinition("oklch")
  const chromaAxis = model.axes[1]

  if (!chromaAxis) {
    throw new RangeError("Missing OKLCH chroma axis")
  }

  assert.equal(
    getModelAxisValueFromRatio({ axis: chromaAxis, ratio: 0.5 }),
    0.2
  )
})

test("getModelPlaneMarkerPosition returns normalized plane coordinates", () => {
  const model = getColorModelDefinition("hsl")
  const plane = requirePlane(getColorModelPlanes(model), 0)
  const marker = getModelPlaneMarkerPosition({
    model,
    plane,
    values: [180, 50, 58],
  })

  assert.equal(marker.x, 0.5)
  assert.equal(marker.y, 0.5)
})

function requirePlane(
  planes: readonly ColorModelPlane[],
  index: number
): ColorModelPlane {
  const plane = planes[index]

  if (!plane) {
    throw new RangeError(`Missing color model plane at index ${index}`)
  }

  return plane
}
