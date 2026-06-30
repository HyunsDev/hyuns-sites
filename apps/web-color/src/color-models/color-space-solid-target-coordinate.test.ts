import assert from "node:assert/strict"
import test from "node:test"

import {
  createSolidTargetCoordinate,
  formatSolidTargetCoordinate,
  getSolidTargetCoordinateModelId,
} from "./color-space-solid-target-coordinate.ts"

test("solid target coordinates map hue cubes to editable base coordinates", () => {
  assert.equal(getSolidTargetCoordinateModelId("oklch-cube"), "oklch")
  assert.equal(getSolidTargetCoordinateModelId("xyy"), null)
})

test("solid target coordinates parse CSS colors for axis bars", () => {
  const result = createSolidTargetCoordinate({
    modelId: "oklch",
    value: "oklch(70% 0.18 32)",
  })

  assert.equal(result.status, "ready")
  if (result.status !== "ready") {
    return
  }

  assert.equal(result.modelId, "oklch")
  assert.equal(result.coordinate.modelId, "oklch")
  assert.equal(result.coordinate.l, 70)
  assert.equal(result.coordinate.c, 0.18)
})

test("solid target coordinate formatting returns CSS model notation", () => {
  assert.match(
    formatSolidTargetCoordinate({
      modelId: "lab",
      l: 62,
      a: 42,
      b: 58,
    }),
    /^lab\(62% 42 58\)$/
  )
  assert.match(
    formatSolidTargetCoordinate({
      modelId: "hsv",
      h: 24,
      s: 90,
      v: 100,
    }),
    /^rgb\(/
  )
})
