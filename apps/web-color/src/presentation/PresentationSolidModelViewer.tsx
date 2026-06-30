import { useEffect, useMemo, useState } from "react"

import { ColorSpaceSolidCubeSwitch } from "@/color-models/ColorSpaceSolidCubeSwitch"
import { ColorSpaceSolidSliceControls } from "@/color-models/ColorSpaceSolidSliceControls"
import { createColorSampleRenderOptions } from "@/color-models/color-sample-rendering"
import {
  detectColorGamutCapabilities,
  resolveColorGamutRendering,
} from "@/color-models/color-gamut"
import type { ColorGamutCapabilities } from "@/color-models/color-gamut"
import {
  COLOR_SPACE_MODEL_BY_ID,
  type BaseColorSpaceModelId,
  type ColorSpaceModelId,
} from "@/color-models/color-space-models"
import {
  getSolidHueCubeModelId,
  resolveSolidHueCubeModelId,
} from "@/color-models/color-space-solid-cube-models"
import { createSolidColorSpaceHighlight } from "@/color-models/color-space-solid-highlight"
import { buildSolidColorSpaceMesh } from "@/color-models/color-space-solid-mesh"
import {
  buildSolidSliceMesh,
  createDefaultSolidSliceState,
  isSolidSliceModel,
  type SolidSliceState,
} from "@/color-models/color-space-solid-slice"
import { SolidColorSpaceModelCanvas } from "@/color-models/SolidColorSpaceModelCanvas"
import {
  PresentationGamutSelect,
  PresentationSolidModelTargetInput,
  type PresentationGamutModeId,
} from "@/presentation/PresentationSolidModelControls"
import { Switch } from "@hyunsdev/ui/components/switch"
import { cn } from "@hyunsdev/ui/lib/utils"

export type PresentationSolidModelBaseId = Extract<
  BaseColorSpaceModelId,
  "rgb" | "hsl" | "hsv" | "lab" | "lch" | "oklch"
>

export type PresentationSolidModelViewerProps = {
  readonly baseModelId: PresentationSolidModelBaseId
  readonly cubeDefaultEnabled?: boolean
  readonly showCubeSwitch?: boolean
  readonly showGamutSelect?: boolean
  readonly showSliceControls?: boolean
  readonly solidModelClassName?: string
  readonly targetDefaultEnabled?: boolean
  readonly showTargetControls?: boolean
  readonly showTargetSwitch?: boolean
  readonly targetControlsPlacement?: "bottom" | "slice-panel"
  readonly targetCssColor?: string
}

export function PresentationSolidModelViewer({
  baseModelId,
  cubeDefaultEnabled = false,
  showCubeSwitch = true,
  showGamutSelect = false,
  showSliceControls = true,
  solidModelClassName,
  targetDefaultEnabled = false,
  showTargetControls = showSliceControls,
  showTargetSwitch = true,
  targetControlsPlacement = "slice-panel",
  targetCssColor,
}: PresentationSolidModelViewerProps) {
  const [cubeEnabled, setCubeEnabled] = useState(cubeDefaultEnabled)
  const [gamutModeId, setGamutModeId] =
    useState<PresentationGamutModeId>("srgb")
  const [gamutCapabilities] = useState<ColorGamutCapabilities>(() =>
    detectColorGamutCapabilities()
  )
  const cubeSupported = getSolidHueCubeModelId(baseModelId) !== null
  const modelId = resolveSolidHueCubeModelId(baseModelId, cubeEnabled)
  const model = COLOR_SPACE_MODEL_BY_ID[modelId]
  const [slice, setSlice] = useState<SolidSliceState | null>(() =>
    createPresentationSliceState(modelId)
  )
  const [sliceEnabled, setSliceEnabled] = useState(false)
  const [targetEnabled, setTargetEnabled] = useState(targetDefaultEnabled)
  const [targetInput, setTargetInput] = useState(() =>
    createPresentationTargetInput(modelId, targetCssColor)
  )
  const gamutRendering = useMemo(
    () => resolveColorGamutRendering(gamutModeId, gamutCapabilities),
    [gamutCapabilities, gamutModeId]
  )
  const sampleRenderOptions = useMemo(
    () =>
      createColorSampleRenderOptions(
        gamutRendering.mode.id,
        gamutRendering.actualOutput.id
      ),
    [gamutRendering.actualOutput.id, gamutRendering.mode.id]
  )
  const mesh = useMemo(
    () =>
      buildSolidColorSpaceMesh(
        model.id,
        gamutRendering.mode.id,
        gamutRendering.actualOutput.id
      ),
    [gamutRendering.actualOutput.id, gamutRendering.mode.id, model.id]
  )
  const sliceMesh = useMemo(() => {
    if (!sliceEnabled || !slice || !isSolidSliceModel(model.id)) {
      return null
    }

    return buildSolidSliceMesh(
      model.id,
      slice,
      sampleRenderOptions
    )
  }, [model.id, sampleRenderOptions, slice, sliceEnabled])
  const highlight = useMemo(() => {
    if (!targetEnabled) {
      return null
    }

    const result = createSolidColorSpaceHighlight({
      modelId: model.id,
      options: sampleRenderOptions,
      value: targetInput,
    })

    return result.status === "ready" ? result.highlight : null
  }, [model.id, sampleRenderOptions, targetEnabled, targetInput])
  const targetResult = useMemo(
    () =>
      createSolidColorSpaceHighlight({
        modelId: model.id,
        options: sampleRenderOptions,
        value: targetInput,
      }),
    [model.id, sampleRenderOptions, targetInput]
  )
  const hasControls = showGamutSelect || (showCubeSwitch && cubeSupported)
  const showTargetInSlicePanel =
    showTargetControls && targetControlsPlacement === "slice-panel"
  const showTargetInBottomPanel =
    showTargetControls && targetControlsPlacement === "bottom"

  useEffect(() => {
    setCubeEnabled(cubeDefaultEnabled)
  }, [baseModelId, cubeDefaultEnabled])

  useEffect(() => {
    setSlice(createPresentationSliceState(modelId))
    setSliceEnabled(false)
    setTargetEnabled(targetDefaultEnabled)
  }, [modelId, targetDefaultEnabled])

  useEffect(() => {
    setTargetInput(createPresentationTargetInput(modelId, targetCssColor))
    setTargetEnabled(targetDefaultEnabled)
  }, [modelId, targetCssColor, targetDefaultEnabled])

  function changeSliceEnabled(enabled: boolean) {
    setSliceEnabled(enabled)

    if (enabled) {
      setTargetEnabled(false)
    }
  }

  function changeTargetEnabled(enabled: boolean) {
    setTargetEnabled(enabled)

    if (enabled) {
      setSliceEnabled(false)
    }
  }

  return (
    <div className="relative size-full min-h-0">
      <SolidColorSpaceModelCanvas
        autoRotate
        gamutRendering={gamutRendering}
        highlight={highlight}
        mesh={mesh}
        model={model}
        sliceMesh={sliceMesh}
        showGuides
        showStats={false}
        showWireframe
        surface="transparent"
        className={cn("size-full min-h-0 md:min-h-0", solidModelClassName)}
      />
      {showSliceControls && slice ? (
        <div className="absolute bottom-[7.2cqh] left-[2cqw] z-20 grid w-[clamp(15.5rem,24cqw,19.5rem)] gap-2 rounded-md border border-border bg-background-primary/90 p-3 text-xs shadow-sm backdrop-blur max-md:bottom-[18%] max-md:left-[5cqw] max-md:w-[min(11rem,48cqw)] max-md:gap-1 max-md:p-1.5 max-md:text-[0.62rem]">
          <label className="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2 max-md:grid-cols-[4rem_minmax(0,1fr)] max-md:gap-1">
            <span className="font-medium text-text-muted">Slice</span>
            <Switch
              size="sm"
              checked={sliceEnabled}
              onCheckedChange={changeSliceEnabled}
              aria-label="Toggle solid model slice"
              className="justify-self-end"
            />
          </label>
          <ColorSpaceSolidSliceControls
            className="max-md:gap-1 max-md:[&>div]:grid-cols-[5.5rem_minmax(0,1fr)] max-md:[&>div]:gap-1 max-md:[&>div]:text-[0.62rem] max-md:[&>div>div]:grid-cols-[minmax(2.6rem,1fr)_2.25rem] max-md:[&>div>div]:gap-1 max-md:[&_code]:text-[0.56rem]"
            modelId={model.id}
            slice={slice}
            sliceEnabled={sliceEnabled}
            onSliceChange={setSlice}
          />
          {showTargetInSlicePanel ? (
            <PresentationSolidModelTargetInput
              className="border-t border-border pt-2 max-md:pt-1"
              enabled={targetEnabled}
              modelId={model.id}
              result={targetResult}
              showSwitch={showTargetSwitch}
              value={targetInput}
              onChange={setTargetInput}
              onEnabledChange={changeTargetEnabled}
            />
          ) : null}
        </div>
      ) : null}
      {showTargetInBottomPanel ? (
        <div className="absolute bottom-[1.2cqh] left-1/2 z-20 grid w-[min(22rem,82%)] -translate-x-1/2 p-2 text-xs max-md:w-[min(11rem,48cqw)] max-md:p-1.5 max-md:text-[0.58rem]">
          <PresentationSolidModelTargetInput
            enabled={targetEnabled}
            modelId={model.id}
            result={targetResult}
            showSwitch={showTargetSwitch}
            value={targetInput}
            onChange={setTargetInput}
            onEnabledChange={changeTargetEnabled}
          />
        </div>
      ) : null}
      {hasControls ? (
        <div className="absolute right-[2cqw] bottom-[7.2cqh] z-10 grid w-[min(18rem,92%)] gap-2 rounded-md border border-border bg-background-primary/90 p-3 text-xs shadow-sm backdrop-blur max-md:right-[5cqw] max-md:bottom-[18%] max-md:w-[min(9.25rem,41cqw)] max-md:gap-1 max-md:p-1.5 max-md:text-[0.58rem] max-md:[&_label]:grid-cols-[4.35rem_minmax(0,1fr)] max-md:[&_label]:gap-1 max-md:[&_label>span]:truncate">
          {showGamutSelect ? (
            <PresentationGamutSelect
              value={gamutModeId}
              onChange={setGamutModeId}
            />
          ) : null}
          {showCubeSwitch && cubeSupported ? (
            <ColorSpaceSolidCubeSwitch
              checked={cubeEnabled}
              onCheckedChange={setCubeEnabled}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function createPresentationSliceState(
  modelId: ColorSpaceModelId
): SolidSliceState | null {
  return isSolidSliceModel(modelId) ? createDefaultSolidSliceState(modelId) : null
}

function createPresentationTargetInput(
  modelId: ColorSpaceModelId,
  targetCssColor: string | undefined
) {
  return targetCssColor ?? COLOR_SPACE_MODEL_BY_ID[modelId].notation
}
