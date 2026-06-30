import type { ColorSampleRenderOptions } from "@/color-models/color-sample-rendering"
import {
  appendGridSurface,
  appendVertex,
  createBuilder,
  finalizeMesh,
  normalizeUnit,
} from "@/color-models/color-space-solid-mesh-builder"
import type { SolidSliceState } from "@/color-models/color-space-solid-slice-models"

const LAB_SLICE_SEGMENTS = 42
const LAB_WIREFRAME_STEP = 7
const LAB_MAX_CHROMA = 200

export function buildLabSlice(
  slice: SolidSliceState,
  options: ColorSampleRenderOptions
) {
  const builder = createBuilder()

  appendGridSurface(
    builder,
    LAB_SLICE_SEGMENTS,
    LAB_SLICE_SEGMENTS,
    (row, column) => {
      const u = column / LAB_SLICE_SEGMENTS
      const v = row / LAB_SLICE_SEGMENTS
      const coordinate = getLabSliceCoordinate(slice, u, v)

      return appendVertex(
        builder,
        {
          x: coordinate.a / LAB_MAX_CHROMA,
          y: normalizeUnit(coordinate.l),
          z: coordinate.b / LAB_MAX_CHROMA,
        },
        {
          mode: "lab",
          l: coordinate.l * 100,
          a: coordinate.a,
          b: coordinate.b,
        },
        options
      )
    },
    { columnStep: LAB_WIREFRAME_STEP, rowStep: LAB_WIREFRAME_STEP }
  )

  return finalizeMesh(builder, "Lab coordinate slice")
}

function getLabSliceCoordinate(slice: SolidSliceState, u: number, v: number) {
  switch (slice.axisId) {
    case "l":
      return {
        l: slice.value,
        a: normalizeUnit(u) * LAB_MAX_CHROMA,
        b: normalizeUnit(v) * LAB_MAX_CHROMA,
      }
    case "a":
      return {
        l: v,
        a: slice.value,
        b: normalizeUnit(u) * LAB_MAX_CHROMA,
      }
    case "b":
      return {
        l: v,
        a: normalizeUnit(u) * LAB_MAX_CHROMA,
        b: slice.value,
      }
    case "c":
    case "g":
    case "h":
    case "r":
    case "s":
    case "v":
      throw new RangeError(`Unsupported Lab slice axis: ${slice.axisId}`)
    default:
      return assertNeverLabAxis(slice.axisId)
  }
}

function assertNeverLabAxis(axisId: never): never {
  throw new RangeError(`Unknown Lab slice axis: ${axisId}`)
}
