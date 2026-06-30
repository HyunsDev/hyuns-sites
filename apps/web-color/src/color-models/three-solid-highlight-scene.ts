import {
  BufferAttribute,
  BufferGeometry,
  Color as ThreeColor,
  DoubleSide,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from "three"

import type {
  SolidColorSpaceHighlight,
} from "./color-space-solid-highlight.ts"
import type { SolidColorSpaceHighlightLine } from "./color-space-solid-highlight-geometry.ts"
import type { LinearDisplayColor } from "./color-sample-rendering.ts"
import type { Vector3Point } from "./color-space-samples.ts"
import type { SolidColorSpaceMesh } from "./color-space-solid-mesh.ts"

const POINT_RADIUS = 0.055
const POINT_HALO_RADIUS = 0.095

export function createSolidColorSpaceHighlightObject(
  highlight: SolidColorSpaceHighlight
) {
  switch (highlight.kind) {
    case "point":
      return createPointObject(highlight.position, highlight.color)
    case "line":
      return createLineObject(highlight.line)
    case "surface":
      return createSurfaceObject(highlight.mesh)
    default:
      return assertNeverHighlight(highlight)
  }
}

function createPointObject(
  position: Vector3Point,
  color: LinearDisplayColor
) {
  const group = new Group()
  const halo = new Mesh(
    new SphereGeometry(POINT_HALO_RADIUS, 24, 12),
    new MeshBasicMaterial({
      color: "#ffffff",
      depthTest: false,
      depthWrite: false,
      opacity: 0.28,
      transparent: true,
    })
  )
  const point = new Mesh(
    new SphereGeometry(POINT_RADIUS, 24, 12),
    new MeshBasicMaterial({
      color: toThreeColor(color),
      depthTest: false,
      depthWrite: false,
    })
  )

  halo.position.set(position.x, position.y, position.z)
  point.position.set(position.x, position.y, position.z)
  halo.renderOrder = 12
  point.renderOrder = 13
  group.add(halo)
  group.add(point)

  return group
}

function createLineObject(line: SolidColorSpaceHighlightLine) {
  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(line.positions, 3))
  geometry.setAttribute("color", new BufferAttribute(line.colors, 3))

  const object = new Line(
    geometry,
    new LineBasicMaterial({
      depthTest: false,
      depthWrite: false,
      opacity: 0.96,
      transparent: true,
      vertexColors: true,
    })
  )
  object.renderOrder = 12

  return object
}

function createSurfaceObject(mesh: SolidColorSpaceMesh) {
  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(mesh.positions, 3))
  geometry.setAttribute("color", new BufferAttribute(mesh.colors, 3))
  geometry.setIndex(new BufferAttribute(mesh.indices, 1))
  geometry.computeVertexNormals()

  const object = new Mesh(
    geometry,
    new MeshBasicMaterial({
      depthTest: false,
      depthWrite: false,
      opacity: 0.9,
      side: DoubleSide,
      transparent: true,
      vertexColors: true,
    })
  )
  object.renderOrder = 11

  return object
}

function toThreeColor(color: LinearDisplayColor) {
  return new ThreeColor().setRGB(color.r, color.g, color.b)
}

function assertNeverHighlight(highlight: never): never {
  throw new RangeError(`Unknown solid highlight: ${highlight}`)
}
