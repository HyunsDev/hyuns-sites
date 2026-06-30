import type { ComponentProps } from "react"

import { ColorSpaceSolidTargetInput } from "@/color-models/ColorSpaceSolidTargetInput"
import { COLOR_GAMUT_MODE_BY_ID } from "@/color-models/color-gamut"
import type { ColorGamutModeId } from "@/color-models/color-gamut"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hyunsdev/ui/components/select"
import { cn } from "@hyunsdev/ui/lib/utils"

export type PresentationGamutModeId = Extract<
  ColorGamutModeId,
  "srgb" | "display-p3"
>

const PRESENTATION_GAMUT_MODE_IDS = [
  "srgb",
  "display-p3",
] as const satisfies readonly PresentationGamutModeId[]

export function PresentationSolidModelTargetInput({
  className,
  enabled,
  modelId,
  onChange,
  onEnabledChange,
  result,
  showSwitch,
  value,
}: ComponentProps<typeof ColorSpaceSolidTargetInput>) {
  return (
    <ColorSpaceSolidTargetInput
      className={cn(
        "max-md:[&>label]:grid-cols-[4rem_minmax(0,1fr)] max-md:[&>label]:gap-1 max-md:[&_span]:truncate max-md:[&_input]:h-7 max-md:[&_input]:text-[0.58rem]",
        className
      )}
      enabled={enabled}
      modelId={modelId}
      showSwitch={showSwitch}
      value={value}
      result={result}
      onEnabledChange={onEnabledChange}
      onChange={onChange}
    />
  )
}

export function PresentationGamutSelect({
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
