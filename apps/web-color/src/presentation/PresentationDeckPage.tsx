import { useEffect } from "react"

import { useNavigate } from "@tanstack/react-router"

import {
  buildPresentationSlideHref,
  getPresentationNavigation,
  getPresentationSlide,
  resolvePresentationSlideId,
  type PresentationSlideId,
} from "@/presentation/presentation-slides"
import { PresentationTools } from "@/presentation/PresentationTools"

type PresentationDeckPageProps = {
  readonly requestedSlideId?: string
}

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

export function PresentationDeckPage({
  requestedSlideId,
}: PresentationDeckPageProps) {
  const navigate = useNavigate()
  const slideId = resolvePresentationSlideId(requestedSlideId)
  const slide = getPresentationSlide(slideId)
  const SlideComponent = slide.component
  const navigation = getPresentationNavigation(slide.id)

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
        <div className="aspect-video w-full max-w-[min(calc(100vw-1.5rem),calc((100svh-5.25rem)*16/9))] overflow-hidden rounded-md border border-border bg-background-secondary shadow-sm sm:max-w-[min(calc(100vw-2rem),calc((100svh-5.5rem)*16/9))]">
          <SlideComponent />
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
