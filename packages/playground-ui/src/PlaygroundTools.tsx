import { useSyncExternalStore } from "react"

import { Link, useCanGoBack, useRouter } from "@tanstack/react-router"
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from "lucide-react"

import { Button } from "@hyunsdev/ui/components/button"
import { ButtonGroup } from "@hyunsdev/ui/components/button-group"

import { AccentSelector } from "./AccentSelector"
import { ThemeButtonGroup } from "./ThemeButtonGroup"

export function PlaygroundTools() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const canGoForward = useSyncExternalStore(
    router.history.subscribe,
    () => router.history.location.state.__TSR_index < router.history.length - 1,
  )

  return (
    <div className="flex items-center justify-center gap-2">
      <ButtonGroup>
        <Button size="icon-sm" onClick={() => router.history.back()} disabled={!canGoBack}>
          <ArrowLeftIcon />
        </Button>
        <Button size="icon-sm" asChild>
          <Link to="/">
            <HomeIcon />
          </Link>
        </Button>
        <Button size="icon-sm" onClick={() => router.history.forward()} disabled={!canGoForward}>
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
      <AccentSelector />
      <ThemeButtonGroup />
    </div>
  )
}
