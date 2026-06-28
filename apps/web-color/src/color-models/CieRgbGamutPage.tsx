import { useMemo, useState } from "react"

import { CieRgbGamutCanvas } from "@/color-models/CieRgbGamutCanvas"
import {
  CieRgbInputPanel,
  CieRgbIntroPanel,
  CieRgbPreviewColumn,
} from "@/color-models/CieRgbGamutPanels"
import {
  DEFAULT_CIE_RGB_INPUT,
  createCieRgbGamutComparison,
} from "@/color-models/cie-rgb-gamut-models"
import type { CieRgbChannelId, CieRgbInputFields } from "@/color-models/cie-rgb-gamut-models"
import { PlaygroundTools } from "@/playground/PlaygroundIndexPage"
import { PlaygroundStage } from "@/playground/PlaygroundRoute"

export function CieRgbGamutPage() {
  const [fields, setFields] =
    useState<CieRgbInputFields>(DEFAULT_CIE_RGB_INPUT)
  const comparison = useMemo(
    () => createCieRgbGamutComparison(fields),
    [fields]
  )
  const chartPoints = comparison.status === "parsed" ? comparison.points : []

  function handleChannelChange(channelId: CieRgbChannelId, value: string) {
    setFields((current) => {
      switch (channelId) {
        case "r":
          return { ...current, r: value }
        case "g":
          return { ...current, g: value }
        case "b":
          return { ...current, b: value }
        default:
          return assertNeverChannel(channelId)
      }
    })
  }

  return (
    <PlaygroundStage
      topStart={<CieRgbIntroPanel />}
      topEnd={
        <CieRgbInputPanel
          comparison={comparison}
          fields={fields}
          onChannelChange={handleChannelChange}
          onPresetSelect={setFields}
        />
      }
      startPanel={<CieRgbPreviewColumn comparison={comparison} />}
      bottomEnd={
        <div className="hidden sm:block">
          <PlaygroundTools />
        </div>
      }
    >
      <CieRgbGamutCanvas
        points={chartPoints}
        className="size-full min-h-0 rounded-none border-0 bg-background-primary/70 shadow-none md:min-h-0"
      />
    </PlaygroundStage>
  )
}

function assertNeverChannel(channelId: never): never {
  throw new RangeError(`Unknown RGB channel: ${channelId}`)
}
