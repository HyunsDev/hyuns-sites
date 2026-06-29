const INTERACTIVE_KEYBOARD_TARGET_SELECTOR =
  'a, button, input, select, textarea, [contenteditable="true"], [role="button"], [role="combobox"], [role="slider"], [role="switch"]'

type ClosestCapableTarget = EventTarget & {
  readonly closest: (selector: string) => unknown
}

export type SolidModelKeyboardAction = "hide-ui" | "toggle-rotation"

export type SolidModelKeyboardEvent = {
  readonly code?: string
  readonly key: string
  readonly repeat: boolean
  readonly target: EventTarget | null
}

export function getSolidModelKeyboardAction({
  code,
  key,
  repeat,
  target,
}: SolidModelKeyboardEvent): SolidModelKeyboardAction | null {
  if (repeat || isInteractiveKeyboardTarget(target)) {
    return null
  }

  if (key === "Enter") {
    return "hide-ui"
  }

  if (key === " " || key === "Spacebar" || code === "Space") {
    return "toggle-rotation"
  }

  return null
}

export function isInteractiveKeyboardTarget(target: EventTarget | null) {
  return (
    isClosestCapableTarget(target) &&
    target.closest(INTERACTIVE_KEYBOARD_TARGET_SELECTOR) !== null
  )
}

function isClosestCapableTarget(
  target: EventTarget | null
): target is ClosestCapableTarget {
  return (
    target !== null &&
    "closest" in target &&
    typeof target.closest === "function"
  )
}
