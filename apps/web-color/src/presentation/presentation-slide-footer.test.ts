import assert from "node:assert/strict"
import test from "node:test"

import { getPresentationFooterModel } from "./presentation-slide-footer.ts"

test("getPresentationFooterModel hides the title slide footer", () => {
  const model = getPresentationFooterModel({
    currentIndex: 0,
    isAppendix: false,
    isPartTwo: false,
    isTitleSlide: true,
  })

  assert.equal(model, null)
})

test("getPresentationFooterModel formats part one slides", () => {
  const model = getPresentationFooterModel({
    currentIndex: 3,
    isAppendix: false,
    isPartTwo: false,
    isTitleSlide: false,
  })

  assert.deepEqual(model, {
    partLabel: "1부 RGB부터 OKLCH까지",
    slideNumber: "04",
  })
})

test("getPresentationFooterModel formats part two slides", () => {
  const model = getPresentationFooterModel({
    currentIndex: 21,
    isAppendix: false,
    isPartTwo: true,
    isTitleSlide: false,
  })

  assert.deepEqual(model, {
    partLabel: "2부 당신이 OKLCH를 써야 하는 이유",
    slideNumber: "22",
  })
})

test("getPresentationFooterModel formats appendix slides", () => {
  const model = getPresentationFooterModel({
    currentIndex: 20,
    isAppendix: true,
    isPartTwo: false,
    isTitleSlide: false,
  })

  assert.deepEqual(model, {
    partLabel: "부록",
    slideNumber: "21",
  })
})
