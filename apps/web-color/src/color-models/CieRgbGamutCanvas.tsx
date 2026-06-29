import { useEffect, useRef } from "react"
import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  RingGeometry,
  Scene,
  WebGLRenderer,
} from "three"

import { buildCieXyzGamutMeshes } from "@/color-models/cie-xyz-gamut-mesh"
import { buildCieXyzReferenceMesh } from "@/color-models/cie-xyz-reference-mesh"
import { toXyChartPoint } from "@/color-models/cie-xyz-gamut-space"
import type { XyzPoint } from "@/color-models/cie-xyz-gamut-space"
import { createCieXyzTextLabel } from "@/color-models/three-cie-xyz-label"
import { CIE_XYZ_SCENE_PALETTE } from "@/color-models/three-cie-xyz-palette"
import type { CieXyzSceneTheme } from "@/color-models/three-cie-xyz-palette"
import { createCieXyzReferenceObject } from "@/color-models/three-cie-xyz-reference-scene"
import { disposeObjectTree } from "@/color-models/three-scene"
import type { CieRgbGamutPoint } from "@/color-models/cie-rgb-gamut-models"
import { useTheme } from "@hyunsdev/ui/components/theme-provider"
import { cn } from "@hyunsdev/ui/lib/utils"

const POINT_RADII = [0.036, 0.049, 0.062] as const
const LABEL_OFFSETS = [
  { x: 0.2, y: 0.2 },
  { x: -0.22, y: 0.16 },
  { x: 0.23, y: -0.18 },
] as const

function createLineSegments(positions: Float32Array, color: string) {
  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(positions, 3))

  const line = new LineSegments(
    geometry,
    new LineBasicMaterial({
      color,
      depthTest: false,
      depthWrite: false,
      opacity: 0.95,
      transparent: true,
    })
  )
  line.renderOrder = 4

  return line
}

function offsetPoint(point: XyzPoint, index: number): XyzPoint {
  const offset = LABEL_OFFSETS[index] ?? LABEL_OFFSETS[0]

  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
    z: point.z + 0.08,
  }
}

function createMarker(point: XyzPoint, color: string, index: number) {
  const radius = POINT_RADII[index] ?? POINT_RADII[0]
  const group = new Group()
  const fill = new Mesh(
    new CircleGeometry(radius, 32),
    new MeshBasicMaterial({
      color,
      depthTest: false,
      depthWrite: false,
      opacity: 0.86,
      transparent: true,
    })
  )
  const ring = new Mesh(
    new RingGeometry(radius * 1.18, radius * 1.42, 32),
    new MeshBasicMaterial({
      color,
      depthTest: false,
      depthWrite: false,
      opacity: 0.95,
      transparent: true,
    })
  )

  fill.renderOrder = 8 + index
  ring.renderOrder = 9 + index
  fill.position.set(point.x, point.y, point.z + 0.08)
  ring.position.set(point.x, point.y, point.z + 0.09)
  group.add(fill)
  group.add(ring)

  return group
}

function createPointGroup({
  points,
  theme,
}: {
  readonly points: readonly CieRgbGamutPoint[]
  readonly theme: CieXyzSceneTheme
}) {
  const group = new Group()
  const palette = CIE_XYZ_SCENE_PALETTE[theme]

  points.forEach((point, index) => {
    if (!point.chromaticity) {
      return
    }

    const chartPoint = toXyChartPoint(point.chromaticity)
    group.add(createMarker(chartPoint, point.lineColor, index))
    group.add(
      createCieXyzTextLabel({
        color: palette.textColor,
        label: point.shortLabel,
        position: offsetPoint(chartPoint, index),
      })
    )
  })

  return group
}

function createSceneObject({
  points,
  theme,
}: {
  readonly points: readonly CieRgbGamutPoint[]
  readonly theme: CieXyzSceneTheme
}) {
  const group = new Group()
  const reference = buildCieXyzReferenceMesh()
  const gamutMeshes = buildCieXyzGamutMeshes()

  group.add(
    createCieXyzReferenceObject({
      reference,
      showChromaticity: true,
      showVisibleCone: false,
      showXyChart: true,
      theme,
    })
  )
  gamutMeshes.forEach((mesh) => {
    group.add(createLineSegments(mesh.xyPrimaryLinePositions, mesh.lineColor))
  })
  group.add(createPointGroup({ points, theme }))

  return group
}

function resizeCamera({
  camera,
  height,
  width,
}: {
  readonly camera: OrthographicCamera
  readonly height: number
  readonly width: number
}) {
  const aspect = width / height
  const viewWidth = 4.9
  const viewHeight = Math.max(4.5, viewWidth / aspect)

  camera.left = (-viewHeight * aspect) / 2
  camera.right = (viewHeight * aspect) / 2
  camera.top = viewHeight / 2
  camera.bottom = -viewHeight / 2
  camera.updateProjectionMatrix()
}

export function CieRgbGamutCanvas({
  className,
  points,
}: {
  readonly className?: string
  readonly points: readonly CieRgbGamutPoint[]
}) {
  const { resolvedTheme } = useTheme()
  const hostRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current

    if (!host || !canvas) {
      return
    }

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new Scene()
    const camera = new OrthographicCamera(-2.45, 2.45, 2.25, -2.25, 0.1, 100)
    const sceneObject = createSceneObject({ points, theme: resolvedTheme })
    camera.position.set(-0.45, 0, 5)
    camera.lookAt(-0.45, 0, 0)
    scene.add(sceneObject)

    let resizeFrameId = 0
    const resize = () => {
      resizeFrameId = 0
      const width = Math.max(1, Math.floor(host.clientWidth))
      const height = Math.max(1, Math.floor(host.clientHeight))

      renderer.setSize(width, height, false)
      resizeCamera({ camera, height, width })
      renderer.render(scene, camera)
    }
    const queueResize = () => {
      if (resizeFrameId !== 0) {
        return
      }

      resizeFrameId = window.requestAnimationFrame(resize)
    }
    const resizeObserver = new ResizeObserver(queueResize)
    resizeObserver.observe(host)
    queueResize()

    return () => {
      if (resizeFrameId !== 0) {
        window.cancelAnimationFrame(resizeFrameId)
      }
      resizeObserver.disconnect()
      disposeObjectTree(sceneObject)
      renderer.dispose()
    }
  }, [points, resolvedTheme])

  return (
    <div
      ref={hostRef}
      className={cn("relative min-h-[420px] overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-label="CIE 1931 xy RGB gamut comparison chart"
        className="block size-full"
      />
      <div className="pointer-events-none absolute top-3 left-3 hidden flex-wrap items-center gap-2 lg:flex">
        <span className="rounded-md border border-border bg-background-primary/85 px-2 py-1 font-mono text-[0.65rem] text-text-normal shadow-sm backdrop-blur">
          CIE 1931 xy
        </span>
        <span className="rounded-md border border-border bg-background-primary/85 px-2 py-1 font-mono text-[0.65rem] text-text-muted shadow-sm backdrop-blur">
          sRGB / P3 / BT.2020
        </span>
      </div>
    </div>
  )
}
