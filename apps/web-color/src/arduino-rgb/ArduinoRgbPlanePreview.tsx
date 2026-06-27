import { useEffect, useRef } from "react"

import type { ColorModelDefinition } from "@/arduino-rgb/arduino-rgb-models"
import type { ColorModelPlane } from "@/arduino-rgb/arduino-rgb-plane-models"
import { drawArduinoRgbPlane } from "@/arduino-rgb/arduino-rgb-plane-rendering"
import { cn } from "@hyunsdev/ui/lib/utils"

const PREVIEW_WIDTH = 84
const PREVIEW_HEIGHT = 48

type ArduinoRgbPlanePreviewProps = {
  readonly active: boolean
  readonly model: ColorModelDefinition
  readonly onSelect: () => void
  readonly plane: ColorModelPlane
  readonly values: readonly number[]
}

export function ArduinoRgbPlanePreview({
  active,
  model,
  onSelect,
  plane,
  values,
}: ArduinoRgbPlanePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    if (!canvas || !context) {
      return
    }

    drawArduinoRgbPlane({
      context,
      height: PREVIEW_HEIGHT,
      model,
      plane,
      values,
      width: PREVIEW_WIDTH,
    })
  }, [model, plane, values])

  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "grid min-w-0 gap-1 rounded-md border p-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary",
        active
          ? "border-text-normal bg-background-secondary"
          : "border-border bg-background-primary/70 hover:bg-background-secondary/80"
      )}
      onClick={onSelect}
    >
      <canvas
        ref={canvasRef}
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
        className="h-12 w-full rounded-sm"
        aria-hidden="true"
      />
      <code className="truncate text-[0.65rem] leading-none text-text-normal">
        {plane.label}
      </code>
    </button>
  )
}
