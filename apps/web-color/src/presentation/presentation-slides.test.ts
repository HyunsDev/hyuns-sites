import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const PRESENTATION_SLIDES_SOURCE = readFileSync(
  new URL("./presentation-slides.ts", import.meta.url),
  "utf8"
)

test("presentation deck places color model overview before RGB intro", () => {
  const agendaIndex = PRESENTATION_SLIDES_SOURCE.indexOf("\"agenda\"")
  const colorModelsIndex =
    PRESENTATION_SLIDES_SOURCE.indexOf("\"color-models\"")
  const rgbIntroIndex = PRESENTATION_SLIDES_SOURCE.indexOf("\"rgb-intro\"")

  assert.ok(colorModelsIndex > 0)
  assert.ok(agendaIndex < colorModelsIndex)
  assert.ok(colorModelsIndex < rgbIntroIndex)
})

test("presentation deck explains gamut after out of gamut", () => {
  const outOfGamutIndex = PRESENTATION_SLIDES_SOURCE.indexOf("\"out-of-gamut\"")
  const gamutConceptIndex =
    PRESENTATION_SLIDES_SOURCE.indexOf("\"gamut-concept\"")
  const rgbGamutCubeIndex =
    PRESENTATION_SLIDES_SOURCE.indexOf("\"rgb-gamut-cube\"")
  const perceptualGamutShapeIndex = PRESENTATION_SLIDES_SOURCE.indexOf(
    "\"perceptual-gamut-shape\""
  )
  const part1SummaryIndex =
    PRESENTATION_SLIDES_SOURCE.indexOf("\"part-1-summary\"")

  assert.ok(outOfGamutIndex > 0)
  assert.ok(outOfGamutIndex < gamutConceptIndex)
  assert.ok(gamutConceptIndex < rgbGamutCubeIndex)
  assert.ok(rgbGamutCubeIndex < perceptualGamutShapeIndex)
  assert.ok(perceptualGamutShapeIndex < part1SummaryIndex)
})
