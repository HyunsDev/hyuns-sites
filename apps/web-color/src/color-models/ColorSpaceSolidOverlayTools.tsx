import { EyeOffIcon, PauseIcon, PlayIcon } from "lucide-react"

import { Button } from "@hyunsdev/ui/components/button"
import { ButtonGroup } from "@hyunsdev/ui/components/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@hyunsdev/ui/components/tooltip"
import { PlaygroundTools } from "@/playground/PlaygroundIndexPage"

type ColorSpaceSolidOverlayToolsProps = {
  readonly autoRotationEnabled: boolean
  readonly onAutoRotationToggle: () => void
  readonly onHide: () => void
}

export function ColorSpaceSolidOverlayTools({
  autoRotationEnabled,
  onAutoRotationToggle,
  onHide,
}: ColorSpaceSolidOverlayToolsProps) {
  const rotationLabel = autoRotationEnabled
    ? "자동 회전 일시정지"
    : "자동 회전 재생"
  const RotationIcon = autoRotationEnabled ? PauseIcon : PlayIcon

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <PlaygroundTools />
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={rotationLabel}
              aria-pressed={!autoRotationEnabled}
              onClick={onAutoRotationToggle}
            >
              <RotationIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{rotationLabel} (Space)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="UI 숨기기"
              onClick={onHide}
            >
              <EyeOffIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>UI 숨기기 (Enter)</TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </div>
  )
}
