import type { SerialConnectionState } from "@/arduino-rgb/useArduinoSerial"

export function connectionLabel(state: SerialConnectionState): string {
  switch (state) {
    case "connected":
      return "Connected"
    case "connecting":
      return "Connecting"
    case "disconnected":
      return "Disconnected"
    case "unsupported":
      return "Web Serial unsupported"
    default:
      return assertNeverConnectionState(state)
  }
}

function assertNeverConnectionState(state: never): never {
  throw new RangeError(`Unknown Arduino serial state: ${state}`)
}
