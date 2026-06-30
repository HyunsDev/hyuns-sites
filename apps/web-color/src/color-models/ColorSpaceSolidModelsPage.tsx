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
import { createSolidColorSpaceHighlight } from "@/color-models/color-space-solid-highlight"
import type { ColorSpaceModelId } from "@/color-models/color-space-models"
import {
  getBaseColorSpaceModelId,
  isHueCubeModelId,
} from "@/color-models/color-space-models"
import {
  getSolidHueCubeModelId,
  resolveSolidHueCubeModelId,
} from "@/color-models/color-space-solid-cube-models"
import { SolidColorSpaceModelCanvas } from "@/color-models/SolidColorSpaceModelCanvas"
import { PlaygroundStage } from "@/playground/PlaygroundRoute"

const CIE_REFERENCE_MODEL_IDS = ["xyz", "xyy"] as const
const DEFAULT_TARGET_INPUT = "oklch(70% 0.18 32)"

function isCieReferenceModel(modelId: ColorSpaceModelId) {
  return CIE_REFERENCE_MODEL_IDS.some((item) => item === modelId)
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
  const [targetEnabled, setTargetEnabled] = useState(false)
  const [targetInput, setTargetInput] = useState(DEFAULT_TARGET_INPUT)
  const [uiHidden, setUiHidden] = useState(false)
  const [slice, setSlice] = useState<SolidSliceState>(() =>
    createDefaultSolidSliceState("rgb")
  )
  const [gamutCapabilities] = useState<ColorGamutCapabilities>(() =>
    detectColorGamutCapabilities()
  )
  const selectedModel = COLOR_SPACE_MODEL_BY_ID[selectedModelId]
  const selectedBaseModelId = getBaseColorSpaceModelId(selectedModel.id)
  const cubeModelId = getSolidHueCubeModelId(selectedBaseModelId)
  const cubeSupported = cubeModelId !== null
  const cubeEnabled = isHueCubeModelId(selectedModel.id)
  const gamutRendering = useMemo(
    () => resolveColorGamutRendering(selectedGamutId, gamutCapabilities),
    [gamutCapabilities, selectedGamutId]
  )
  const sampleRenderOptions = useMemo(
    () =>
      createColorSampleRenderOptions(
        gamutRendering.mode.id,
        gamutRendering.actualOutput.id
      ),
    [gamutRendering.actualOutput.id, gamutRendering.mode.id]
  )
  const targetResult = useMemo(
    () =>
      createSolidColorSpaceHighlight({
        modelId: selectedModel.id,
        options: sampleRenderOptions,
        value: targetInput,
      }),
    [sampleRenderOptions, selectedModel.id, targetInput]
  )
  const targetHighlight =
    targetEnabled && targetResult.status === "ready"
      ? targetResult.highlight
      : null

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
      sampleRenderOptions
    )
  }, [
    sampleRenderOptions,
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

  function changeTargetEnabled(enabled: boolean) {
    setTargetEnabled(enabled)

    if (enabled) {
      setShowSlice(false)
    }
  }

  function changeSliceEnabled(enabled: boolean) {
    setShowSlice(enabled)

    if (enabled) {
      setTargetEnabled(false)
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
        targetEnabled={targetEnabled}
        onGamutSelect={setSelectedGamutId}
        onModelSelect={(modelId) => {
          selectSolidModel(resolveSolidHueCubeModelId(modelId, cubeEnabled))
        }}
        onCubeEnabledChange={(enabled) => {
          selectSolidModel(
            resolveSolidHueCubeModelId(selectedBaseModelId, enabled)
          )
        }}
        onGuidesEnabledChange={setShowGuides}
        onWireframeChange={setShowWireframe}
        onSliceEnabledChange={changeSliceEnabled}
        onSliceChange={setSlice}
        targetInput={targetInput}
        targetResult={targetResult}
        onTargetEnabledChange={changeTargetEnabled}
        onTargetInputChange={setTargetInput}
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
          highlight={targetHighlight}
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
