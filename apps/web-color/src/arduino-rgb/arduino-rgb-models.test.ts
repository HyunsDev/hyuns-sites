import assert from "node:assert/strict"
import test from "node:test"

import {
  formatRgbCommand,
  parseArduinoRgbResponse,
} from "./arduino-rgb-protocol.ts"
import {
  formatArduinoRgb,
  getColorModelDefinition,
  setModelAxisValue,
} from "./arduino-rgb-models.ts"

test("formatRgbCommand emits the Arduino newline protocol", () => {
  assert.equal(formatRgbCommand({ r: 24, g: 80, b: 255 }), "24,80,255\n")
})

test("parseArduinoRgbResponse parses OK and STATUS RGB lines", () => {
  assert.deepEqual(parseArduinoRgbResponse("OK 255, 128, 0"), {
    kind: "ok",
    rgb: { r: 255, g: 128, b: 0 },
  })
  assert.deepEqual(parseArduinoRgbResponse("RGB 0,64,255"), {
    kind: "status",
    rgb: { r: 0, g: 64, b: 255 },
  })
})

test("parseArduinoRgbResponse preserves Arduino errors", () => {
  assert.deepEqual(parseArduinoRgbResponse("ERR expected-r,g,b-0-255"), {
    kind: "error",
    message: "expected-r,g,b-0-255",
  })
})

test("RGB model maps sliders directly to Arduino byte channels", () => {
  const model = getColorModelDefinition("rgb")

  assert.deepEqual(model.toRgb([255, 96, 36]), { r: 255, g: 96, b: 36 })
  assert.equal(formatArduinoRgb(model.toRgb([1, 2, 3])), "rgb(1, 2, 3)")
})

test("HSL and HSV models convert primary hues into Arduino RGB", () => {
  assert.deepEqual(getColorModelDefinition("hsl").toRgb([120, 100, 50]), {
    r: 0,
    g: 255,
    b: 0,
  })
  assert.deepEqual(getColorModelDefinition("hsv").toRgb([240, 100, 100]), {
    r: 0,
    g: 0,
    b: 255,
  })
})

test("CMYK and OKLCH models clamp output to Arduino byte channels", () => {
  assert.deepEqual(getColorModelDefinition("cmyk").toRgb([0, 100, 100, 0]), {
    r: 255,
    g: 0,
    b: 0,
  })
  assert.deepEqual(getColorModelDefinition("oklch").toRgb([100, 0, 0]), {
    r: 255,
    g: 255,
    b: 255,
  })
})

test("setModelAxisValue updates only the selected slider value", () => {
  assert.deepEqual(
    setModelAxisValue({ axisIndex: 1, value: 42, values: [1, 2, 3] }),
    [1, 42, 3]
  )
})
