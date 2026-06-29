import { useMemo, useState } from "react"

import {
  detectColorGamutCapabilities,
  resolveColorGamutRendering,
} from "@/color-models/color-gamut"
import type { ColorGamutCapabilities } from "@/color-models/color-gamut"
import { COLOR_SPACE_MODEL_BY_ID } from "@/color-models/color-space-models"
import { buildSolidColorSpaceMesh } from "@/color-models/color-space-solid-mesh"
import { SolidColorSpaceModelCanvas } from "@/color-models/SolidColorSpaceModelCanvas"

export function PresentationSolidModelVisual() {
  const [gamutCapabilities] = useState<ColorGamutCapabilities>(() =>
    detectColorGamutCapabilities()
  )
  const model = COLOR_SPACE_MODEL_BY_ID.oklch
  const gamutRendering = useMemo(
    () => resolveColorGamutRendering("srgb", gamutCapabilities),
    [gamutCapabilities]
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

  return (
    <div className="pointer-events-auto absolute top-[5%] left-1/2 h-[68%] w-[38%] min-w-44 -translate-x-1/2">
      <SolidColorSpaceModelCanvas
        autoRotate
        gamutRendering={gamutRendering}
        mesh={mesh}
        model={model}
        showGuides={false}
        showWireframe
        className="size-full min-h-0 rounded-none border-0 bg-transparent shadow-none md:min-h-0"
      />
    </div>
  )
}
