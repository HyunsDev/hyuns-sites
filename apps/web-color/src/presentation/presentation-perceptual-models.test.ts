import assert from "node:assert/strict"
import test from "node:test"

import {
  createGamutChromaRows,
  createLabToOklabComparisonRows,
  PART_1_PURPOSE_STEPS,
  PERCEPTUAL_MODEL_STEPS,
} from "./presentation-perceptual-models.ts"

test("PART_1_PURPOSE_STEPS keeps the four-part color model map", () => {
  assert.deepEqual(
    PART_1_PURPOSE_STEPS.map((step) => step.label),
    ["RGB", "HSL/HSV", "Lab/LCH", "Oklab/OKLCH"]
  )
})

test("PERCEPTUAL_MODEL_STEPS introduces Lab before OKLCH", () => {
  assert.deepEqual(
    PERCEPTUAL_MODEL_STEPS.map((step) => step.label),
    ["RGB/HSL", "Lab/LCH", "Oklab/OKLCH"]
  )
})

test("createGamutChromaRows includes out-of-gamut swatches for sRGB", () => {
  const rows = createGamutChromaRows()
  const srgbRow = rows.find((row) => row.targetId === "srgb")

  assert.equal(rows.length, 3)
  assert.ok(srgbRow)

  if (!srgbRow) {
    throw new Error("Expected sRGB gamut row")
  }

  assert.equal(srgbRow.swatches.length, 12)
  assert.ok(srgbRow.swatches.some((swatch) => !swatch.inTarget))
})

test("createLabToOklabComparisonRows returns equal-length comparison rows", () => {
  const rows = createLabToOklabComparisonRows()

  assert.deepEqual(
    rows.map((row) => row.label),
    ["Lab", "OKLCH"]
  )

  for (const row of rows) {
    assert.equal(row.swatches.length, 7)
  }
})
