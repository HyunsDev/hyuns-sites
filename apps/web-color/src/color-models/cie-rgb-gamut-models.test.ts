import assert from "node:assert/strict"
import test from "node:test"

import { CIE_D65_WHITE, CIE_XYZ_GAMUTS } from "./cie-xyz-gamut-data.ts"
import {
  createCieRgbGamutComparison,
  parseCieRgbInput,
} from "./cie-rgb-gamut-models.ts"
import type { CieRgbGamutPoint } from "./cie-rgb-gamut-models.ts"

function requireParsedComparison(
  fields: Parameters<typeof createCieRgbGamutComparison>[0]
) {
  const result = createCieRgbGamutComparison(fields)

  if (result.status === "invalid") {
    assert.fail(result.message)
  }

  return result
}

function requirePoint(
  points: readonly CieRgbGamutPoint[],
  targetId: CieRgbGamutPoint["targetId"]
) {
  const point = points.find((candidate) => candidate.targetId === targetId)

  assert.ok(point)

  return point
}

function assertClose(actual: number, expected: number) {
  assert.ok(
    Math.abs(actual - expected) < 0.000001,
    `expected ${actual} to be close to ${expected}`
  )
}

function assertChromaticity(
  point: CieRgbGamutPoint,
  expected: NonNullable<CieRgbGamutPoint["chromaticity"]>
) {
  assert.ok(point.chromaticity)
  assertClose(point.chromaticity.x, expected.x)
  assertClose(point.chromaticity.y, expected.y)
}

test("createCieRgbGamutComparison maps red RGB codes to each red primary", () => {
  const result = requireParsedComparison({ b: "0", g: "0", r: "255" })

  CIE_XYZ_GAMUTS.forEach((gamut) => {
    assertChromaticity(requirePoint(result.points, gamut.id), gamut.primaries.red)
  })
})

test("createCieRgbGamutComparison exposes color-space preview colors", () => {
  const result = requireParsedComparison({ b: "0", g: "0", r: "255" })

  assert.equal(requirePoint(result.points, "srgb").previewColor, "rgb(255 0 0)")
  assert.equal(
    requirePoint(result.points, "display-p3").previewColor,
    "color(display-p3 1 0 0)"
  )
  assert.equal(
    requirePoint(result.points, "bt2020").previewColor,
    "color(rec2020 1 0 0)"
  )
})

test("createCieRgbGamutComparison maps green RGB codes to each green primary", () => {
  const result = requireParsedComparison({ b: "0", g: "255", r: "0" })

  CIE_XYZ_GAMUTS.forEach((gamut) => {
    assertChromaticity(
      requirePoint(result.points, gamut.id),
      gamut.primaries.green
    )
  })
})

test("createCieRgbGamutComparison maps blue RGB codes to each blue primary", () => {
  const result = requireParsedComparison({ b: "255", g: "0", r: "0" })

  CIE_XYZ_GAMUTS.forEach((gamut) => {
    assertChromaticity(requirePoint(result.points, gamut.id), gamut.primaries.blue)
  })
})

test("createCieRgbGamutComparison maps white RGB codes to D65", () => {
  const result = requireParsedComparison({ b: "255", g: "255", r: "255" })

  result.points.forEach((point) => {
    assertChromaticity(point, CIE_D65_WHITE)
  })
})

test("parseCieRgbInput rejects non-integer and out-of-range channels", () => {
  assert.equal(parseCieRgbInput({ b: "0", g: "0", r: "255.2" }).status, "invalid")
  assert.equal(parseCieRgbInput({ b: "-1", g: "0", r: "255" }).status, "invalid")
  assert.equal(parseCieRgbInput({ b: "blue", g: "0", r: "255" }).status, "invalid")
})
