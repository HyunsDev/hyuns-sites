import type { KeyboardEvent, PointerEvent } from "react"
import { useEffect, useRef } from "react"

import type { ColorModelDefinition } from "@/arduino-rgb/arduino-rgb-models"
import {
  getModelAxisRatio,
  getModelAxisValue,
  nudgeModelAxisValue,
  setModelAxisValueFromRatio,
} from "@/arduino-rgb/arduino-rgb-axis-values"
import { drawArduinoRgbAxisBar } from "@/arduino-rgb/arduino-rgb-plane-rendering"
import { cn } from "@hyunsdev/ui/lib/utils"

const BAR_WIDTH = 224
const BAR_HEIGHT = 30

type ArduinoRgbAxisBarProps = {
  readonly axisIndex: number
  readonly className?: string
  readonly model: ColorModelDefinition
  readonly onValuesChange: (values: readonly number[]) => void
  readonly values: readonly number[]
}

export function ArduinoRgbAxisBar({
  axisIndex,
  className,
  model,
  onValuesChange,
  values,
}: ArduinoRgbAxisBarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const axis = requireAxis(model, axisIndex)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    if (!canvas || !context) {
      return
    }

    drawArduinoRgbAxisBar({
      axisIndex,
      context,
      height: BAR_HEIGHT,
      model,
      values,
      width: BAR_WIDTH,
    })
  }, [axisIndex, model, values])

  const value = getModelAxisValue({ axis, axisIndex, values })
  const markerRatio = getModelAxisRatio({ axis, value })

  const updateFromPointer = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const rect = canvas.getBoundingClientRect()

    onValuesChange(
      setModelAxisValueFromRatio({
        axisIndex,
        model,
        ratio: (event.clientX - rect.left) / rect.width,
        values,
      })
    )
  }

  const updateFromKeyboard = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const stepScale = event.shiftKey ? 10 : 1

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault()
        onValuesChange(
          nudgeModelAxisValue({
            axisIndex,
            direction: -stepScale,
            model,
            values,
          })
        )
        return
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault()
        onValuesChange(
          nudgeModelAxisValue({
            axisIndex,
            direction: stepScale,
            model,
            values,
          })
        )
        return
      default:
        return
    }
  }

  return (
    <div
      className={cn(
        "relative h-8 overflow-hidden rounded-md border border-border bg-background-primary shadow-sm",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        width={BAR_WIDTH}
        height={BAR_HEIGHT}
        tabIndex={0}
        className="size-full touch-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
        aria-label={`${axis.label} fixed axis`}
        onKeyDown={updateFromKeyboard}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          updateFromPointer(event)
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) {
            updateFromPointer(event)
          }
        }}
      />
      <span
        className="pointer-events-none absolute top-0 h-full w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.85)]"
        style={{ left: `${markerRatio * 100}%` }}
      />
    </div>
  )
}

function requireAxis(
  model: ColorModelDefinition,
  axisIndex: number
): ColorModelDefinition["axes"][number] {
  const axis = model.axes[axisIndex]

  if (!axis) {
    throw new RangeError(`Missing axis ${axisIndex} for ${model.id}`)
  }

  return axis
}
