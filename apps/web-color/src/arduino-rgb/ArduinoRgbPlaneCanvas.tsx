import type { KeyboardEvent, PointerEvent } from "react"
import { useEffect, useRef } from "react"

import type { ColorModelDefinition } from "@/arduino-rgb/arduino-rgb-models"
import { nudgeModelAxisValue } from "@/arduino-rgb/arduino-rgb-axis-values"
import type { ColorModelPlane } from "@/arduino-rgb/arduino-rgb-plane-models"
import {
  getModelPlaneMarkerPosition,
  setModelPlaneValues,
} from "@/arduino-rgb/arduino-rgb-plane-models"
import { drawArduinoRgbPlane } from "@/arduino-rgb/arduino-rgb-plane-rendering"
import { cn } from "@hyunsdev/ui/lib/utils"

const PLANE_SIZE = 224

type ArduinoRgbPlaneCanvasProps = {
  readonly className?: string
  readonly model: ColorModelDefinition
  readonly onValuesChange: (values: readonly number[]) => void
  readonly plane: ColorModelPlane
  readonly values: readonly number[]
}

export function ArduinoRgbPlaneCanvas({
  className,
  model,
  onValuesChange,
  plane,
  values,
}: ArduinoRgbPlaneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")

    if (!canvas || !context) {
      return
    }

    drawArduinoRgbPlane({
      context,
      height: PLANE_SIZE,
      model,
      plane,
      values,
      width: PLANE_SIZE,
    })
  }, [model, plane, values])

  const marker = getModelPlaneMarkerPosition({ model, plane, values })

  const updateFromPointer = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const rect = canvas.getBoundingClientRect()

    onValuesChange(
      setModelPlaneValues({
        model,
        plane,
        values,
        xRatio: (event.clientX - rect.left) / rect.width,
        yRatio: (event.clientY - rect.top) / rect.height,
      })
    )
  }

  const updateFromKeyboard = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const direction = event.shiftKey ? 10 : 1

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        onValuesChange(
          nudgeModelAxisValue({
            axisIndex: plane.xAxisIndex,
            direction: -direction,
            model,
            values,
          })
        )
        return
      case "ArrowRight":
        event.preventDefault()
        onValuesChange(
          nudgeModelAxisValue({
            axisIndex: plane.xAxisIndex,
            direction,
            model,
            values,
          })
        )
        return
      case "ArrowDown":
        event.preventDefault()
        onValuesChange(
          nudgeModelAxisValue({
            axisIndex: plane.yAxisIndex,
            direction: -direction,
            model,
            values,
          })
        )
        return
      case "ArrowUp":
        event.preventDefault()
        onValuesChange(
          nudgeModelAxisValue({
            axisIndex: plane.yAxisIndex,
            direction,
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
        "relative aspect-square overflow-hidden rounded-md border border-border bg-background-primary shadow-sm",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        width={PLANE_SIZE}
        height={PLANE_SIZE}
        tabIndex={0}
        className="size-full touch-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
        aria-label={`${model.label} ${plane.label} coordinate plane`}
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
        className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.85)]"
        style={{
          left: `${marker.x * 100}%`,
          top: `${marker.y * 100}%`,
        }}
      />
    </div>
  )
}
