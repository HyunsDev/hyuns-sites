declare module "@tanstack/history" {
  interface HistoryState {
    playgroundHistoryIndex?: number
  }
}

const PLAYGROUND_DIRECTION_QUERY_KEY = "playground-direction"
const PLAYGROUND_GROUP_ANIMATION_QUERY_KEY = "playground-group-animation"

export type PlaygroundDirection = "prev" | "next"

export type PlaygroundHistoryState = Record<string, unknown> & {
  readonly playgroundHistoryIndex?: number
}

let nextPlaygroundHistoryIndex = 0
let lastSeenPlaygroundHistoryIndex: number | null = null

function isPlaygroundDirection(value: string | null): value is PlaygroundDirection {
  return value === "prev" || value === "next"
}

export function readCurrentPlaygroundDirection(): PlaygroundDirection | null {
  const url = new URL(window.location.href)
  const direction = url.searchParams.get(PLAYGROUND_DIRECTION_QUERY_KEY)

  return isPlaygroundDirection(direction) ? direction : null
}

function readShouldSkipPlaygroundGroupAnimation() {
  const url = new URL(window.location.href)

  return url.searchParams.get(PLAYGROUND_GROUP_ANIMATION_QUERY_KEY) === "skip"
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readPlaygroundHistoryState(): PlaygroundHistoryState {
  const currentState: unknown = window.history.state

  if (!isRecord(currentState)) {
    return {}
  }

  const { playgroundHistoryIndex } = currentState

  if (typeof playgroundHistoryIndex !== "number") {
    return { ...currentState }
  }

  return {
    ...currentState,
    playgroundHistoryIndex,
  }
}

export function mergePlaygroundHistoryIndex(
  previousState: unknown,
  playgroundHistoryIndex: number,
): PlaygroundHistoryState {
  if (!isRecord(previousState)) {
    return { playgroundHistoryIndex }
  }

  return {
    ...previousState,
    playgroundHistoryIndex,
  }
}

function readCurrentPlaygroundHistoryIndex() {
  const historyIndex = readPlaygroundHistoryState().playgroundHistoryIndex

  return typeof historyIndex === "number" ? historyIndex : null
}

export function ensureCurrentPlaygroundHistoryIndex() {
  const currentState = readPlaygroundHistoryState()

  if (typeof currentState.playgroundHistoryIndex === "number") {
    nextPlaygroundHistoryIndex = Math.max(
      nextPlaygroundHistoryIndex,
      currentState.playgroundHistoryIndex + 1,
    )

    return currentState.playgroundHistoryIndex
  }

  const historyIndex = nextPlaygroundHistoryIndex
  nextPlaygroundHistoryIndex += 1

  window.history.replaceState(
    {
      ...currentState,
      playgroundHistoryIndex: historyIndex,
    } satisfies PlaygroundHistoryState,
    "",
    window.location.href,
  )

  return historyIndex
}

export function markLastSeenPlaygroundHistoryIndex(historyIndex: number) {
  lastSeenPlaygroundHistoryIndex = historyIndex
}

export function getNextPlaygroundHistoryIndex() {
  const historyIndex = nextPlaygroundHistoryIndex
  nextPlaygroundHistoryIndex += 1

  return historyIndex
}

export function buildPlaygroundRouteHref(
  path: string,
  direction: PlaygroundDirection,
  shouldSkipGroups = false,
) {
  const url = new URL(path, window.location.origin)

  url.searchParams.set(PLAYGROUND_DIRECTION_QUERY_KEY, direction)

  if (shouldSkipGroups) {
    url.searchParams.set(PLAYGROUND_GROUP_ANIMATION_QUERY_KEY, "skip")
  } else {
    url.searchParams.delete(PLAYGROUND_GROUP_ANIMATION_QUERY_KEY)
  }

  return `${url.pathname}${url.search}${url.hash}`
}

export function getPlaygroundCurrentHrefWithoutDirection() {
  const url = new URL(window.location.href)

  url.searchParams.delete(PLAYGROUND_DIRECTION_QUERY_KEY)
  url.searchParams.delete(PLAYGROUND_GROUP_ANIMATION_QUERY_KEY)

  return `${url.pathname}${url.search}${url.hash}`
}

export function getPlaygroundEntryDirection() {
  const directionFromQuery = readCurrentPlaygroundDirection()

  if (directionFromQuery) {
    return directionFromQuery
  }

  const currentHistoryIndex = readCurrentPlaygroundHistoryIndex()

  if (currentHistoryIndex === null || lastSeenPlaygroundHistoryIndex === null) {
    return null
  }

  if (currentHistoryIndex === lastSeenPlaygroundHistoryIndex) {
    return null
  }

  return currentHistoryIndex > lastSeenPlaygroundHistoryIndex ? "next" : "prev"
}

export function getShouldAnimatePlaygroundGroups(direction: PlaygroundDirection | null) {
  if (readShouldSkipPlaygroundGroupAnimation()) {
    return false
  }

  if (direction === "next" && !readCurrentPlaygroundDirection()) {
    return false
  }

  return direction !== null
}
