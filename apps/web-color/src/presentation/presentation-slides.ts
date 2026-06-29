import type { ComponentType } from "react"

import {
  AgendaPresentationSlide,
  IntroPresentationSlide,
  RgbIntroPresentationSlide,
} from "@/presentation/PresentationSlides"
import {
  AxisPalettesSlide,
  HslHsvIntroPresentationSlide,
  HslLightnessTrapSlide,
  HslModelSlide,
  HslVsHsvSlide,
  HsvModelSlide,
  HsvPickerSlide,
  RgbDerivedLimitsSlide,
} from "@/presentation/PresentationHslHsvSlides"
import {
  LabModelSlide,
  LabToOklabSlide,
  LchModelSlide,
  OklchModelSlide,
  OutOfGamutSlide,
  Part1SummarySlide,
  PerceptualModelsSlide,
} from "@/presentation/PresentationPerceptualSlides"
import {
  RgbLimitsSlide,
  RgbModelSlide,
  RgbStrengthsSlide,
} from "@/presentation/PresentationRgbModelSlide"

export const PRESENTATION_SLIDE_IDS = [
  "intro",
  "agenda",
  "rgb-intro",
  "rgb-model",
  "rgb-strengths",
  "rgb-limits",
  "hsl-hsv-intro",
  "hsl-model",
  "hsv-model",
  "hsv-picker",
  "hsl-vs-hsv",
  "axis-palettes",
  "hsl-lightness-trap",
  "rgb-derived-limits",
  "perceptual-models",
  "lab-model",
  "lch-model",
  "out-of-gamut",
  "lab-to-oklab",
  "oklch-model",
  "part-1-summary",
] as const

export type PresentationSlideId = (typeof PRESENTATION_SLIDE_IDS)[number]

export type PresentationSlide = {
  readonly component: ComponentType
  readonly id: PresentationSlideId
  readonly title: string
}

export type PresentationNavigation = {
  readonly currentIndex: number
  readonly nextSlideId: PresentationSlideId | null
  readonly previousSlideId: PresentationSlideId | null
  readonly slideCount: number
}

const FALLBACK_PRESENTATION_SLIDE = {
  component: IntroPresentationSlide,
  id: "intro",
  title: "RGB부터 OKLCH까지",
} satisfies PresentationSlide

export const PRESENTATION_SLIDES = [
  FALLBACK_PRESENTATION_SLIDE,
  { component: AgendaPresentationSlide, id: "agenda", title: "오늘의 지도" },
  { component: RgbIntroPresentationSlide, id: "rgb-intro", title: "RGB" },
  {
    component: RgbModelSlide,
    id: "rgb-model",
    title: "RGB: 기계가 좋아하는 색 모델",
  },
  { component: RgbStrengthsSlide, id: "rgb-strengths", title: "RGB의 장점" },
  { component: RgbLimitsSlide, id: "rgb-limits", title: "RGB의 한계" },
  {
    component: HslHsvIntroPresentationSlide,
    id: "hsl-hsv-intro",
    title: "HSL과 HSV",
  },
  { component: HslModelSlide, id: "hsl-model", title: "HSL" },
  { component: HsvModelSlide, id: "hsv-model", title: "HSV" },
  { component: HsvPickerSlide, id: "hsv-picker", title: "HSV Color Picker" },
  { component: HslVsHsvSlide, id: "hsl-vs-hsv", title: "HSL vs HSV" },
  { component: AxisPalettesSlide, id: "axis-palettes", title: "왜 편리한가" },
  {
    component: HslLightnessTrapSlide,
    id: "hsl-lightness-trap",
    title: "HSL의 함정",
  },
  {
    component: RgbDerivedLimitsSlide,
    id: "rgb-derived-limits",
    title: "RGB 기반 색 모델의 한계",
  },
  {
    component: PerceptualModelsSlide,
    id: "perceptual-models",
    title: "지각 기반 색 모델의 대두",
  },
  { component: LabModelSlide, id: "lab-model", title: "Lab" },
  { component: LchModelSlide, id: "lch-model", title: "LCH" },
  { component: OutOfGamutSlide, id: "out-of-gamut", title: "Out of gamut" },
  { component: LabToOklabSlide, id: "lab-to-oklab", title: "Lab에서 Oklab으로" },
  { component: OklchModelSlide, id: "oklch-model", title: "OKLCH" },
  { component: Part1SummarySlide, id: "part-1-summary", title: "1부 정리" },
] satisfies readonly PresentationSlide[]

export const FIRST_PRESENTATION_SLIDE_ID = "intro" satisfies PresentationSlideId

export function isPresentationSlideId(
  value: string
): value is PresentationSlideId {
  return PRESENTATION_SLIDE_IDS.some((slideId) => slideId === value)
}

export function resolvePresentationSlideId(
  value: string | undefined
): PresentationSlideId {
  if (!value) {
    return FIRST_PRESENTATION_SLIDE_ID
  }

  const foundSlideId = PRESENTATION_SLIDE_IDS.find(
    (slideId) => slideId === value
  )

  return foundSlideId ?? FIRST_PRESENTATION_SLIDE_ID
}

export function getPresentationSlide(
  slideId: PresentationSlideId
): PresentationSlide {
  const slide = PRESENTATION_SLIDES.find((item) => item.id === slideId)

  if (slide) {
    return slide
  }

  return FALLBACK_PRESENTATION_SLIDE
}

export function getPresentationNavigation(
  slideId: PresentationSlideId
): PresentationNavigation {
  const currentIndex = PRESENTATION_SLIDES.findIndex(
    (slide) => slide.id === slideId
  )
  const safeIndex = currentIndex < 0 ? 0 : currentIndex
  const previousSlide = PRESENTATION_SLIDES[safeIndex - 1]
  const nextSlide = PRESENTATION_SLIDES[safeIndex + 1]

  return {
    currentIndex: safeIndex,
    nextSlideId: nextSlide ? nextSlide.id : null,
    previousSlideId: previousSlide ? previousSlide.id : null,
    slideCount: PRESENTATION_SLIDES.length,
  }
}

export function buildPresentationSlideHref(slideId: PresentationSlideId) {
  return `/presentation/${slideId}`
}
