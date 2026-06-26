import { useEffect, useMemo } from "react"
import type { ReactNode } from "react"

import { useNavigate } from "@tanstack/react-router"

import { CenterFooter } from "@hyunsdev/ui/layouts/center"
import { NavigationIndexPage } from "@hyunsdev/ui/layouts/navigation-index"

import { PlaygroundTools } from "../PlaygroundTools"
import {
  ensureCurrentPlaygroundHistoryIndex,
  getPlaygroundCurrentHrefWithoutDirection,
  getPlaygroundEntryDirection,
  getShouldAnimatePlaygroundGroups,
  markLastSeenPlaygroundHistoryIndex,
  readCurrentPlaygroundDirection,
} from "./playground-route-state"

function PlaygroundIndexPageHistorySync() {
  const navigate = useNavigate()

  useEffect(() => {
    const historyIndex = ensureCurrentPlaygroundHistoryIndex()

    markLastSeenPlaygroundHistoryIndex(historyIndex)
  }, [])

  useEffect(() => {
    if (!readCurrentPlaygroundDirection()) {
      return
    }

    void navigate({
      href: getPlaygroundCurrentHrefWithoutDirection(),
      replace: true,
      state: (previousState) => previousState ?? {},
    })
  }, [navigate])

  return null
}

export function PlaygroundIndexPage({
  title,
  description,
  children,
}: {
  readonly title: string
  readonly description?: string
  readonly children?: ReactNode
}) {
  const entryDirection = useMemo(() => getPlaygroundEntryDirection(), [])
  const shouldAnimateGroups = useMemo(
    () => getShouldAnimatePlaygroundGroups(entryDirection),
    [entryDirection],
  )

  return (
    <NavigationIndexPage
      title={title}
      description={description}
      entryDirection={entryDirection}
      shouldAnimateGroups={shouldAnimateGroups}
      className="bg-background-secondary! bg-dot-grid"
      footer={
        <CenterFooter className="py-3">
          <PlaygroundTools />
        </CenterFooter>
      }
    >
      <PlaygroundIndexPageHistorySync />
      {children}
    </NavigationIndexPage>
  )
}
