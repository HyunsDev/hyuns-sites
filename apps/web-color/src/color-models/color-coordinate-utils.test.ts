import assert from "node:assert/strict"
import test from "node:test"

import { formatCssColorSet } from "./color-css-format.ts"
import { samplePixel } from "./color-canvas-sampling.ts"
import { getColorGamutChecks } from "./color-gamut-analysis.ts"
import {
  getCoordinateAxisRatio,
  getCoordinatePlanes,
  getPlaneMarkerPosition,
  setCoordinateAxisFromRatio,
  setPlaneCoordinate,
} from "./color-coordinate-plane-models.ts"
import {
  createInterpolationRows,
  formatInterpolationStepPosition,
} from "./color-interpolation-models.ts"
import {
  createCssNotationRows,
  parseCssColorInput,
} from "./css-color-notation-models.ts"
import {
  createDefaultColorCoordinate,
  readColorCoordinateAxis,
  setColorCoordinateAxis,
  toCuloriColor,
} from "./color-coordinate-utils.ts"

test("toCuloriColor converts RGB 8-bit channels to unit RGB", () => {
  const color = toCuloriColor({ modelId: "rgb", r: 255, g: 128, b: 0 })

  assert.equal(color.mode, "rgb")
  if (color.mode !== "rgb") {
    return
  }

  assert.equal(color.r, 1)
  assert.equal(color.g, 128 / 255)
  assert.equal(color.b, 0)
})

test("createDefaultColorCoordinate returns model-shaped defaults", () => {
  assert.deepEqual(createDefaultColorCoordinate("oklch"), {
    modelId: "oklch",
    l: 70,
    c: 0.18,
    h: 32,
  })
  assert.deepEqual(createDefaultColorCoordinate("lab"), {
    modelId: "lab",
    l: 62,
    a: 42,
    b: 58,
  })
})

test("formatCssColorSet exposes core CSS notations", () => {
  const formats = formatCssColorSet({ mode: "rgb", r: 1, g: 0, b: 0 })

  assert.equal(formats.hex, "#ff0000")
  assert.match(formats.rgb, /rgb/)
  assert.match(formats.hsl, /hsl/)
  assert.match(formats.lab, /lab/)
  assert.match(formats.lch, /lch/)
  assert.match(formats.oklab, /oklab/)
  assert.match(formats.oklch, /oklch/)
  assert.match(formats.displayP3, /color\(display-p3/)
})

test("getColorGamutChecks reports sRGB red inside each device gamut", () => {
  const checks = getColorGamutChecks({ mode: "rgb", r: 1, g: 0, b: 0 })

  assert.deepEqual(
    checks.map((check) => [check.gamut, check.inGamut]),
    [
      ["rgb", true],
      ["p3", true],
      ["rec2020", true],
    ]
  )
})

test("samplePixel returns null outside bounds and channel data inside bounds", () => {
  const data = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255])

  assert.deepEqual(samplePixel({ data, width: 2, height: 1 }, 1, 0), {
    r: 0,
    g: 255,
    b: 0,
    a: 255,
  })
  assert.equal(samplePixel({ data, width: 2, height: 1 }, 2, 0), null)
})

test("setColorCoordinateAxis updates only valid channels for the model", () => {
  const coordinate = createDefaultColorCoordinate("hsl")

  assert.deepEqual(setColorCoordinateAxis(coordinate, "s", 42), {
    modelId: "hsl",
    h: 24,
    s: 42,
    l: 58,
  })
  assert.equal(readColorCoordinateAxis(coordinate, "r"), 0)
})

test("Lab and OKLab coordinates round-trip through axis helpers", () => {
  assert.deepEqual(setColorCoordinateAxis(createDefaultColorCoordinate("lab"), "a", -12), {
    modelId: "lab",
    l: 62,
    a: -12,
    b: 58,
  })
  assert.equal(
    readColorCoordinateAxis(createDefaultColorCoordinate("oklab"), "b"),
    0.14
  )
})

test("setPlaneCoordinate maps pointer ratios onto selected axes", () => {
  const coordinate = createDefaultColorCoordinate("rgb")
  const plane = getCoordinatePlanes("rgb")[0]

  assert.ok(plane)
  assert.deepEqual(setPlaneCoordinate(coordinate, plane, 0, 1), {
    modelId: "rgb",
    r: 0,
    g: 0,
    b: 64,
  })
})

test("getPlaneMarkerPosition normalizes selected coordinate axes", () => {
  const coordinate = { modelId: "rgb", r: 255, g: 0, b: 64 } as const
  const plane = getCoordinatePlanes("rgb")[0]

  assert.ok(plane)
  assert.deepEqual(getPlaneMarkerPosition(coordinate, plane), { x: 1, y: 1 })
})

test("coordinate axis bars map ratios onto the missing plane axis", () => {
  const coordinate = createDefaultColorCoordinate("rgb")

  assert.deepEqual(setCoordinateAxisFromRatio(coordinate, "rgb", "b", 1), {
    modelId: "rgb",
    r: 255,
    g: 96,
    b: 255,
  })
  assert.equal(
    getCoordinateAxisRatio(
      { modelId: "rgb", r: 255, g: 0, b: 128 },
      "rgb",
      "b"
    ),
    128 / 255
  )
})

test("createInterpolationRows samples every interpolation space", () => {
  const rows = createInterpolationRows({
    startColor: "#ff0000",
    endColor: "#0000ff",
    hueStrategyId: "shorter",
    stepCount: 5,
  })

  assert.deepEqual(
    rows.map((row) => row.id),
    ["rgb", "hsl", "lab", "lch", "oklch"]
  )
  assert.deepEqual(
    rows[0]?.steps.map((step) => step.position),
    [0, 0.25, 0.5, 0.75, 1]
  )
})

test("createInterpolationRows applies hue direction strategies", () => {
  const shorterRows = createInterpolationRows({
    startColor: "#ff0000",
    endColor: "#0000ff",
    hueStrategyId: "shorter",
    stepCount: 3,
  })
  const longerRows = createInterpolationRows({
    startColor: "#ff0000",
    endColor: "#0000ff",
    hueStrategyId: "longer",
    stepCount: 3,
  })

  const shorterHsl = shorterRows.find((row) => row.id === "hsl")
  const longerHsl = longerRows.find((row) => row.id === "hsl")

  assert.equal(shorterHsl?.steps[1]?.hex, "#ff00ff")
  assert.equal(longerHsl?.steps[1]?.hex, "#00ff00")
})

test("formatInterpolationStepPosition renders rounded percentages", () => {
  assert.equal(formatInterpolationStepPosition(0), "0%")
  assert.equal(formatInterpolationStepPosition(0.375), "38%")
  assert.equal(formatInterpolationStepPosition(1), "100%")
})

test("parseCssColorInput reports parsed and invalid CSS color input", () => {
  assert.equal(parseCssColorInput("oklch(70% 0.18 32)").status, "parsed")
  assert.equal(parseCssColorInput("not-a-color").status, "invalid")
})

test("createCssNotationRows returns copy-ready notation rows", () => {
  const parsed = parseCssColorInput("#ff0000")

  assert.equal(parsed.status, "parsed")
  if (parsed.status !== "parsed") {
    return
  }

  const rows = createCssNotationRows(parsed.color)

  assert.deepEqual(
    rows.map((row) => row.id),
    ["hex", "rgb", "hsl", "lab", "lch", "oklab", "oklch", "displayP3"]
  )
  assert.equal(rows[0]?.value, "#ff0000")
})
