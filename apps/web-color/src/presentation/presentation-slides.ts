import type { ComponentType } from "react"

import {
  PRESENTATION_APPENDIX_SLIDE_IDS,
  PRESENTATION_APPENDIX_SLIDES,
  type PresentationAppendixSlideId,
} from "@/presentation/presentation-appendix-slides"
import {
  PRESENTATION_MAIN_SLIDE_IDS,
  PRESENTATION_MAIN_SLIDES,
  type PresentationMainSlideId,
} from "@/presentation/presentation-main-slides"

export const PRESENTATION_SLIDE_IDS = [
  ...PRESENTATION_MAIN_SLIDE_IDS,
  ...PRESENTATION_APPENDIX_SLIDE_IDS,
] as const
export { PRESENTATION_MAIN_SLIDE_IDS }

export type PresentationSlideId = (typeof PRESENTATION_SLIDE_IDS)[number]

type PresentationSlideBase = {
  readonly component: ComponentType
  readonly title: string
}

export type PresentationMainSlide = PresentationSlideBase & {
  readonly id: PresentationMainSlideId
  readonly kind: "main"
}

export type PresentationAppendixSlide = PresentationSlideBase & {
  readonly appendixFor: PresentationMainSlideId
  readonly id: PresentationAppendixSlideId
  readonly kind: "appendix"
  readonly selectLabel: string
}

export type PresentationSlide = PresentationMainSlide | PresentationAppendixSlide

export type PresentationNavigation = {
  readonly currentIndex: number
  readonly nextSlideId: PresentationMainSlideId | null
  readonly previousSlideId: PresentationMainSlideId | null
  readonly slideCount: number
}

const FALLBACK_PRESENTATION_SLIDE = PRESENTATION_MAIN_SLIDES[0]

export const PRESENTATION_SLIDES = [
  ...PRESENTATION_MAIN_SLIDES,
  ...PRESENTATION_APPENDIX_SLIDES,
] satisfies readonly PresentationSlide[]

export const PRESENTATION_MAIN_SLIDE_COUNT = PRESENTATION_MAIN_SLIDES.length
export const FIRST_PRESENTATION_SLIDE_ID = "intro" satisfies PresentationMainSlideId

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
  return (
    PRESENTATION_SLIDES.find((item) => item.id === slideId) ??
    FALLBACK_PRESENTATION_SLIDE
  )
}

export function getPresentationAppendixSlides() {
  return PRESENTATION_APPENDIX_SLIDES
}

export function getPresentationNavigation(
  slide: PresentationSlide
): PresentationNavigation {
  const currentMainSlideId =
    slide.kind === "appendix" ? slide.appendixFor : slide.id
  const currentIndex = PRESENTATION_MAIN_SLIDES.findIndex(
    (mainSlide) => mainSlide.id === currentMainSlideId
  )
  const safeIndex = currentIndex < 0 ? 0 : currentIndex
  const previousSlide = PRESENTATION_MAIN_SLIDES[safeIndex - 1]
  const nextSlide = PRESENTATION_MAIN_SLIDES[safeIndex + 1]

  return {
    currentIndex: safeIndex,
    nextSlideId: nextSlide ? nextSlide.id : null,
    previousSlideId: previousSlide ? previousSlide.id : null,
    slideCount: PRESENTATION_MAIN_SLIDES.length,
  }
}

export function buildPresentationSlideHref(slideId: PresentationSlideId) {
  return `/presentation/${slideId}`
}
