import type { ComponentType } from "react"

import {
  CssColorNotationSlide,
  IntroPresentationSlide,
} from "@/presentation/PresentationSlides"

export const PRESENTATION_SLIDE_IDS = [
  "intro",
  "css-color-notations",
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

const CSS_COLOR_NOTATION_PRESENTATION_SLIDE = {
  component: CssColorNotationSlide,
  id: "css-color-notations",
  title: "CSS의 다양한 색 표기법",
} satisfies PresentationSlide

export const PRESENTATION_SLIDES = [
  INTRO_PRESENTATION_SLIDE,
  CSS_COLOR_NOTATION_PRESENTATION_SLIDE,
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
