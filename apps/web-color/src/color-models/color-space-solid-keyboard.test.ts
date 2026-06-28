import assert from "node:assert/strict"
import test from "node:test"

import {
  getSolidModelKeyboardAction,
  isInteractiveKeyboardTarget,
} from "./color-space-solid-keyboard.ts"

test("solid model keyboard action maps Enter to UI visibility", () => {
  assert.equal(
    getSolidModelKeyboardAction({
      key: "Enter",
      repeat: false,
      target: null,
    }),
    "hide-ui"
  )
})

test("solid model keyboard action maps Space to auto-rotation toggle", () => {
  assert.equal(
    getSolidModelKeyboardAction({
      code: "Space",
      key: " ",
      repeat: false,
      target: null,
    }),
    "toggle-rotation"
  )
  assert.equal(
    getSolidModelKeyboardAction({
      key: "Spacebar",
      repeat: false,
      target: null,
    }),
    "toggle-rotation"
  )
})

test("solid model keyboard action ignores repeats and interactive targets", () => {
  const interactiveTarget = Object.assign(new EventTarget(), {
    closest: () => ({}),
  })

  assert.equal(
    getSolidModelKeyboardAction({
      key: " ",
      repeat: true,
      target: null,
    }),
    null
  )
  assert.equal(
    getSolidModelKeyboardAction({
      key: " ",
      repeat: false,
      target: interactiveTarget,
    }),
    null
  )
  assert.equal(isInteractiveKeyboardTarget(interactiveTarget), true)
})
