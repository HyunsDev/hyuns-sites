import assert from "node:assert/strict"
import test from "node:test"

import {
  createDefaultSolidModelViewState,
  rescaleSolidModelViewState,
} from "./solid-model-view-state.ts"

test("solid model view state scales the default camera position", () => {
  assert.deepEqual(createDefaultSolidModelViewState(2), {
    cameraPosition: [6.3, 4.4, 6.3],
    cameraScale: 2,
    target: [0, 0, 0],
  })
})

test("solid model view state preserves target while rescaling camera distance", () => {
  const viewState = {
    cameraPosition: [4, 2, 6],
    cameraScale: 2,
    target: [0.1, -0.2, 0.3],
  } as const

  assert.deepEqual(rescaleSolidModelViewState(viewState, 1), {
    cameraPosition: [2, 1, 3],
    cameraScale: 1,
    target: [0.1, -0.2, 0.3],
  })
})
