import assert from "node:assert/strict"
import test from "node:test"

import {
  getColorNotationInputState,
  type ColorNotationInputState,
} from "./color-notation-input-models.ts"

function getParsedSwatchColor(result: ColorNotationInputState): string {
  assert.equal(result.status, "parsed")

  if (result.status !== "parsed") {
    throw new Error("Expected parsed color notation input state")
  }

  return result.swatchColor
}

test("getColorNotationInputState returns a hex swatch for CSS rgb notation", () => {
  const result = getColorNotationInputState("rgb(255, 255, 255)")

  assert.equal(getParsedSwatchColor(result), "#ffffff")
})

test("getColorNotationInputState accepts modern CSS color notation", () => {
  const result = getColorNotationInputState("oklch(70% 0.18 32)")

  assert.equal(result.status, "parsed")
})

test("getColorNotationInputState reports invalid CSS color input", () => {
  const result = getColorNotationInputState("not-a-color")

  assert.deepEqual(result, { status: "invalid" })
})
