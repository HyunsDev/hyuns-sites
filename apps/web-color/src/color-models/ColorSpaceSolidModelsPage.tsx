import { useEffect, useMemo, useState } from "react"

import { createColorSampleRenderOptions } from "@/color-models/color-sample-rendering"
import {
  buildSolidSliceMesh,
  createDefaultSolidSliceState,
  isSolidSliceModel,
} from "@/color-models/color-space-solid-slice"
import type { SolidSliceState } from "@/color-models/color-space-solid-slice"
import { buildSolidColorSpaceMesh } from "@/color-models/color-space-solid-mesh"
import {
  detectColorGamutCapabilities,
  resolveColorGamutRendering,
} from "@/color-models/color-gamut"
import type {
  ColorGamutCapabilities,
  ColorGamutModeId,
} from "@/color-models/color-gamut"
import { COLOR_SPACE_MODEL_BY_ID } from "@/color-models/color-space-models"
import { ColorSpaceSolidSettingsPanel } from "@/color-models/ColorSpaceSolidSettingsPanel"
import { ColorSpaceSolidOverlayTools } from "@/color-models/ColorSpaceSolidOverlayTools"
import { getSolidModelKeyboardAction } from "@/color-models/color-space-solid-keyboard"
import type {
  BaseColorSpaceModelId,
  ColorSpaceModelId,
  HueCubeBaseModelId,
  HueCubeModelId,
} from "@/color-models/color-space-models"
import {
  getBaseColorSpaceModelId,
  isHueCubeModelId,
} from "@/color-models/color-space-models"
import { SolidColorSpaceModelCanvas } from "@/color-models/SolidColorSpaceModelCanvas"
import { PlaygroundStage } from "@/playground/PlaygroundRoute"

const CIE_REFERENCE_MODEL_IDS = ["xyz", "xyy"] as const

type SolidHueCubeBaseModelId = Exclude<HueCubeBaseModelId, "hwb">

const CUBE_MODEL_BY_BASE_ID = {
  hsl: "hsl-cube",
  hsv: "hsv-cube",
  lch: "lch-cube",
  oklch: "oklch-cube",
} as const satisfies Record<SolidHueCubeBaseModelId, HueCubeModelId>

function isCieReferenceModel(modelId: ColorSpaceModelId) {
  return CIE_REFERENCE_MODEL_IDS.some((item) => item === modelId)
}

function isHueCubeBaseModelId(
  modelId: BaseColorSpaceModelId
): modelId is SolidHueCubeBaseModelId {
  return (
    modelId === "hsl" ||
    modelId === "hsv" ||
    modelId === "lch" ||
    modelId === "oklch"
  )
}

function getCubeModelId(modelId: BaseColorSpaceModelId) {
  return isHueCubeBaseModelId(modelId) ? CUBE_MODEL_BY_BASE_ID[modelId] : null
}

function resolveSolidModelId(
  modelId: BaseColorSpaceModelId,
  cubeEnabled: boolean
) {
  const cubeModelId = getCubeModelId(modelId)

  return cubeEnabled && cubeModelId ? cubeModelId : modelId
}

function isSolidGamutModeSupported(
  modelId: ColorSpaceModelId,
  gamutId: ColorGamutModeId
) {
  return gamutId !== "cie-1931" || isCieReferenceModel(modelId)
}

export function ColorSpaceSolidModelsPage() {
  const [selectedModelId, setSelectedModelId] =
    useState<ColorSpaceModelId>("oklch")
  const [selectedGamutId, setSelectedGamutId] =
    useState<ColorGamutModeId>("srgb")
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(true)
  const [showGuides, setShowGuides] = useState(true)
  const [showWireframe, setShowWireframe] = useState(true)
  const [showSlice, setShowSlice] = useState(false)
  const [uiHidden, setUiHidden] = useState(false)
  const [slice, setSlice] = useState<SolidSliceState>(() =>
    createDefaultSolidSliceState("rgb")
  )
  const [gamutCapabilities] = useState<ColorGamutCapabilities>(() =>
    detectColorGamutCapabilities()
  )
  const selectedModel = COLOR_SPACE_MODEL_BY_ID[selectedModelId]
  const selectedBaseModelId = getBaseColorSpaceModelId(selectedModel.id)
  const cubeModelId = getCubeModelId(selectedBaseModelId)
  const cubeSupported = cubeModelId !== null
  const cubeEnabled = isHueCubeModelId(selectedModel.id)
  const gamutRendering = useMemo(
    () => resolveColorGamutRendering(selectedGamutId, gamutCapabilities),
    [gamutCapabilities, selectedGamutId]
  )

  const mesh = useMemo(
    () =>
      buildSolidColorSpaceMesh(
        selectedModel.id,
        gamutRendering.mode.id,
        gamutRendering.actualOutput.id
      ),
    [gamutRendering.actualOutput.id, gamutRendering.mode.id, selectedModel.id]
  )
  const sliceMesh = useMemo(() => {
    if (!showSlice || !isSolidSliceModel(selectedModel.id)) {
      return null
    }

    return buildSolidSliceMesh(
      selectedModel.id,
      slice,
      createColorSampleRenderOptions(
        gamutRendering.mode.id,
        gamutRendering.actualOutput.id
      )
    )
  }, [
    gamutRendering.actualOutput.id,
    gamutRendering.mode.id,
    selectedModel.id,
    showSlice,
    slice,
  ])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const action = getSolidModelKeyboardAction(event)

      switch (action) {
        case "hide-ui":
          setUiHidden((current) => !current)
          return
        case "toggle-rotation":
          event.preventDefault()
          setAutoRotationEnabled((current) => !current)
          return
        case null:
          return
        default:
          assertNeverKeyboardAction(action)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  function selectSolidModel(modelId: ColorSpaceModelId) {
    setSelectedModelId(modelId)

    if (!isSolidGamutModeSupported(modelId, selectedGamutId)) {
      setSelectedGamutId("srgb")
    }

    if (isSolidSliceModel(modelId)) {
      setSlice(createDefaultSolidSliceState(modelId))
    }
  }

  function renderSettingsPanel(className: string) {
    return (
      <ColorSpaceSolidSettingsPanel
        className={className}
        capabilities={gamutCapabilities}
        cubeEnabled={cubeEnabled}
        cubeSupported={cubeSupported}
        isGamutModeSupported={(gamutId) =>
          isSolidGamutModeSupported(selectedModel.id, gamutId)
        }
        selectedBaseModelId={selectedBaseModelId}
        selectedGamutId={selectedGamutId}
        selectedModelId={selectedModel.id}
        showGuides={showGuides}
        showSlice={showSlice}
        showWireframe={showWireframe}
        slice={slice}
        onGamutSelect={setSelectedGamutId}
        onModelSelect={(modelId) => {
          selectSolidModel(resolveSolidModelId(modelId, cubeEnabled))
        }}
        onCubeEnabledChange={(enabled) => {
          selectSolidModel(resolveSolidModelId(selectedBaseModelId, enabled))
        }}
        onGuidesEnabledChange={setShowGuides}
        onWireframeChange={setShowWireframe}
        onSliceEnabledChange={setShowSlice}
        onSliceChange={setSlice}
      />
    )
  }

  function showUi() {
    if (uiHidden) {
      setUiHidden(false)
    }
  }

  return (
    <div onPointerDownCapture={showUi}>
      <PlaygroundStage
        bottomStart={uiHidden ? null : renderSettingsPanel("hidden lg:grid")}
        bottomCenter={uiHidden ? null : renderSettingsPanel("lg:hidden")}
        bottomEnd={
          uiHidden ? null : (
            <ColorSpaceSolidOverlayTools
              autoRotationEnabled={autoRotationEnabled}
              onAutoRotationToggle={() => {
                setAutoRotationEnabled((current) => !current)
              }}
              onHide={() => setUiHidden(true)}
            />
          )
        }
      >
        <SolidColorSpaceModelCanvas
          autoRotate={autoRotationEnabled}
          gamutRendering={gamutRendering}
          mesh={mesh}
          model={selectedModel}
          sliceMesh={sliceMesh}
          showGuides={showGuides}
          showWireframe={showWireframe}
          className="size-full min-h-0 rounded-none border-0 bg-background-primary/70 shadow-none md:min-h-0"
        />
      </PlaygroundStage>
    </div>
  )
}

function assertNeverKeyboardAction(action: never): never {
  throw new RangeError(`Unknown solid model keyboard action: ${action}`)
}
