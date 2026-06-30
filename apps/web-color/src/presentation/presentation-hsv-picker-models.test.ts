import assert from "node:assert/strict"
import test from "node:test"

import {
  createDefaultColorPickerCoordinate,
  parseColorPickerColorInput,
} from "./presentation-hsv-picker-models.ts"

test("createDefaultColorPickerCoordinate returns an HSV coordinate", () => {
  assert.deepEqual(createDefaultColorPickerCoordinate("hsv"), {
    modelId: "hsv",
    h: 24,
    s: 90,
    v: 100,
  })
})

test("createDefaultColorPickerCoordinate returns an HSL coordinate", () => {
  assert.deepEqual(createDefaultColorPickerCoordinate("hsl"), {
    modelId: "hsl",
    h: 24,
    s: 90,
    l: 58,
  })
})

test("parseColorPickerColorInput converts CSS colors to HSV coordinates", () => {
  assert.deepEqual(parseColorPickerColorInput("rgb(255 0 0)", "hsv", 24), {
    modelId: "hsv",
    h: 0,
    s: 100,
    v: 100,
  })
})

test("parseColorPickerColorInput converts CSS colors to HSL coordinates", () => {
  assert.deepEqual(parseColorPickerColorInput("rgb(255 0 0)", "hsl", 24), {
    modelId: "hsl",
    h: 0,
    s: 100,
    l: 50,
  })
})

test("parseColorPickerColorInput preserves fallback hue for HSV achromatic colors", () => {
  assert.deepEqual(parseColorPickerColorInput("rgb(128 128 128)", "hsv", 24), {
    modelId: "hsv",
    h: 24,
    s: 0,
    v: 128 / 255 * 100,
  })
})

test("parseColorPickerColorInput preserves fallback hue for HSL achromatic colors", () => {
  assert.deepEqual(parseColorPickerColorInput("rgb(128 128 128)", "hsl", 24), {
    modelId: "hsl",
    h: 24,
    s: 0,
    l: 128 / 255 * 100,
  })
})

test("parseColorPickerColorInput ignores invalid CSS colors", () => {
  assert.equal(parseColorPickerColorInput("not-a-color", "hsv", 24), null)
})
