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
  const displayP3Row = rows.find((row) => row.targetId === "display-p3")
  const rec2020Row = rows.find((row) => row.targetId === "rec2020")

  assert.equal(rows.length, 3)
  assert.ok(srgbRow)
  assert.ok(displayP3Row)
  assert.ok(rec2020Row)

  if (!srgbRow || !displayP3Row || !rec2020Row) {
    throw new Error("Expected all gamut rows")
  }

  assert.equal(srgbRow.swatches.length, 12)
  assert.ok(srgbRow.swatches.some((swatch) => !swatch.inTarget))
  assert.equal(srgbRow.edgeLabel, "edge 0.20")
  assert.equal(displayP3Row.edgeLabel, "edge 0.28")
  assert.equal(rec2020Row.edgeLabel, "edge 0.36")
  assert.ok(
    srgbRow.swatches.some(
      (swatch) => swatch.requestedColor !== swatch.renderedColor
    )
  )
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

test("createLabToOklabComparisonRows marks the middle path comparison", () => {
  const rows = createLabToOklabComparisonRows()
  const labRow = rows.find((row) => row.label === "Lab")
  const oklchRow = rows.find((row) => row.label === "OKLCH")

  assert.ok(labRow)
  assert.ok(oklchRow)

  if (!labRow || !oklchRow) {
    throw new Error("Expected Lab and OKLCH comparison rows")
  }

  assert.equal(labRow.note, "muted midpoint")
  assert.equal(oklchRow.note, "clearer chroma path")
  assert.equal(labRow.swatches[3]?.emphasisLabel, "muted middle")
  assert.equal(oklchRow.swatches[3]?.emphasisLabel, "cleaner middle")
  assert.ok(labRow.swatches.every((swatch) => swatch.inSrgb))
  assert.ok(oklchRow.swatches.every((swatch) => swatch.inSrgb))
})
