import { useEffect, useMemo, useRef } from "react"

import { cn } from "@hyunsdev/ui/lib/utils"

import {
  createLabGamutPlane,
  type LabGamutPlane,
  type LabGamutPlaneCell,
} from "@/presentation/presentation-lab-gamut-plane"

const AXIS_LABEL_COLOR = "rgb(148 163 184)"
const BOUNDARY_COLOR = "rgba(255, 255, 255, 0.88)"
const GRID_COLOR = "rgba(148, 163, 184, 0.26)"
const OUTSIDE_FILL = "rgba(148, 163, 184, 0.08)"
const TEXT_FONT = "600 11px ui-monospace, SFMono-Regular, Menlo, monospace"

type LabGamutPlaneCanvasProps = {
  readonly className?: string
}

export function LabGamutPlaneCanvas({ className }: LabGamutPlaneCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const plane = useMemo(
    () => createLabGamutPlane({ axisLimit: 120, lightness: 50, size: 112 }),
    []
  )

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current

    if (!host || !canvas) {
      return
    }

    let resizeFrameId = 0
    const resize = () => {
      resizeFrameId = 0
      drawLabGamutPlane(canvas, host, plane)
    }
    const queueResize = () => {
      if (resizeFrameId !== 0) {
        return
      }

      resizeFrameId = window.requestAnimationFrame(resize)
    }
    const resizeObserver = new ResizeObserver(queueResize)
    resizeObserver.observe(host)
    queueResize()

    return () => {
      if (resizeFrameId !== 0) {
        window.cancelAnimationFrame(resizeFrameId)
      }
      resizeObserver.disconnect()
    }
  }, [plane])

  return (
    <div
      ref={hostRef}
      className={cn(
        "relative min-h-[360px] overflow-hidden rounded-md border border-border bg-background-primary/84",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-label="CIE Lab L*=50 section of the sRGB gamut"
        className="block size-full"
      />
      <div className="pointer-events-none absolute top-3 left-3 hidden flex-wrap items-center gap-2 lg:flex">
        <span className="rounded-md border border-border bg-background-primary/85 px-2 py-1 font-mono text-[0.65rem] text-text-normal shadow-sm backdrop-blur">
          CIE Lab
        </span>
        <span className="rounded-md border border-border bg-background-primary/85 px-2 py-1 font-mono text-[0.65rem] text-text-muted shadow-sm backdrop-blur">
          L*=50 / sRGB
        </span>
      </div>
    </div>
  )
}

function drawLabGamutPlane(
  canvas: HTMLCanvasElement,
  host: HTMLDivElement,
  plane: LabGamutPlane
) {
  const width = Math.max(1, Math.floor(host.clientWidth))
  const height = Math.max(1, Math.floor(host.clientHeight))
  const pixelRatio = Math.min(window.devicePixelRatio, 2)
  const context = canvas.getContext("2d")

  if (!context) {
    return
  }

  canvas.width = Math.floor(width * pixelRatio)
  canvas.height = Math.floor(height * pixelRatio)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.clearRect(0, 0, width, height)

  const chart = getChartBox(width, height)
  drawOutsidePlane(context, chart)
  drawCells(context, chart, plane)
  drawBoundary(context, chart, plane)
  drawAxes(context, chart, plane.axisLimit)
}

function getChartBox(width: number, height: number) {
  const padding = Math.max(34, Math.min(width, height) * 0.09)
  const size = Math.max(1, Math.min(width, height) - padding * 2)

  return {
    left: (width - size) / 2,
    top: (height - size) / 2,
    size,
  }
}

function drawOutsidePlane(
  context: CanvasRenderingContext2D,
  chart: ReturnType<typeof getChartBox>
) {
  context.fillStyle = OUTSIDE_FILL
  context.fillRect(chart.left, chart.top, chart.size, chart.size)
}

function drawCells(
  context: CanvasRenderingContext2D,
  chart: ReturnType<typeof getChartBox>,
  plane: LabGamutPlane
) {
  const cellSize = chart.size / plane.size

  for (const cell of plane.cells) {
    if (!cell.color) {
      continue
    }

    context.fillStyle = cell.color
    context.fillRect(
      chart.left + cell.column * cellSize,
      chart.top + cell.row * cellSize,
      Math.ceil(cellSize),
      Math.ceil(cellSize)
    )
  }
}

function drawBoundary(
  context: CanvasRenderingContext2D,
  chart: ReturnType<typeof getChartBox>,
  plane: LabGamutPlane
) {
  const cellSize = chart.size / plane.size

  context.fillStyle = BOUNDARY_COLOR
  for (const cell of plane.cells) {
    if (!cell.isBoundary) {
      continue
    }

    drawBoundaryCell(context, chart, cell, cellSize)
  }
}

function drawBoundaryCell(
  context: CanvasRenderingContext2D,
  chart: ReturnType<typeof getChartBox>,
  cell: LabGamutPlaneCell,
  cellSize: number
) {
  const radius = Math.max(1, cellSize * 0.42)
  const x = chart.left + (cell.column + 0.5) * cellSize
  const y = chart.top + (cell.row + 0.5) * cellSize

  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
}

function drawAxes(
  context: CanvasRenderingContext2D,
  chart: ReturnType<typeof getChartBox>,
  axisLimit: number
) {
  const center = chart.left + chart.size / 2
  const middle = chart.top + chart.size / 2

  context.strokeStyle = GRID_COLOR
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(chart.left, middle)
  context.lineTo(chart.left + chart.size, middle)
  context.moveTo(center, chart.top)
  context.lineTo(center, chart.top + chart.size)
  context.stroke()

  context.strokeStyle = GRID_COLOR
  context.strokeRect(chart.left, chart.top, chart.size, chart.size)
  context.fillStyle = AXIS_LABEL_COLOR
  context.font = TEXT_FONT
  context.textBaseline = "middle"
  context.fillText("a*", chart.left + chart.size + 8, middle)
  context.fillText("b*", center + 8, chart.top - 12)
  context.fillText(`-${axisLimit}`, chart.left - 28, middle)
  context.fillText(`${axisLimit}`, chart.left + chart.size + 8, middle + 18)
}
