import type { ColorModelDefinition } from "./arduino-rgb-models.ts"
import { setModelAxisValueFromRatio } from "./arduino-rgb-axis-values.ts"
import type { ColorModelPlane } from "./arduino-rgb-plane-models.ts"
import { setModelPlaneValues } from "./arduino-rgb-plane-models.ts"

export type DrawArduinoRgbPlaneOptions = {
  readonly context: CanvasRenderingContext2D
  readonly height: number
  readonly model: ColorModelDefinition
  readonly plane: ColorModelPlane
  readonly values: readonly number[]
  readonly width: number
}

export type DrawArduinoRgbAxisBarOptions = {
  readonly axisIndex: number
  readonly context: CanvasRenderingContext2D
  readonly height: number
  readonly model: ColorModelDefinition
  readonly values: readonly number[]
  readonly width: number
}

export function drawArduinoRgbPlane({
  context,
  height,
  model,
  plane,
  values,
  width,
}: DrawArduinoRgbPlaneOptions): void {
  const imageData = context.createImageData(width, height)
  const xDenominator = Math.max(1, width - 1)
  const yDenominator = Math.max(1, height - 1)

  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const pixelValues = setModelPlaneValues({
        model,
        plane,
        values,
        xRatio: column / xDenominator,
        yRatio: row / yDenominator,
      })
      const rgb = model.toRgb(pixelValues)

      writeRgbPixel(imageData.data, (row * width + column) * 4, rgb)
    }
  }

  context.putImageData(imageData, 0, 0)
}

export function drawArduinoRgbAxisBar({
  axisIndex,
  context,
  height,
  model,
  values,
  width,
}: DrawArduinoRgbAxisBarOptions): void {
  const imageData = context.createImageData(width, height)
  const denominator = Math.max(1, width - 1)

  for (let column = 0; column < width; column += 1) {
    const pixelValues = setModelAxisValueFromRatio({
      axisIndex,
      model,
      ratio: column / denominator,
      values,
    })
    const rgb = model.toRgb(pixelValues)

    for (let row = 0; row < height; row += 1) {
      writeRgbPixel(imageData.data, (row * width + column) * 4, rgb)
    }
  }

  context.putImageData(imageData, 0, 0)
}

function writeRgbPixel(
  data: Uint8ClampedArray,
  offset: number,
  rgb: { readonly b: number; readonly g: number; readonly r: number }
): void {
  data[offset] = rgb.r
  data[offset + 1] = rgb.g
  data[offset + 2] = rgb.b
  data[offset + 3] = 255
}
