import type { ArduinoRgb } from "@/arduino-rgb/arduino-rgb-models"

export const ARDUINO_RGB_BAUD_RATE = 115_200

export type ArduinoRgbResponse =
  | {
      readonly kind: "error"
      readonly message: string
    }
  | {
      readonly kind: "ok"
      readonly rgb: ArduinoRgb
    }
  | {
      readonly kind: "ready"
    }
  | {
      readonly kind: "status"
      readonly rgb: ArduinoRgb
    }
  | {
      readonly kind: "unknown"
      readonly line: string
    }

export function formatRgbCommand(rgb: ArduinoRgb): string {
  return `${rgb.r},${rgb.g},${rgb.b}\n`
}

export function parseArduinoRgbResponse(line: string): ArduinoRgbResponse {
  const trimmed = line.trim()

  if (trimmed === "RGB READY") {
    return { kind: "ready" }
  }

  if (trimmed.startsWith("ERR ")) {
    return { kind: "error", message: trimmed.slice(4) }
  }

  if (trimmed.startsWith("OK ")) {
    const rgb = parseRgbValues(trimmed.slice(3))

    return rgb ? { kind: "ok", rgb } : { kind: "unknown", line: trimmed }
  }

  if (trimmed.startsWith("RGB ")) {
    const rgb = parseRgbValues(trimmed.slice(4))

    return rgb ? { kind: "status", rgb } : { kind: "unknown", line: trimmed }
  }

  return { kind: "unknown", line: trimmed }
}

function parseRgbValues(text: string): ArduinoRgb | null {
  const parts = text.split(",")

  if (parts.length !== 3) {
    return null
  }

  const r = parseByte(parts[0])
  const g = parseByte(parts[1])
  const b = parseByte(parts[2])

  if (r === null || g === null || b === null) {
    return null
  }

  return { r, g, b }
}

function parseByte(text: string | undefined): number | null {
  if (text === undefined) {
    return null
  }

  const trimmed = text.trim()

  if (!/^\d{1,3}$/.test(trimmed)) {
    return null
  }

  const value = Number.parseInt(trimmed, 10)

  if (value < 0 || value > 255) {
    return null
  }

  return value
}
