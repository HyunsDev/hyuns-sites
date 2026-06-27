import { Switch } from "@hyunsdev/ui/components/switch"
import {
  GamutModeSelect,
  SolidBaseModelSelect,
} from "@/color-models/ColorSpaceSolidSettingsSelects"
import { ColorSpaceSolidSliceControls } from "@/color-models/ColorSpaceSolidSliceControls"
import type {
  ColorGamutCapabilities,
  ColorGamutModeId,
} from "@/color-models/color-gamut"
import { isSolidSliceModel } from "@/color-models/color-space-solid-slice"
import type { SolidSliceState } from "@/color-models/color-space-solid-slice"
import type {
  BaseColorSpaceModelId,
  ColorSpaceModelId,
} from "@/color-models/color-space-models"
import { cn } from "@hyunsdev/ui/lib/utils"

type ColorSpaceSolidSettingsPanelProps = {
  readonly capabilities: ColorGamutCapabilities
  readonly className?: string
  readonly cubeEnabled: boolean
  readonly cubeSupported: boolean
  readonly isGamutModeSupported: (gamutId: ColorGamutModeId) => boolean
  readonly onCubeEnabledChange: (enabled: boolean) => void
  readonly onGamutSelect: (gamutId: ColorGamutModeId) => void
  readonly onModelSelect: (modelId: BaseColorSpaceModelId) => void
  readonly onSliceChange: (slice: SolidSliceState) => void
  readonly onSliceEnabledChange: (enabled: boolean) => void
  readonly onWireframeChange: (enabled: boolean) => void
  readonly selectedBaseModelId: BaseColorSpaceModelId
  readonly selectedGamutId: ColorGamutModeId
  readonly selectedModelId: ColorSpaceModelId
  readonly showSlice: boolean
  readonly showWireframe: boolean
  readonly slice: SolidSliceState
}

export function ColorSpaceSolidSettingsPanel({
  capabilities,
  className,
  cubeEnabled,
  cubeSupported,
  isGamutModeSupported,
  onCubeEnabledChange,
  onGamutSelect,
  onModelSelect,
  onSliceChange,
  onSliceEnabledChange,
  onWireframeChange,
  selectedBaseModelId,
  selectedGamutId,
  selectedModelId,
  showSlice,
  showWireframe,
  slice,
}: ColorSpaceSolidSettingsPanelProps) {
  const sliceSupported = isSolidSliceModel(selectedModelId)

  return (
    <section
      aria-label="3D solid model settings"
      className={cn(
        "grid max-h-[calc(100svh-1.5rem)] w-[min(100vw-1.5rem,24rem)] gap-2 overflow-y-auto rounded-md border border-border bg-background-primary/90 p-3 text-xs shadow-sm backdrop-blur",
        className
      )}
    >
      <GamutModeSelect
        capabilities={capabilities}
        isGamutModeSupported={isGamutModeSupported}
        selectedGamutId={selectedGamutId}
        onSelect={onGamutSelect}
      />
      <SolidBaseModelSelect
        selectedBaseModelId={selectedBaseModelId}
        onSelect={onModelSelect}
      />
      <SettingsSwitchRow
        label="Cube로 표시"
        ariaLabel="Toggle cube coordinate model"
        checked={cubeEnabled}
        disabled={!cubeSupported}
        onCheckedChange={onCubeEnabledChange}
      />
      <SettingsSwitchRow
        label="Wireframe"
        ariaLabel="Toggle wireframe overlay"
        checked={showWireframe}
        onCheckedChange={onWireframeChange}
      />
      <SettingsSwitchRow
        label="Slice"
        ariaLabel="Toggle slice plane"
        checked={showSlice && sliceSupported}
        disabled={!sliceSupported}
        onCheckedChange={onSliceEnabledChange}
      />

      {showSlice && sliceSupported && (
        <ColorSpaceSolidSliceControls
          className="mt-1"
          modelId={selectedModelId}
          slice={slice}
          sliceEnabled={showSlice}
          onSliceChange={onSliceChange}
        />
      )}
    </section>
  )
}

function SettingsSwitchRow({
  ariaLabel,
  checked,
  disabled = false,
  label,
  onCheckedChange,
}: {
  readonly ariaLabel: string
  readonly checked: boolean
  readonly disabled?: boolean
  readonly label: string
  readonly onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label
      className={cn(
        "grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2",
        disabled && "opacity-60"
      )}
    >
      <span className="font-medium text-text-muted">{label}</span>
      <Switch
        size="sm"
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={ariaLabel}
        className="justify-self-end"
      />
    </label>
  )
}
