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

export const FIRST_PRESENTATION_SLIDE_ID = "intro" satisfies PresentationSlideId

const INTRO_PRESENTATION_SLIDE = {
  component: IntroPresentationSlide,
  id: "intro",
  title: "RGB부터 OKLCH까지",
} satisfies PresentationSlide

const AGENDA_PRESENTATION_SLIDE = {
  component: AgendaPresentationSlide,
  id: "agenda",
  title: "오늘의 지도",
} satisfies PresentationSlide

const RGB_INTRO_PRESENTATION_SLIDE = {
  component: RgbIntroPresentationSlide,
  id: "rgb-intro",
  title: "RGB",
} satisfies PresentationSlide

const RGB_MODEL_PRESENTATION_SLIDE = {
  component: RgbModelSlide,
  id: "rgb-model",
  title: "RGB: 기계가 좋아하는 색 모델",
} satisfies PresentationSlide

const RGB_STRENGTHS_PRESENTATION_SLIDE = {
  component: RgbStrengthsSlide,
  id: "rgb-strengths",
  title: "RGB의 장점",
} satisfies PresentationSlide

const RGB_LIMITS_PRESENTATION_SLIDE = {
  component: RgbLimitsSlide,
  id: "rgb-limits",
  title: "RGB의 한계",
} satisfies PresentationSlide

const HSL_HSV_INTRO_PRESENTATION_SLIDE = {
  component: HslHsvIntroPresentationSlide,
  id: "hsl-hsv-intro",
  title: "HSL과 HSV",
} satisfies PresentationSlide

const HSL_MODEL_PRESENTATION_SLIDE = {
  component: HslModelSlide,
  id: "hsl-model",
  title: "HSL",
} satisfies PresentationSlide

const HSV_MODEL_PRESENTATION_SLIDE = {
  component: HsvModelSlide,
  id: "hsv-model",
  title: "HSV",
} satisfies PresentationSlide

const HSV_PICKER_PRESENTATION_SLIDE = {
  component: HsvPickerSlide,
  id: "hsv-picker",
  title: "HSV Color Picker",
} satisfies PresentationSlide

const HSL_VS_HSV_PRESENTATION_SLIDE = {
  component: HslVsHsvSlide,
  id: "hsl-vs-hsv",
  title: "HSL vs HSV",
} satisfies PresentationSlide

const AXIS_PALETTES_PRESENTATION_SLIDE = {
  component: AxisPalettesSlide,
  id: "axis-palettes",
  title: "왜 편리한가",
} satisfies PresentationSlide

const HSL_LIGHTNESS_TRAP_PRESENTATION_SLIDE = {
  component: HslLightnessTrapSlide,
  id: "hsl-lightness-trap",
  title: "HSL의 함정",
} satisfies PresentationSlide

const RGB_DERIVED_LIMITS_PRESENTATION_SLIDE = {
  component: RgbDerivedLimitsSlide,
  id: "rgb-derived-limits",
  title: "RGB 기반 색 모델의 한계",
} satisfies PresentationSlide

export const PRESENTATION_SLIDES = [
  INTRO_PRESENTATION_SLIDE,
  AGENDA_PRESENTATION_SLIDE,
  RGB_INTRO_PRESENTATION_SLIDE,
  RGB_MODEL_PRESENTATION_SLIDE,
  RGB_STRENGTHS_PRESENTATION_SLIDE,
  RGB_LIMITS_PRESENTATION_SLIDE,
  HSL_HSV_INTRO_PRESENTATION_SLIDE,
  HSL_MODEL_PRESENTATION_SLIDE,
  HSV_MODEL_PRESENTATION_SLIDE,
  HSV_PICKER_PRESENTATION_SLIDE,
  HSL_VS_HSV_PRESENTATION_SLIDE,
  AXIS_PALETTES_PRESENTATION_SLIDE,
  HSL_LIGHTNESS_TRAP_PRESENTATION_SLIDE,
  RGB_DERIVED_LIMITS_PRESENTATION_SLIDE,
] satisfies readonly PresentationSlide[]

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

  return INTRO_PRESENTATION_SLIDE
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
