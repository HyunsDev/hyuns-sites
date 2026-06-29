import assert from "node:assert/strict"
import test from "node:test"

import {
  createSrgbP3CompareResult,
  parseSrgbP3CompareInput,
} from "./srgb-p3-compare-models.ts"
import type { SrgbP3CodeRow } from "./srgb-p3-compare-models.ts"

function parseColor(input: string) {
  const parsed = parseSrgbP3CompareInput(input)

  if (parsed.status === "invalid") {
    assert.fail(`Expected valid CSS color: ${input}`)
  }

  return parsed.color
}

function requireRow(
  rows: readonly SrgbP3CodeRow[],
  id: string
): SrgbP3CodeRow {
  const row = rows.find((candidate) => candidate.id === id)

  assert.ok(row)

  return row
}

test("parseSrgbP3CompareInput rejects invalid CSS colors", () => {
  assert.deepEqual(parseSrgbP3CompareInput("not a color"), {
    status: "invalid",
  })
})

test("createSrgbP3CompareResult marks sRGB colors inside both gamuts", () => {
  const result = createSrgbP3CompareResult(parseColor("#ff5a3d"))

  assert.equal(result.inSrgb, true)
  assert.equal(result.inDisplayP3, true)
  assert.equal(result.status, "srgb")
  assert.equal(requireRow(result.srgbRows, "hex").value, "#ff5a3d")
  assert.match(requireRow(result.displayP3Rows, "display-p3").value, /^color\(display-p3 /)
})

test("createSrgbP3CompareResult keeps Display P3 syntax available", () => {
  const result = createSrgbP3CompareResult(
    parseColor("color(display-p3 1 0.45 0.12)")
  )

  assert.match(requireRow(result.displayP3Rows, "display-p3").value, /^color\(display-p3 /)
  assert.match(requireRow(result.displayP3Rows, "rgb-fallback").value, /^rgb\(/)
})

test("createSrgbP3CompareResult exposes P3-only fallback colors", () => {
  const result = createSrgbP3CompareResult(parseColor("color(display-p3 1 0 0)"))

  assert.equal(result.inSrgb, false)
  assert.equal(result.inDisplayP3, true)
  assert.equal(result.status, "p3-only")
  assert.equal(result.statusLabel, "P3 only")
  assert.equal(result.swatches.map((swatch) => swatch.id).join(","), "original,srgb-clipped,srgb-mapped")
  assert.doesNotMatch(result.swatches[1]?.css ?? "", /-0/)
  assert.match(requireRow(result.srgbRows, "color-srgb").value, /^color\(srgb /)
})
