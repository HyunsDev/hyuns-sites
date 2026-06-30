import { useCallback, useEffect, useState } from "react"

import { useNavigate } from "@tanstack/react-router"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FullscreenIcon,
  HouseIcon,
  MinimizeIcon,
} from "lucide-react"

import { Button } from "@hyunsdev/ui/components/button"
import { ButtonGroup } from "@hyunsdev/ui/components/button-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hyunsdev/ui/components/select"
import { cn } from "@hyunsdev/ui/lib/utils"
import { AccentSelector, ThemeButtonGroup } from "@workspace/playground-ui"
import {
  buildPresentationSlideHref,
  isPresentationSlideId,
  type PresentationAppendixSlide,
  type PresentationSlideId,
} from "@/presentation/presentation-slides"

type PresentationToolsProps = {
  readonly appendixSlides: readonly PresentationAppendixSlide[]
  readonly className?: string
  readonly currentIndex: number
  readonly currentSlideId: PresentationSlideId
  readonly nextSlideId: PresentationSlideId | null
  readonly previousSlideId: PresentationSlideId | null
  readonly returnSlideId: PresentationSlideId | null
  readonly slideCount: number
}

function hasFullscreenElement() {
  const fullscreenElement: Element | null | undefined =
    document.fullscreenElement

  return fullscreenElement !== null && fullscreenElement !== undefined
}

export function PresentationTools({
  appendixSlides,
  className,
  currentIndex,
  currentSlideId,
  nextSlideId,
  previousSlideId,
  returnSlideId,
  slideCount,
}: PresentationToolsProps) {
  const navigate = useNavigate()
  const [fullscreenEnabled, setFullscreenEnabled] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const slideLabel = `${currentIndex + 1} / ${slideCount}`
  const homeLabel = "Go to home"
  const fullscreenLabel = isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
  const isAppendixSlide = returnSlideId !== null
  const appendixSelectValue = isAppendixSlide ? currentSlideId : ""

  const syncFullscreenState = useCallback(() => {
    setFullscreenEnabled(document.fullscreenEnabled)
    setIsFullscreen(hasFullscreenElement())
  }, [])

  useEffect(() => {
    syncFullscreenState()
    document.addEventListener("fullscreenchange", syncFullscreenState)

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState)
    }
  }, [syncFullscreenState])

  function navigateToSlide(slideId: PresentationSlideId | null) {
    if (!slideId) {
      return
    }

    void navigate({ href: buildPresentationSlideHref(slideId) })
  }

  function navigateToHome() {
    void navigate({ href: "/" })
  }

  function navigateToAppendix(value: string) {
    if (isPresentationSlideId(value)) {
      navigateToSlide(value)
    }
  }

  async function toggleFullscreen() {
    if (!document.fullscreenEnabled) {
      return
    }

    try {
      if (hasFullscreenElement()) {
        await document.exitFullscreen()
        syncFullscreenState()
        return
      }

      await document.documentElement.requestFullscreen()
      syncFullscreenState()
    } catch (error) {
      if (error instanceof Error) {
        syncFullscreenState()
        return
      }

      throw error
    }
  }

  return (
    <div
      className={cn(
        "flex max-w-full flex-wrap items-center justify-center gap-2",
        className
      )}
    >
      {isAppendixSlide ? (
        <ButtonGroup>
          <Button
            type="button"
            size="sm"
            aria-label="Back to source slide"
            onClick={() => navigateToSlide(returnSlideId)}
          >
            <ArrowLeftIcon />
            본문으로
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <Button
            type="button"
            size="icon-sm"
            aria-label="Previous slide"
            disabled={!previousSlideId}
            onClick={() => navigateToSlide(previousSlideId)}
          >
            <ArrowLeftIcon />
          </Button>
          <Button type="button" size="sm" variant="outline" disabled>
            {slideLabel}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            aria-label="Next slide"
            disabled={!nextSlideId}
            onClick={() => navigateToSlide(nextSlideId)}
          >
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
      )}
      <ButtonGroup>
        <Button
          type="button"
          size="icon-sm"
          aria-label={homeLabel}
          title={homeLabel}
          onClick={navigateToHome}
        >
          <HouseIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button
          type="button"
          size="icon-sm"
          aria-label={fullscreenLabel}
          aria-pressed={isFullscreen}
          title={fullscreenLabel}
          disabled={!fullscreenEnabled}
          onClick={() => {
            void toggleFullscreen()
          }}
        >
          {isFullscreen ? <MinimizeIcon /> : <FullscreenIcon />}
        </Button>
      </ButtonGroup>
      <AccentSelector />
      <ThemeButtonGroup />
      <Select value={appendixSelectValue} onValueChange={navigateToAppendix}>
        <SelectTrigger size="sm" className="min-w-44">
          <SelectValue placeholder="부록" />
        </SelectTrigger>
        <SelectContent position="popper">
          {appendixSlides.map((slide) => (
            <SelectItem key={slide.id} value={slide.id}>
              {slide.selectLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
