import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const PRESENTATION_SLIDES_SOURCE = readFileSync(
  new URL("./presentation-slides.ts", import.meta.url),
  "utf8"
)
const PRESENTATION_MAIN_SLIDES_SOURCE = readFileSync(
  new URL("./presentation-main-slides.ts", import.meta.url),
  "utf8"
)
const PRESENTATION_APPENDIX_SLIDES_SOURCE = readFileSync(
  new URL("./presentation-appendix-slides.ts", import.meta.url),
  "utf8"
)
const PRESENTATION_REGISTRY_SOURCE = [
  PRESENTATION_SLIDES_SOURCE,
  PRESENTATION_MAIN_SLIDES_SOURCE,
  PRESENTATION_APPENDIX_SLIDES_SOURCE,
].join("\n")
const HSL_OKLCH_SOLID_COMPARISON_SOURCE = readFileSync(
  new URL("./PresentationHslOklchSolidComparisonSlide.tsx", import.meta.url),
  "utf8"
)

test("presentation deck places color model overview before RGB intro", () => {
  const agendaIndex = PRESENTATION_MAIN_SLIDES_SOURCE.indexOf("\"agenda\"")
  const colorModelsIndex =
    PRESENTATION_MAIN_SLIDES_SOURCE.indexOf("\"color-models\"")
  const rgbIntroIndex = PRESENTATION_MAIN_SLIDES_SOURCE.indexOf("\"rgb-intro\"")

  assert.ok(colorModelsIndex > 0)
  assert.ok(agendaIndex < colorModelsIndex)
  assert.ok(colorModelsIndex < rgbIntroIndex)
})

test("presentation deck explains gamut after out of gamut", () => {
  const outOfGamutIndex =
    PRESENTATION_MAIN_SLIDES_SOURCE.indexOf("\"out-of-gamut\"")
  const hslOklchSolidComparisonIndex = PRESENTATION_MAIN_SLIDES_SOURCE.indexOf(
    "\"hsl-oklch-solid-comparison\""
  )
  const part1SummaryIndex =
    PRESENTATION_MAIN_SLIDES_SOURCE.indexOf("\"part-1-summary\"")

  assert.ok(outOfGamutIndex > 0)
  assert.ok(outOfGamutIndex < hslOklchSolidComparisonIndex)
  assert.ok(hslOklchSolidComparisonIndex < part1SummaryIndex)
})

test("presentation deck keeps gamut deep dives in appendix slides", () => {
  assert.match(PRESENTATION_REGISTRY_SOURCE, /id: "appendix-gamut-concept"/)
  assert.match(PRESENTATION_REGISTRY_SOURCE, /id: "appendix-rgb-gamut-cube"/)
  assert.match(
    PRESENTATION_REGISTRY_SOURCE,
    /id: "appendix-perceptual-gamut-shape"/
  )
  assert.doesNotMatch(
    PRESENTATION_MAIN_SLIDES_SOURCE,
    /"gamut-concept",\n\s+"rgb-gamut-cube"/
  )
})

test("presentation appendix contains first priority support slides", () => {
  const expectedAppendixSlideIds = [
    "appendix-presentation-scope",
    "appendix-terminology-map",
    "appendix-rgb-gamut-family",
    "appendix-hsl-lightness-formula",
    "appendix-perceptual-uniformity",
    "appendix-lch-polar-coordinates",
    "appendix-gamut-concept",
    "appendix-rgb-gamut-cube",
    "appendix-perceptual-gamut-shape",
    "appendix-oklch-chroma-limit",
    "appendix-oklch-contrast-check",
    "appendix-oklch-start-with-lightness",
    "appendix-oklch-hcl-roles",
    "appendix-oklch-chroma-strategies",
    "appendix-oklch-color-checklist",
  ]

  for (const slideId of expectedAppendixSlideIds) {
    assert.match(PRESENTATION_REGISTRY_SOURCE, new RegExp(`id: "${slideId}"`))
  }
})

test("HSL OKLCH solid comparison keeps CSS target always on without switch", () => {
  assert.match(
    HSL_OKLCH_SOLID_COMPARISON_SOURCE,
    /cubeDefaultEnabled=\{modelId === "oklch"\}/
  )
  assert.match(HSL_OKLCH_SOLID_COMPARISON_SOURCE, /targetDefaultEnabled/)
  assert.match(
    HSL_OKLCH_SOLID_COMPARISON_SOURCE,
    /showTargetSwitch=\{false\}/
  )
})
