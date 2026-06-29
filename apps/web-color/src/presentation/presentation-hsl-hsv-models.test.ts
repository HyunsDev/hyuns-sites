import assert from "node:assert/strict"
import test from "node:test"

import {
  createHslLightnessTrapSwatches,
  createHsvAxisPaletteRows,
  requirePresentationPlane,
} from "./presentation-hsl-hsv-models.ts"

test("createHsvAxisPaletteRows returns three ten-step palette rows", () => {
  const rows = createHsvAxisPaletteRows()

  assert.equal(rows.length, 3)

  for (const row of rows) {
    assert.equal(row.swatches.length, 10)
  }
})

test("createHsvAxisPaletteRows changes only one HSV axis per row", () => {
  const rows = createHsvAxisPaletteRows()
  const hueRow = rows.find((row) => row.axisId === "h")
  const saturationRow = rows.find((row) => row.axisId === "s")
  const valueRow = rows.find((row) => row.axisId === "v")

  assert.ok(hueRow)
  assert.ok(saturationRow)
  assert.ok(valueRow)

  if (!hueRow || !saturationRow || !valueRow) {
    throw new Error("Expected HSV palette rows")
  }

  assert.deepEqual(
    hueRow.swatches.map((swatch) => swatch.coordinate),
    hueRow.swatches.map((swatch) => ({
      ...swatch.coordinate,
      h: swatch.coordinate.h,
      s: 90,
      v: 100,
    }))
  )
  assert.equal(saturationRow.swatches[0]?.coordinate.h, 24)
  assert.equal(saturationRow.swatches[0]?.coordinate.v, 100)
  assert.equal(valueRow.swatches[0]?.coordinate.h, 24)
  assert.equal(valueRow.swatches[0]?.coordinate.s, 90)
})

test("createHslLightnessTrapSwatches keeps HSL lightness fixed at 50", () => {
  const swatches = createHslLightnessTrapSwatches()

  assert.equal(swatches.length, 4)

  for (const swatch of swatches) {
    assert.equal(swatch.coordinate.modelId, "hsl")
    assert.equal(swatch.coordinate.l, 50)
  }
})

test("requirePresentationPlane returns the requested HSL and HSV planes", () => {
  assert.equal(requirePresentationPlane("hsl", "s", "l").label, "S x L")
  assert.equal(requirePresentationPlane("hsv", "s", "v").label, "S x V")
})
