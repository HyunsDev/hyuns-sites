import { useEffect, useMemo, useRef } from "react"
import {
  AmbientLight,
  ColorManagement,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { ColorSpaceAxisLabelLayer } from "@/color-models/ColorSpaceAxisLabelLayer"
import { SolidColorSpaceStatsOverlay } from "@/color-models/SolidColorSpaceStatsOverlay"
import { getResponsiveCameraScale } from "@/color-models/color-space-camera"
import { createAxisLabelProjector } from "@/color-models/color-space-axis-label-projection"
import { getColorSpaceAxisLabels } from "@/color-models/color-space-axis-labels"
import type { SolidColorSpaceHighlight } from "@/color-models/color-space-solid-highlight"
import type { SolidColorSpaceMesh } from "@/color-models/color-space-solid-mesh"
import type { ColorGamutRendering } from "@/color-models/color-gamut"
import type { ColorSpaceModelDefinition } from "@/color-models/color-space-models"
import {
  getThreeOutputColorSpace,
  getThreeWorkingColorSpace,
  registerWideGamutColorSpaces,
} from "@/color-models/three-color-spaces"
import { createModelFrame } from "@/color-models/three-frame"
import { createSolidColorSpaceHighlightObject } from "@/color-models/three-solid-highlight-scene"
import { createSolidColorSpaceObject } from "@/color-models/three-solid-scene"
import { disposeObjectTree } from "@/color-models/three-scene"
import {
  applySolidModelViewState,
  createDefaultSolidModelViewState,
  readSolidModelViewState,
  type SolidModelViewState,
} from "@/color-models/solid-model-view-state"
import { useTheme } from "@hyunsdev/ui/components/theme-provider"
import { cn } from "@hyunsdev/ui/lib/utils"

const BASE_CONTROLS_MIN_DISTANCE = 2.2
const BASE_CONTROLS_MAX_DISTANCE = 5.5

export function SolidColorSpaceModelCanvas({
  autoRotate,
  className,
  gamutRendering,
  highlight,
  mesh,
  model,
  showStats = true,
  sliceMesh,
  showGuides,
  showWireframe,
  surface = "panel",
}: {
  readonly autoRotate: boolean
  readonly className?: string
  readonly gamutRendering: ColorGamutRendering
  readonly highlight?: SolidColorSpaceHighlight | null
  readonly mesh: SolidColorSpaceMesh
  readonly model: ColorSpaceModelDefinition
  readonly showStats?: boolean
  readonly sliceMesh?: SolidColorSpaceMesh | null
  readonly showGuides: boolean
  readonly showWireframe: boolean
  readonly surface?: "panel" | "transparent"
}) {
  const { resolvedTheme } = useTheme()
  const hostRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const labelLayerRef = useRef<HTMLDivElement | null>(null)
  const autoRotateRef = useRef(autoRotate)
  const showGuidesRef = useRef(showGuides)
  const viewStateRef = useRef<SolidModelViewState | null>(null)
  const axisLabels = useMemo(
    () => getColorSpaceAxisLabels(model.id),
    [model.id]
  )

  useEffect(() => {
    autoRotateRef.current = autoRotate
  }, [autoRotate])

  useEffect(() => {
    showGuidesRef.current = showGuides
  }, [showGuides])

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const labelLayer = labelLayerRef.current

    if (!host || !canvas || !labelLayer) {
      return
    }

    registerWideGamutColorSpaces()
    const previousWorkingColorSpace = ColorManagement.workingColorSpace
    ColorManagement.workingColorSpace = getThreeWorkingColorSpace(
      gamutRendering.actualOutput.id
    )

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.outputColorSpace = getThreeOutputColorSpace(
      gamutRendering.actualOutput.id
    )
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new Scene()
    const camera = new PerspectiveCamera(42, 1, 0.1, 100)

    const controls = new OrbitControls(camera, canvas)
    controls.autoRotate = autoRotateRef.current
    controls.autoRotateSpeed = 0.52
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = BASE_CONTROLS_MIN_DISTANCE
    controls.maxDistance = BASE_CONTROLS_MAX_DISTANCE

    const frame = createModelFrame(model.id, resolvedTheme)
    const solid = createSolidColorSpaceObject({
      mesh,
      showWireframe,
      surfaceOpacity: highlight ? 0.16 : sliceMesh ? 0.22 : 1,
      theme: resolvedTheme,
    })
    const slice = sliceMesh
      ? createSolidColorSpaceObject({
          mesh: sliceMesh,
          showWireframe: true,
          theme: resolvedTheme,
        })
      : null
    const highlightObject = highlight
      ? createSolidColorSpaceHighlightObject(highlight)
      : null
    const keyLight = new DirectionalLight("#ffffff", 1.2)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight)
    scene.add(new AmbientLight("#ffffff", 1.6))
    scene.add(frame)
    scene.add(solid)
    if (slice) {
      scene.add(slice)
    }
    if (highlightObject) {
      scene.add(highlightObject)
    }

    const updateAxisLabels = createAxisLabelProjector(labelLayer, axisLabels, {
      occludeTicksOnly: true,
      occlusionPadding: 0.34,
      occluders: slice ? [solid, slice] : [solid],
    })

    let resizeFrameId = 0
    let renderWidth = 1
    let renderHeight = 1
    let cameraScale = 1
    const resize = () => {
      resizeFrameId = 0
      renderWidth = Math.max(1, Math.floor(host.clientWidth))
      renderHeight = Math.max(1, Math.floor(host.clientHeight))

      renderer.setSize(renderWidth, renderHeight, false)
      cameraScale = getResponsiveCameraScale(renderWidth, renderHeight)
      controls.minDistance = BASE_CONTROLS_MIN_DISTANCE * cameraScale
      controls.maxDistance = BASE_CONTROLS_MAX_DISTANCE * cameraScale
      applySolidModelViewState({
        camera,
        cameraScale,
        controls,
        viewState:
          viewStateRef.current ?? createDefaultSolidModelViewState(cameraScale),
      })
      camera.aspect = renderWidth / renderHeight
      camera.updateProjectionMatrix()
      controls.update()
      updateAxisLabels(camera, renderWidth, renderHeight)
    }
    const queueResize = () => {
      if (resizeFrameId !== 0) {
        return
      }

      resizeFrameId = window.requestAnimationFrame(resize)
    }
    const resizeObserver = new ResizeObserver(queueResize)
    resizeObserver.observe(host)
    resize()

    let animationFrameId = 0
    const render = () => {
      controls.autoRotate = autoRotateRef.current
      frame.visible = showGuidesRef.current
      controls.update()
      viewStateRef.current = readSolidModelViewState({
        camera,
        cameraScale,
        controls,
      })
      renderer.render(scene, camera)
      updateAxisLabels(camera, renderWidth, renderHeight)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      viewStateRef.current = readSolidModelViewState({
        camera,
        cameraScale,
        controls,
      })
      window.cancelAnimationFrame(animationFrameId)
      if (resizeFrameId !== 0) {
        window.cancelAnimationFrame(resizeFrameId)
      }
      resizeObserver.disconnect()
      controls.dispose()
      disposeObjectTree(frame)
      disposeObjectTree(solid)
      if (slice) {
        disposeObjectTree(slice)
      }
      if (highlightObject) {
        disposeObjectTree(highlightObject)
      }
      renderer.dispose()
      ColorManagement.workingColorSpace = previousWorkingColorSpace
    }
  }, [
    gamutRendering.actualOutput.id,
    axisLabels,
    highlight,
    mesh,
    model.id,
    resolvedTheme,
    showWireframe,
    sliceMesh,
  ])

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative min-h-[320px] overflow-hidden md:min-h-[520px]",
        surface === "panel"
          ? "rounded-md border border-border bg-background-primary shadow-sm"
          : "bg-transparent",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-label={`${model.name} solid color space model`}
        className="block size-full"
      />
      <ColorSpaceAxisLabelLayer
        labelLayerRef={labelLayerRef}
        labels={axisLabels}
        className={!showGuides ? "hidden" : undefined}
      />
      {showGuides && showStats ? (
        <SolidColorSpaceStatsOverlay
          gamutRendering={gamutRendering}
          mesh={mesh}
          sliceMesh={sliceMesh}
        />
      ) : null}
    </div>
  )
}
