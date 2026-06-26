import type { ElementType } from "react"

import { useNavigate } from "@tanstack/react-router"

import { NavigationIndexItem } from "@hyunsdev/ui/layouts/navigation-index"

import {
  buildPlaygroundRouteHref,
  ensureCurrentPlaygroundHistoryIndex,
  getNextPlaygroundHistoryIndex,
  mergePlaygroundHistoryIndex,
  type PlaygroundDirection,
  type PlaygroundHistoryState,
} from "./playground-route-state"

export function PlaygroundRouteIndex({
  direction = "next",
  icon,
  label,
  path,
}: {
  readonly icon: ElementType
  readonly label: string
  readonly path: string
  readonly direction?: PlaygroundDirection
}) {
  const navigate = useNavigate()

  return (
    <NavigationIndexItem
      icon={icon}
      label={label}
      direction={direction}
      onNavigate={({ shouldSkipGroups }) => {
        ensureCurrentPlaygroundHistoryIndex()

        const targetHistoryIndex = getNextPlaygroundHistoryIndex()

        void navigate({
          href: buildPlaygroundRouteHref(path, direction, shouldSkipGroups),
          state: (previousState) =>
            mergePlaygroundHistoryIndex(
              previousState,
              targetHistoryIndex,
            ) satisfies PlaygroundHistoryState,
        })
      }}
    />
  )
}
