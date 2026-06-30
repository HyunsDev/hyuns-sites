import { useMemo, useState } from "react"

import {
  detectColorGamutCapabilities,
  resolveColorGamutRendering,
} from "@/color-models/color-gamut"
import type { ColorGamutCapabilities } from "@/color-models/color-gamut"
import { createColorSampleRenderOptions } from "@/color-models/color-sample-rendering"
import { COLOR_SPACE_MODEL_BY_ID } from "@/color-models/color-space-models"
import type { ColorSpaceModelId } from "@/color-models/color-space-models"
import { createSolidColorSpaceHighlight } from "@/color-models/color-space-solid-highlight"
import { buildSolidColorSpaceMesh } from "@/color-models/color-space-solid-mesh"
import { SolidColorSpaceModelCanvas } from "@/color-models/SolidColorSpaceModelCanvas"
import { cn } from "@hyunsdev/ui/lib/utils"

type PresentationSolidModelVisualProps = {
  readonly className?: string
  readonly modelId?: ColorSpaceModelId
  readonly targetCssColor?: string
  readonly variant?: "hero" | "section"
}

export function PresentationSolidModelVisual({
  className,
  modelId = "oklch",
  targetCssColor,
  variant = "hero",
}: PresentationSolidModelVisualProps) {
  const [gamutCapabilities] = useState<ColorGamutCapabilities>(() =>
    detectColorGamutCapabilities()
  )
  const model = COLOR_SPACE_MODEL_BY_ID[modelId]
  const gamutRendering = useMemo(
    () => resolveColorGamutRendering("srgb", gamutCapabilities),
    [gamutCapabilities]
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
  const highlight = useMemo(() => {
    if (!targetCssColor) {
      return null
    }

    const result = createSolidColorSpaceHighlight({
      modelId: model.id,
      options: sampleRenderOptions,
      value: targetCssColor,
    })

    return result.status === "ready" ? result.highlight : null
  }, [model.id, sampleRenderOptions, targetCssColor])

  return (
    <div
      className={cn(
        variant === "section"
          ? "pointer-events-auto absolute top-[7%] left-1/2 h-[58%] w-[50%] min-w-56 -translate-x-1/2"
          : "pointer-events-auto absolute top-[-4%] left-1/2 h-[88%] w-[64%] min-w-64 -translate-x-1/2 mask-b-from-78% mask-b-to-92% dark:mask-none",
        className
      )}
    >
      <SolidColorSpaceModelCanvas
        autoRotate
        gamutRendering={gamutRendering}
        highlight={highlight}
        mesh={mesh}
        model={model}
        showGuides={false}
        showWireframe
        className={
          variant === "section"
            ? "size-full min-h-0 translate-y-[2%] scale-[1.08] rounded-none border-0 bg-transparent shadow-none md:min-h-0"
            : "size-full min-h-0 translate-y-[12%] scale-[1.36] rounded-none border-0 bg-transparent shadow-none md:min-h-0"
        }
      />
    </div>
  )
}
