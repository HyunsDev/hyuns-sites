import assert from "node:assert/strict"
import test from "node:test"

import {
  COLOR_MODEL_DECISION_ROWS,
  createGradientComparisonRows,
  createHslOklchPaletteComparisonRows,
  createOklchLightnessScale,
  createOklchPaletteScale,
  createStateColorRelations,
  createThemeLightnessRows,
} from "./presentation-oklch-practice-models.ts"

test("createHslOklchPaletteComparisonRows compares HSL and OKLCH rows", () => {
  const rows = createHslOklchPaletteComparisonRows()

  assert.deepEqual(
    rows.map((row) => row.id),
    ["hsl", "oklch"]
  )
  assert.equal(rows[0]?.swatches.length, 10)
  assert.equal(rows[1]?.swatches.at(-1)?.label, "900")
})

test("createOklchLightnessScale returns token-like lightness stops", () => {
  const scale = createOklchLightnessScale()

  assert.deepEqual(
    scale.map((swatch) => swatch.label),
    ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
  )
  assert.ok((scale[0]?.lightness ?? 0) > (scale.at(-1)?.lightness ?? 0))
})

test("createOklchPaletteScale derives hue and chroma from a CSS color", () => {
  const result = createOklchPaletteScale("oklch(70% 0.18 32)")

  assert.equal(result.status, "parsed")
  assert.equal(result.swatches.length, 10)
  assert.ok(result.swatches.some((swatch) => swatch.css.startsWith("oklch(")))
})

test("createStateColorRelations keeps state colors tied to a base color", () => {
  const result = createStateColorRelations("oklch(70% 0.18 32)")

  assert.deepEqual(
    result.rows.map((row) => row.id),
    ["base", "hover", "active", "disabled"]
  )
  assert.match(result.cssExample, /color-mix\(in oklch/)
})

test("createThemeLightnessRows returns light and dark role maps", () => {
  const rows = createThemeLightnessRows()

  assert.deepEqual(
    rows.map((row) => row.id),
    ["light", "dark"]
  )
  assert.equal(rows[0]?.tokens.length, 5)
  assert.notEqual(rows[0]?.tokens[0]?.lightness, rows[1]?.tokens[0]?.lightness)
})

test("createGradientComparisonRows returns RGB HSL and OKLCH interpolation", () => {
  const rows = createGradientComparisonRows()

  assert.deepEqual(
    rows.map((row) => row.label),
    ["RGB", "HSL", "OKLCH"]
  )
  assert.equal(rows[2]?.swatches.length, 7)
})

test("COLOR_MODEL_DECISION_ROWS closes the talk with three tool choices", () => {
  assert.deepEqual(
    COLOR_MODEL_DECISION_ROWS.map((row) => row.model),
    ["RGB", "HSL/HSV", "OKLCH"]
  )
})
