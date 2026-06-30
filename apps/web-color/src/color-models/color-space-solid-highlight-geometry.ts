import type { Color } from "culori"

import type { LinearDisplayColor } from "./color-sample-rendering.ts"
import type { ColorSampleRenderOptions } from "./color-sample-rendering.ts"
import { toColorSampleRenderColor } from "./color-sample-rendering.ts"
import type { ColorSpaceModelId } from "./color-space-models.ts"
import type { Vector3Point } from "./color-space-samples.ts"
import type { SolidColorSpaceMesh } from "./color-space-solid-mesh.ts"
import {
  createColorFromSolidHighlightChannels,
  type SolidHighlightColorMode,
  type SolidHighlightChannel,
  type SolidHighlightChannelOverride,
} from "./color-space-solid-highlight-coordinates.ts"
import { getSolidHighlightPoint } from "./color-space-solid-highlight-points.ts"

export type SolidColorSpaceHighlightLine = {
  readonly colors: Float32Array
  readonly positions: Float32Array
}

type HighlightMeshBuilder = {
  readonly colors: number[]
  readonly indices: number[]
  readonly positions: number[]
}

const FALLBACK_HIGHLIGHT_COLOR = { r: 1, g: 1, b: 1 } as const

export function createSolidHighlightLine({
  channels,
  freeChannel,
  mode,
  modelId,
  options,
}: {
  readonly channels: readonly SolidHighlightChannel[]
  readonly freeChannel: SolidHighlightChannel
  readonly mode: SolidHighlightColorMode
  readonly modelId: ColorSpaceModelId
  readonly options: ColorSampleRenderOptions
}): SolidColorSpaceHighlightLine {
  const colors: number[] = []
  const positions: number[] = []

  for (let index = 0; index <= freeChannel.segments; index += 1) {
    const color = createHighlightSampleColor({
      channels,
      mode,
      overrides: [
        {
          id: freeChannel.id,
          value: interpolateChannel(freeChannel, index / freeChannel.segments),
        },
      ],
    })
    const point = getSolidHighlightPoint(modelId, color)

    if (point) {
      const renderColor = toHighlightColor(color, options)
      positions.push(point.x, point.y, point.z)
      colors.push(renderColor.r, renderColor.g, renderColor.b)
    }
  }

  return {
    colors: new Float32Array(colors),
    positions: new Float32Array(positions),
  }
}

export function createSolidHighlightSurface({
  channels,
  firstChannel,
  label,
  mode,
  modelId,
  options,
  secondChannel,
}: {
  readonly channels: readonly SolidHighlightChannel[]
  readonly firstChannel: SolidHighlightChannel
  readonly label: string
  readonly mode: SolidHighlightColorMode
  readonly modelId: ColorSpaceModelId
  readonly options: ColorSampleRenderOptions
  readonly secondChannel: SolidHighlightChannel
}): SolidColorSpaceMesh {
  const builder = createHighlightMeshBuilder()

  appendGridSurface(
    builder,
    firstChannel.segments,
    secondChannel.segments,
    (row, column) => {
      const color = createHighlightSampleColor({
        channels,
        mode,
        overrides: [
          {
            id: firstChannel.id,
            value: interpolateChannel(firstChannel, row / firstChannel.segments),
          },
          {
            id: secondChannel.id,
            value: interpolateChannel(
              secondChannel,
              column / secondChannel.segments
            ),
          },
        ],
      })
      const point = getSolidHighlightPoint(modelId, color) ?? { x: 0, y: 0, z: 0 }

      return appendHighlightVertex(builder, point, color, options)
    }
  )

  return finalizeMesh(builder, `${label} target surface`)
}

function createHighlightSampleColor({
  channels,
  mode,
  overrides,
}: {
  readonly channels: readonly SolidHighlightChannel[]
  readonly mode: SolidHighlightColorMode
  readonly overrides: readonly SolidHighlightChannelOverride[]
}) {
  return createColorFromSolidHighlightChannels({ channels, mode, overrides })
}

function interpolateChannel(channel: SolidHighlightChannel, unit: number) {
  return channel.min + (channel.max - channel.min) * unit
}

function toHighlightColor(
  color: Color,
  options: ColorSampleRenderOptions
): LinearDisplayColor {
  return toColorSampleRenderColor(color, options) ?? FALLBACK_HIGHLIGHT_COLOR
}

function createHighlightMeshBuilder(): HighlightMeshBuilder {
  return { colors: [], indices: [], positions: [] }
}

function appendHighlightVertex(
  builder: HighlightMeshBuilder,
  position: Vector3Point,
  color: Color,
  options: ColorSampleRenderOptions
) {
  const renderColor = toHighlightColor(color, options)

  builder.positions.push(position.x, position.y, position.z)
  builder.colors.push(renderColor.r, renderColor.g, renderColor.b)

  return builder.positions.length / 3 - 1
}

function appendGridSurface(
  builder: HighlightMeshBuilder,
  rows: number,
  columns: number,
  createVertex: (row: number, column: number) => number
) {
  const grid: number[][] = []

  for (let row = 0; row <= rows; row += 1) {
    const rowIndices: number[] = []

    for (let column = 0; column <= columns; column += 1) {
      rowIndices.push(createVertex(row, column))
    }

    grid.push(rowIndices)
  }

  appendGridTriangles(builder, grid, rows, columns)
}

function appendGridTriangles(
  builder: HighlightMeshBuilder,
  grid: readonly (readonly number[])[],
  rows: number,
  columns: number
) {
  for (let row = 0; row < rows; row += 1) {
    const currentRow = grid[row]
    const nextRow = grid[row + 1]

    if (!currentRow || !nextRow) {
      continue
    }

    for (let column = 0; column < columns; column += 1) {
      appendGridQuad(builder, currentRow, nextRow, column)
    }
  }
}

function appendGridQuad(
  builder: HighlightMeshBuilder,
  currentRow: readonly number[],
  nextRow: readonly number[],
  column: number
) {
  const topLeft = currentRow[column]
  const topRight = currentRow[column + 1]
  const bottomLeft = nextRow[column]
  const bottomRight = nextRow[column + 1]

  if (
    topLeft === undefined ||
    topRight === undefined ||
    bottomLeft === undefined ||
    bottomRight === undefined
  ) {
    return
  }

  builder.indices.push(topLeft, bottomLeft, topRight)
  builder.indices.push(topRight, bottomLeft, bottomRight)
}

function finalizeMesh(
  builder: HighlightMeshBuilder,
  shapeLabel: string
): SolidColorSpaceMesh {
  return {
    colors: new Float32Array(builder.colors),
    indices: new Uint32Array(builder.indices),
    positions: new Float32Array(builder.positions),
    shapeLabel,
    triangleCount: builder.indices.length / 3,
    vertexCount: builder.positions.length / 3,
    wireframePositions: new Float32Array(),
  }
}
