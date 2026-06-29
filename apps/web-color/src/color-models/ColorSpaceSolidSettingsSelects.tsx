import type { ElementType } from "react"
import {
  Axis3dIcon,
  BlendIcon,
  BoxIcon,
  CircleDotIcon,
  ConeIcon,
  CylinderIcon,
  OrbitIcon,
  Scale3dIcon,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hyunsdev/ui/components/select"
import {
  COLOR_GAMUT_MODE_BY_ID,
  COLOR_GAMUT_MODES,
  resolveColorGamutRendering,
} from "@/color-models/color-gamut"
import type {
  ColorGamutCapabilities,
  ColorGamutModeDefinition,
  ColorGamutModeId,
  ColorGamutRendering,
  ColorGamutRenderStatus,
} from "@/color-models/color-gamut"
import { COLOR_SPACE_SOLID_MODELS } from "@/color-models/color-space-solid-models"
import type {
  BaseColorSpaceModelId,
  ColorSpaceModelId,
} from "@/color-models/color-space-models"
import { isHueCubeModelId } from "@/color-models/color-space-models"
import { cn } from "@hyunsdev/ui/lib/utils"

const MODEL_ICONS = {
  rgb: BoxIcon,
  hsl: CircleDotIcon,
  "hsl-cube": BoxIcon,
  hsv: ConeIcon,
  "hsv-cube": BoxIcon,
  hwb: BlendIcon,
  "hwb-cube": BoxIcon,
  xyz: Axis3dIcon,
  xyy: CircleDotIcon,
  lab: Axis3dIcon,
  lch: CylinderIcon,
  "lch-cube": BoxIcon,
  oklab: Scale3dIcon,
  oklch: OrbitIcon,
  "oklch-cube": BoxIcon,
} satisfies Record<ColorSpaceModelId, ElementType>

const SOLID_BASE_MODELS = COLOR_SPACE_SOLID_MODELS.filter(
  (model) => !isHueCubeModelId(model.id)
)

type ColorDotTone = "native" | "simulated"

export function GamutModeSelect({
  capabilities,
  isGamutModeSupported,
  onSelect,
  selectedGamutId,
}: {
  readonly capabilities: ColorGamutCapabilities
  readonly isGamutModeSupported: (gamutId: ColorGamutModeId) => boolean
  readonly onSelect: (gamutId: ColorGamutModeId) => void
  readonly selectedGamutId: ColorGamutModeId
}) {
  const selectedGamutMode = COLOR_GAMUT_MODE_BY_ID[selectedGamutId]
  const selectedGamutRendering = resolveColorGamutRendering(
    selectedGamutId,
    capabilities
  )

  return (
    <label className="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2">
      <span className="font-medium text-text-muted">표시 색영역</span>
      <Select
        value={selectedGamutId}
        onValueChange={(value) => {
          if (isColorGamutModeId(value)) {
            onSelect(value)
          }
        }}
      >
        <SelectTrigger
          size="sm"
          className="w-full justify-between bg-background-primary/75"
          aria-label="표시 색영역 선택"
        >
          <SelectValue aria-label={getGamutDisplayLabel(selectedGamutMode)}>
            <GamutOptionContent
              mode={selectedGamutMode}
              rendering={selectedGamutRendering}
            />
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {COLOR_GAMUT_MODES.map((mode) => (
            <GamutSelectItem
              key={mode.id}
              capabilities={capabilities}
              isSupported={isGamutModeSupported(mode.id)}
              mode={mode}
            />
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

export function SolidBaseModelSelect({
  onSelect,
  selectedBaseModelId,
}: {
  readonly onSelect: (modelId: BaseColorSpaceModelId) => void
  readonly selectedBaseModelId: BaseColorSpaceModelId
}) {
  return (
    <label className="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2">
      <span className="font-medium text-text-muted">모델</span>
      <Select
        value={selectedBaseModelId}
        onValueChange={(value) => {
          if (isSolidBaseModelId(value)) {
            onSelect(value)
          }
        }}
      >
        <SelectTrigger
          size="sm"
          className="w-full justify-between bg-background-primary/75"
          aria-label="Select solid color space model"
        >
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent position="popper">
          {SOLID_BASE_MODELS.map((model) => {
            const ModelIcon = MODEL_ICONS[model.id]

            return (
              <SelectItem key={model.id} value={model.id}>
                <ModelIcon />
                {model.name}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </label>
  )
}

function GamutSelectItem({
  capabilities,
  isSupported,
  mode,
}: {
  readonly capabilities: ColorGamutCapabilities
  readonly isSupported: boolean
  readonly mode: ColorGamutModeDefinition
}) {
  const rendering = resolveColorGamutRendering(mode.id, capabilities)

  return (
    <SelectItem key={mode.id} value={mode.id} disabled={!isSupported}>
      <GamutOptionContent mode={mode} rendering={rendering} />
    </SelectItem>
  )
}

function GamutOptionContent({
  mode,
  rendering,
}: {
  readonly mode: ColorGamutModeDefinition
  readonly rendering: ColorGamutRendering
}) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <ColorDot status={rendering.status} />
      <span className="truncate">{getGamutDisplayLabel(mode)}</span>
    </span>
  )
}

function ColorDot({ status }: { readonly status: ColorGamutRenderStatus }) {
  const tone = getColorDotTone(status)

  return (
    <span
      role="img"
      aria-label={tone}
      className={cn(
        "size-2 rounded-full ring-2 ring-background-primary",
        getColorDotClass(tone)
      )}
    />
  )
}

function isColorGamutModeId(value: string): value is ColorGamutModeId {
  return COLOR_GAMUT_MODES.some((mode) => mode.id === value)
}

function isSolidBaseModelId(value: string): value is BaseColorSpaceModelId {
  return SOLID_BASE_MODELS.some((model) => model.id === value)
}

function getColorDotTone(status: ColorGamutRenderStatus): ColorDotTone {
  switch (status) {
    case "actual":
      return "native"
    case "reference":
    case "simulated":
      return "simulated"
    default:
      return assertNeverStatus(status)
  }
}

function getColorDotClass(tone: ColorDotTone) {
  switch (tone) {
    case "native":
      return "bg-emerald-500"
    case "simulated":
      return "bg-amber-400"
    default:
      return assertNeverTone(tone)
  }
}

function getGamutDisplayLabel(mode: ColorGamutModeDefinition) {
  switch (mode.id) {
    case "srgb":
      return "sRGB"
    case "display-p3":
      return "Display P3"
    case "bt2020":
      return "BT 2020"
    case "cie-1931":
      return "CIE 1931"
    default:
      return assertNeverGamutMode(mode.id)
  }
}

function assertNeverStatus(status: never): never {
  throw new RangeError(`Unknown color gamut status: ${status}`)
}

function assertNeverTone(tone: never): never {
  throw new RangeError(`Unknown color dot tone: ${tone}`)
}

function assertNeverGamutMode(modeId: never): never {
  throw new RangeError(`Unknown color gamut mode: ${modeId}`)
}
