import { useCallback, useEffect, useState } from "react"

import { useNavigate } from "@tanstack/react-router"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FullscreenIcon,
  MinimizeIcon,
} from "lucide-react"

import { Button } from "@hyunsdev/ui/components/button"
import { ButtonGroup } from "@hyunsdev/ui/components/button-group"
import { cn } from "@hyunsdev/ui/lib/utils"
import { AccentSelector, ThemeButtonGroup } from "@workspace/playground-ui"
import {
  buildPresentationSlideHref,
  type PresentationSlideId,
} from "@/presentation/presentation-slides"

type PresentationToolsProps = {
  readonly className?: string
  readonly currentIndex: number
  readonly nextSlideId: PresentationSlideId | null
  readonly previousSlideId: PresentationSlideId | null
  readonly slideCount: number
}

function hasFullscreenElement() {
  const fullscreenElement: Element | null | undefined =
    document.fullscreenElement

  return fullscreenElement !== null && fullscreenElement !== undefined
}

export function PresentationTools({
  className,
  currentIndex,
  nextSlideId,
  previousSlideId,
  slideCount,
}: PresentationToolsProps) {
  const navigate = useNavigate()
  const [fullscreenEnabled, setFullscreenEnabled] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const slideLabel = `${currentIndex + 1} / ${slideCount}`
  const fullscreenLabel = isFullscreen ? "Exit fullscreen" : "Enter fullscreen"

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
    </div>
  )
}
