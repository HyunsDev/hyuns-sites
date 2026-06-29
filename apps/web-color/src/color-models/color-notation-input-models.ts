import { formatHex } from "culori"

import { parseCssColorInput } from "./css-color-notation-models.ts"

export type ColorNotationInputState =
  | {
      readonly status: "parsed"
      readonly swatchColor: string
    }
  | {
      readonly status: "invalid"
    }

export function getColorNotationInputState(
  value: string
): ColorNotationInputState {
  const parsed = parseCssColorInput(value)

  if (parsed.status === "invalid") {
    return { status: "invalid" }
  }

  return {
    status: "parsed",
    swatchColor: formatHex(parsed.color),
  }
}
