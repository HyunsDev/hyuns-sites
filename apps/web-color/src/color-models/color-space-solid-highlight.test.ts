import assert from "node:assert/strict"
import test from "node:test"

import { createColorSampleRenderOptions } from "./color-sample-rendering.ts"
import { createSolidColorSpaceHighlight } from "./color-space-solid-highlight.ts"

const renderOptions = createColorSampleRenderOptions("srgb", "srgb")

test("solid highlight creates an OKLCH point for a fully specified CSS color", () => {
  const result = createSolidColorSpaceHighlight({
    modelId: "oklch",
    options: renderOptions,
    value: "oklch(70% 0.18 32)",
  })

  assert.equal(result.status, "ready")
  assert.equal(result.highlight.kind, "point")

  if (result.highlight.kind !== "point") {
    throw new TypeError("Expected point highlight")
  }

  assert.equal(result.highlight.freeChannels.length, 0)
  assert.equal(Math.round(result.highlight.position.y * 1000) / 1000, 0.4)
})

test("solid highlight maps OKLCH cube chroma to the vertical axis", () => {
  const result = createSolidColorSpaceHighlight({
    modelId: "oklch-cube",
    options: renderOptions,
    value: "oklch(70% 0.24 32)",
  })

  assert.equal(result.status, "ready")
  assert.equal(result.highlight.kind, "point")

  if (result.highlight.kind !== "point") {
    throw new TypeError("Expected point highlight")
  }

  assert.equal(result.highlight.position.y, 0)
  assert.equal(Math.round(result.highlight.position.z * 1000) / 1000, 0.4)
})

test("solid highlight treats CSS none channels as free OKLCH axes", () => {
  const lineResult = createSolidColorSpaceHighlight({
    modelId: "oklch",
    options: renderOptions,
    value: "oklch(70% none 32)",
  })
  const surfaceResult = createSolidColorSpaceHighlight({
    modelId: "oklch",
    options: renderOptions,
    value: "oklch(70% none none)",
  })

  assert.equal(lineResult.status, "ready")
  assert.equal(lineResult.highlight.kind, "line")
  assert.deepEqual(lineResult.highlight.freeChannels, ["c"])
  assert.equal(surfaceResult.status, "ready")
  assert.equal(surfaceResult.highlight.kind, "surface")
  assert.deepEqual(surfaceResult.highlight.freeChannels, ["c", "h"])
})

test("solid highlight keeps partial CSS colors in the matching model family", () => {
  const rgbResult = createSolidColorSpaceHighlight({
    modelId: "rgb",
    options: renderOptions,
    value: "rgb(255 none 0)",
  })
  const oklchResult = createSolidColorSpaceHighlight({
    modelId: "oklch",
    options: renderOptions,
    value: "rgb(255 none 0)",
  })

  assert.equal(rgbResult.status, "ready")
  assert.equal(rgbResult.highlight.kind, "line")
  assert.deepEqual(rgbResult.highlight.freeChannels, ["g"])
  assert.equal(oklchResult.status, "unsupported")
})
