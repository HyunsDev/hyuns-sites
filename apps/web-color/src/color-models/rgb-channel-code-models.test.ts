import assert from "node:assert/strict"
import test from "node:test"

import {
  createRgbChannelCodeResult,
  parseRgbChannelInput,
} from "./rgb-channel-code-models.ts"

function parseInput(input: string) {
  const parsed = parseRgbChannelInput(input)

  if (parsed.status === "invalid") {
    assert.fail(`Expected valid RGB channel input: ${input}`)
  }

  return parsed
}

test("parseRgbChannelInput accepts 255 channel triplets", () => {
  assert.deepEqual(parseRgbChannelInput("255 0 12"), {
    channels: { r: 255, g: 0, b: 12 },
    inputType: "triplet",
    status: "parsed",
  })
})

test("parseRgbChannelInput accepts hex colors", () => {
  assert.deepEqual(parseRgbChannelInput("#f03"), {
    channels: { r: 255, g: 0, b: 51 },
    inputType: "hex",
    status: "parsed",
  })
})

test("parseRgbChannelInput rejects invalid channels", () => {
  assert.deepEqual(parseRgbChannelInput("256 0 0"), { status: "invalid" })
  assert.deepEqual(parseRgbChannelInput("255 0"), { status: "invalid" })
  assert.deepEqual(parseRgbChannelInput("#ff00zz"), { status: "invalid" })
})

test("createRgbChannelCodeResult returns CSS rows only", () => {
  const result = createRgbChannelCodeResult(parseInput("255 0 0"))
  const srgbRows = result.cards[0]?.rows ?? []
  const p3Rows = result.cards[1]?.rows ?? []

  assert.equal(result.hex, "#ff0000")
  assert.deepEqual(srgbRows, [
    { id: "css", label: "CSS", value: "color(srgb 1 0 0)" },
  ])
  assert.deepEqual(p3Rows, [
    { id: "css", label: "CSS", value: "color(display-p3 1 0 0)" },
  ])
})
