import { useEffect, useMemo, useState } from "react"

import { ColorSpaceSolidCubeSwitch } from "@/color-models/ColorSpaceSolidCubeSwitch"
import { ColorSpaceSolidSliceControls } from "@/color-models/ColorSpaceSolidSliceControls"
import { createColorSampleRenderOptions } from "@/color-models/color-sample-rendering"
import {
  COLOR_GAMUT_MODE_BY_ID,
  detectColorGamutCapabilities,
  resolveColorGamutRendering,
} from "@/color-models/color-gamut"
import type {
  ColorGamutCapabilities,
  ColorGamutModeId,
} from "@/color-models/color-gamut"
import {
  COLOR_SPACE_MODEL_BY_ID,
  type BaseColorSpaceModelId,
  type ColorSpaceModelId,
} from "@/color-models/color-space-models"
import {
  getSolidHueCubeModelId,
  resolveSolidHueCubeModelId,
} from "@/color-models/color-space-solid-cube-models"
import { buildSolidColorSpaceMesh } from "@/color-models/color-space-solid-mesh"
import {
  buildSolidSliceMesh,
  createDefaultSolidSliceState,
  isSolidSliceModel,
  type SolidSliceState,
} from "@/color-models/color-space-solid-slice"
import { SolidColorSpaceModelCanvas } from "@/color-models/SolidColorSpaceModelCanvas"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hyunsdev/ui/components/select"
import { Switch } from "@hyunsdev/ui/components/switch"

type PresentationSolidModelBaseId = Extract<
  BaseColorSpaceModelId,
  "rgb" | "hsl" | "hsv" | "lab" | "lch" | "oklch"
>

type PresentationGamutModeId = Extract<ColorGamutModeId, "srgb" | "display-p3">

type PresentationSolidModelViewerProps = {
  readonly baseModelId: PresentationSolidModelBaseId
  readonly showCubeSwitch?: boolean
  readonly showGamutSelect?: boolean
}

type PresentationSolidModelSlideProps = PresentationSolidModelViewerProps & {
  readonly ariaLabel: string
  readonly title: string
}

export function PresentationSolidModelSlide({
  ariaLabel,
  baseModelId,
  showCubeSwitch,
  showGamutSelect,
  title,
}: PresentationSolidModelSlideProps) {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label={ariaLabel}
    >
      <h1 className="pointer-events-none absolute top-[7.2cqh] left-[6.8cqw] z-10 max-w-[24ch] text-[clamp(1.35rem,3cqw,2.65rem)] leading-[1.12] font-bold tracking-normal text-balance max-md:top-[10%] max-md:left-[5cqw] max-md:max-w-[20ch] max-md:text-[0.82rem]">
        {title}
      </h1>
      <PresentationSolidModelViewer
        baseModelId={baseModelId}
        showCubeSwitch={showCubeSwitch}
        showGamutSelect={showGamutSelect}
      />
    </section>
  )
}

export function PresentationSolidModelViewer({
  baseModelId,
  showCubeSwitch = true,
  showGamutSelect = false,
}: PresentationSolidModelViewerProps) {
  const [cubeEnabled, setCubeEnabled] = useState(false)
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
  const gamutRendering = useMemo(
    () => resolveColorGamutRendering(gamutModeId, gamutCapabilities),
    [gamutCapabilities, gamutModeId]
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
      createColorSampleRenderOptions(
        gamutRendering.mode.id,
        gamutRendering.actualOutput.id
      )
    )
  }, [
    gamutRendering.actualOutput.id,
    gamutRendering.mode.id,
    model.id,
    slice,
    sliceEnabled,
  ])
  const hasControls = showGamutSelect || (showCubeSwitch && cubeSupported)

  useEffect(() => {
    setSlice(createPresentationSliceState(modelId))
    setSliceEnabled(false)
  }, [modelId])

  return (
    <div className="relative size-full min-h-0">
      <SolidColorSpaceModelCanvas
        autoRotate
        gamutRendering={gamutRendering}
        mesh={mesh}
        model={model}
        sliceMesh={sliceMesh}
        showGuides
        showStats={false}
        showWireframe
        surface="transparent"
        className="size-full min-h-0 md:min-h-0"
      />
      {slice ? (
        <div className="absolute bottom-[7.2cqh] left-[2cqw] z-20 grid w-[clamp(15.5rem,24cqw,19.5rem)] gap-2 rounded-md border border-border bg-background-primary/90 p-3 text-xs shadow-sm backdrop-blur max-md:bottom-[18%] max-md:left-[5cqw] max-md:w-[min(11rem,48cqw)] max-md:gap-1 max-md:p-1.5 max-md:text-[0.62rem]">
          <label className="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2 max-md:grid-cols-[4rem_minmax(0,1fr)] max-md:gap-1">
            <span className="font-medium text-text-muted">Slice</span>
            <Switch
              size="sm"
              checked={sliceEnabled}
              onCheckedChange={setSliceEnabled}
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

const PRESENTATION_GAMUT_MODE_IDS = [
  "srgb",
  "display-p3",
] as const satisfies readonly PresentationGamutModeId[]

function PresentationGamutSelect({
  onChange,
  value,
}: {
  readonly onChange: (value: PresentationGamutModeId) => void
  readonly value: PresentationGamutModeId
}) {
  const selectedMode = COLOR_GAMUT_MODE_BY_ID[value]

  return (
    <label className="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2">
      <span className="font-medium text-text-muted">표시 색영역</span>
      <Select
        value={value}
        onValueChange={(nextValue) => {
          if (isPresentationGamutModeId(nextValue)) {
            onChange(nextValue)
          }
        }}
      >
        <SelectTrigger
          size="sm"
          className="w-full justify-between bg-background-primary/75"
          aria-label="표시 색영역 선택"
        >
          <SelectValue aria-label={selectedMode.label}>
            {selectedMode.shortLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {PRESENTATION_GAMUT_MODE_IDS.map((modeId) => {
            const mode = COLOR_GAMUT_MODE_BY_ID[modeId]

            return (
              <SelectItem key={mode.id} value={mode.id}>
                {mode.shortLabel}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </label>
  )
}

function isPresentationGamutModeId(
  value: string
): value is PresentationGamutModeId {
  return PRESENTATION_GAMUT_MODE_IDS.some((modeId) => modeId === value)
}
