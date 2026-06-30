import { useEffect } from "react"

import { useNavigate } from "@tanstack/react-router"

import {
  buildPresentationSlideHref,
  FIRST_PRESENTATION_SLIDE_ID,
  getPresentationNavigation,
  getPresentationSlide,
  PRESENTATION_SLIDE_IDS,
  resolvePresentationSlideId,
  type PresentationSlideId,
} from "@/presentation/presentation-slides"
import {
  getPresentationFooterModel,
  type PresentationFooterModel,
} from "@/presentation/presentation-slide-footer"
import { PresentationTools } from "@/presentation/PresentationTools"

type PresentationDeckPageProps = {
  readonly requestedSlideId?: string
}

type PresentationSlideFooterProps = {
  readonly model: PresentationFooterModel
}

const PART_TWO_FIRST_SLIDE_INDEX =
  PRESENTATION_SLIDE_IDS.indexOf("part-2-intro")

function isEditableKeyTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLButtonElement
  )
}

function PresentationSlideFooter({ model }: PresentationSlideFooterProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[6.8cqw] bottom-[3.2cqh] z-20 flex items-center gap-[1.35cqw] text-[clamp(0.48rem,0.72cqw,0.68rem)] leading-none font-bold tracking-normal text-text-muted"
    >
      <span className="shrink-0 whitespace-nowrap">{model.partLabel}</span>
      <span className="h-px min-w-6 flex-1 bg-border" />
      <span className="shrink-0 font-mono tabular-nums">
        {model.slideNumber}
      </span>
    </div>
  )
}

export function PresentationDeckPage({
  requestedSlideId,
}: PresentationDeckPageProps) {
  const navigate = useNavigate()
  const slideId = resolvePresentationSlideId(requestedSlideId)
  const slide = getPresentationSlide(slideId)
  const SlideComponent = slide.component
  const navigation = getPresentationNavigation(slide.id)
  const slideFooterModel = getPresentationFooterModel({
    currentIndex: navigation.currentIndex,
    isPartTwo: navigation.currentIndex >= PART_TWO_FIRST_SLIDE_INDEX,
    isTitleSlide: slide.id === FIRST_PRESENTATION_SLIDE_ID,
  })

  useEffect(() => {
    function navigateToSlide(targetSlideId: PresentationSlideId | null) {
      if (!targetSlideId) {
        return
      }

      void navigate({ href: buildPresentationSlideHref(targetSlideId) })
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableKeyTarget(event.target)) {
        return
      }

      switch (event.key) {
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault()
          navigateToSlide(navigation.previousSlideId)
          return
        case "ArrowRight":
        case "PageDown":
          event.preventDefault()
          navigateToSlide(navigation.nextSlideId)
          return
        default:
          return
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [navigate, navigation.nextSlideId, navigation.previousSlideId])

  return (
    <div className="bg-dot-grid flex min-h-svh flex-col bg-background-primary text-text-normal">
      <main className="flex min-h-0 flex-1 items-center justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="@container/slide-frame relative aspect-[9/16] w-full max-w-[min(calc(100vw-1.5rem),calc((100svh-5.25rem)*9/16))] overflow-hidden rounded-md border border-border bg-background-secondary shadow-sm sm:aspect-video sm:max-w-[min(calc(100vw-2rem),calc((100svh-5.5rem)*16/9))]">
          <SlideComponent />
          {slideFooterModel ? <PresentationSlideFooter model={slideFooterModel} /> : null}
        </div>
      </main>
      <footer className="flex shrink-0 items-center justify-center px-3 py-3">
        <PresentationTools
          currentIndex={navigation.currentIndex}
          nextSlideId={navigation.nextSlideId}
          previousSlideId={navigation.previousSlideId}
          slideCount={navigation.slideCount}
        />
      </footer>
    </div>
  )
}
