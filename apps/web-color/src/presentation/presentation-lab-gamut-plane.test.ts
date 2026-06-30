import assert from "node:assert/strict"
import test from "node:test"

import {
  createLabGamutPlane,
  getLabGamutPlaneCell,
} from "./presentation-lab-gamut-plane.ts"

test("createLabGamutPlane samples the L*=50 sRGB section", () => {
  const plane = createLabGamutPlane({
    axisLimit: 120,
    lightness: 50,
    size: 49,
  })

  assert.equal(plane.lightness, 50)
  assert.equal(plane.size, 49)
  assert.equal(plane.cells.length, 49 * 49)
  assert.ok(plane.cells.some((cell) => cell.inSrgb))
  assert.ok(plane.cells.some((cell) => !cell.inSrgb))
  assert.ok(plane.cells.some((cell) => cell.isBoundary))
})

test("getLabGamutPlaneCell maps neutral gray inside sRGB", () => {
  const cell = getLabGamutPlaneCell({
    a: 0,
    b: 0,
    lightness: 50,
  })

  assert.equal(cell.inSrgb, true)
  assert.equal(cell.color, "#777777")
})

test("getLabGamutPlaneCell marks extreme Lab coordinates outside sRGB", () => {
  const cell = getLabGamutPlaneCell({
    a: 120,
    b: 120,
    lightness: 50,
  })

  assert.equal(cell.inSrgb, false)
  assert.equal(cell.color, null)
})
