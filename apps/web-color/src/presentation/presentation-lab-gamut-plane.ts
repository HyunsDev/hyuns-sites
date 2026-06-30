import { converter, formatHex, inGamut } from "culori"
import type { Lab } from "culori"

export type LabGamutPlaneCell = {
  readonly a: number
  readonly b: number
  readonly color: string | null
  readonly column: number
  readonly inSrgb: boolean
  readonly isBoundary: boolean
  readonly row: number
}

export type LabGamutPlane = {
  readonly axisLimit: number
  readonly cells: readonly LabGamutPlaneCell[]
  readonly lightness: number
  readonly size: number
}

export type LabGamutPlaneInput = {
  readonly axisLimit?: number
  readonly lightness?: number
  readonly size?: number
}

export type LabGamutPlaneCellInput = {
  readonly a: number
  readonly b: number
  readonly lightness: number
}

const DEFAULT_AXIS_LIMIT = 120
const DEFAULT_LIGHTNESS = 50
const DEFAULT_SIZE = 96
const toRgb = converter("rgb")
const isInSrgb = inGamut("rgb")

export function getLabGamutPlaneCell({
  a,
  b,
  lightness,
}: LabGamutPlaneCellInput): Omit<
  LabGamutPlaneCell,
  "column" | "isBoundary" | "row"
> {
  const color: Lab = {
    mode: "lab",
    l: lightness,
    a,
    b,
  }
  const inSrgb = isInSrgb(color)

  return {
    a,
    b,
    color: inSrgb ? formatHex(toRgb(color)) : null,
    inSrgb,
  }
}

export function createLabGamutPlane({
  axisLimit = DEFAULT_AXIS_LIMIT,
  lightness = DEFAULT_LIGHTNESS,
  size = DEFAULT_SIZE,
}: LabGamutPlaneInput = {}): LabGamutPlane {
  const normalizedSize = Math.max(2, Math.floor(size))
  const cells = createPlaneCells({ axisLimit, lightness, size: normalizedSize })

  return {
    axisLimit,
    cells: markBoundaryCells(cells, normalizedSize),
    lightness,
    size: normalizedSize,
  }
}

function createPlaneCells({
  axisLimit,
  lightness,
  size,
}: Required<LabGamutPlaneInput>) {
  const cells: LabGamutPlaneCell[] = []
  const denominator = size - 1

  for (let row = 0; row < size; row += 1) {
    const b = axisLimit - (row / denominator) * axisLimit * 2

    for (let column = 0; column < size; column += 1) {
      const a = -axisLimit + (column / denominator) * axisLimit * 2
      const cell = getLabGamutPlaneCell({ a, b, lightness })

      cells.push({
        ...cell,
        column,
        isBoundary: false,
        row,
      })
    }
  }

  return cells
}

function markBoundaryCells(
  cells: readonly LabGamutPlaneCell[],
  size: number
): readonly LabGamutPlaneCell[] {
  return cells.map((cell) => ({
    ...cell,
    isBoundary: cell.inSrgb && touchesOutsideGamut(cells, cell, size),
  }))
}

function touchesOutsideGamut(
  cells: readonly LabGamutPlaneCell[],
  cell: LabGamutPlaneCell,
  size: number
) {
  const offsets = [
    { column: -1, row: 0 },
    { column: 1, row: 0 },
    { column: 0, row: -1 },
    { column: 0, row: 1 },
  ] as const

  return offsets.some((offset) => {
    const neighbor = readCell(
      cells,
      cell.row + offset.row,
      cell.column + offset.column,
      size
    )

    return neighbor ? !neighbor.inSrgb : true
  })
}

function readCell(
  cells: readonly LabGamutPlaneCell[],
  row: number,
  column: number,
  size: number
) {
  if (row < 0 || row >= size || column < 0 || column >= size) {
    return null
  }

  return cells[row * size + column] ?? null
}
