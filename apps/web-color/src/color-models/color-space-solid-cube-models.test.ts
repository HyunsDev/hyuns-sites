import assert from "node:assert/strict"
import test from "node:test"

import {
  getSolidHueCubeModelId,
  resolveSolidHueCubeModelId,
} from "./color-space-solid-cube-models.ts"

test("getSolidHueCubeModelId maps supported base models to cube models", () => {
  assert.equal(getSolidHueCubeModelId("hsl"), "hsl-cube")
  assert.equal(getSolidHueCubeModelId("hsv"), "hsv-cube")
  assert.equal(getSolidHueCubeModelId("lch"), "lch-cube")
  assert.equal(getSolidHueCubeModelId("oklch"), "oklch-cube")
})

test("getSolidHueCubeModelId excludes unsupported solid models", () => {
  assert.equal(getSolidHueCubeModelId("rgb"), null)
  assert.equal(getSolidHueCubeModelId("hwb"), null)
})

test("resolveSolidHueCubeModelId switches only supported models to cube form", () => {
  assert.equal(resolveSolidHueCubeModelId("hsl", true), "hsl-cube")
  assert.equal(resolveSolidHueCubeModelId("hsv", false), "hsv")
  assert.equal(resolveSolidHueCubeModelId("rgb", true), "rgb")
})
