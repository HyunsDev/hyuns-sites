import type { Dispatch, SetStateAction } from "react";

declare module "@tanstack/history" {
  interface HistoryState {
    portalHistoryIndex?: number;
  }
}

const PORTAL_DIRECTION_QUERY_KEY = "portal-direction";
const PORTAL_GROUP_ANIMATION_QUERY_KEY = "portal-group-animation";

export const PORTAL_EXIT_SKIP_THRESHOLD_MS = 150;
export const PORTAL_EXIT_TRANSITION_DURATION_SECONDS = 0.05;
export const PORTAL_ENTER_TRANSITION_DURATION_SECONDS = 0.1;
export const PORTAL_GROUP_ENTER_DURATION_SECONDS = 0.16;
export const PORTAL_GROUP_COLUMN_DELAY_SECONDS = 0.05;
export const PORTAL_GROUP_ROW_DELAY_SECONDS = 0.025;
export const PORTAL_ENTER_X_TRANSITION_EASE: [number, number, number, number] = [0, 0.5, 0, 1];
export const PORTAL_ENTER_OPACITY_TRANSITION_EASE: [number, number, number, number] = [
  0.35,
  0.35,
  0.65,
  0.65
];

const PORTAL_EXIT_TRANSITION_OFFSET_PX = 24;
const PORTAL_ENTER_TRANSITION_OFFSET_PX = 48;
const PORTAL_GROUP_ENTER_OFFSET_PX = 24;
const PORTAL_EXIT_X_TRANSITION_EASE: [number, number, number, number] = [0, 0.5, 0, 1];
const PORTAL_EXIT_OPACITY_TRANSITION_EASE: [number, number, number, number] = [
  0.35,
  0.35,
  0.65,
  0.65
];

export type PortalDirection = "prev" | "next";

export type PortalTransitionState = {
  phase: "idle" | "exiting";
  direction: PortalDirection | null;
};

export type PortalTransitionContextValue = {
  transitionState: PortalTransitionState;
  setTransitionState: Dispatch<SetStateAction<PortalTransitionState>>;
  entryDirection: PortalDirection | null;
  shouldAnimateGroups: boolean;
  getNextColumnIndex: () => number;
  getNextStandaloneGroupIndex: () => number;
};

export type PortalHistoryState = Record<string, unknown> & {
  readonly portalHistoryIndex?: number;
};

let nextPortalHistoryIndex = 0;
let lastSeenPortalHistoryIndex: number | null = null;

function isPortalDirection(value: string | null): value is PortalDirection {
  return value === "prev" || value === "next";
}

export function readCurrentPortalDirection(): PortalDirection | null {
  const url = new URL(window.location.href);
  const direction = url.searchParams.get(PORTAL_DIRECTION_QUERY_KEY);

  return isPortalDirection(direction) ? direction : null;
}

function readShouldSkipPortalGroupAnimation() {
  const url = new URL(window.location.href);

  return url.searchParams.get(PORTAL_GROUP_ANIMATION_QUERY_KEY) === "skip";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readPortalHistoryState(): PortalHistoryState {
  const currentState: unknown = window.history.state;

  if (!isRecord(currentState)) {
    return {};
  }

  const { portalHistoryIndex } = currentState;

  if (typeof portalHistoryIndex !== "number") {
    return { ...currentState };
  }

  return {
    ...currentState,
    portalHistoryIndex
  };
}

export function mergePortalHistoryIndex(
  previousState: unknown,
  portalHistoryIndex: number
): PortalHistoryState {
  if (!isRecord(previousState)) {
    return { portalHistoryIndex };
  }

  return {
    ...previousState,
    portalHistoryIndex
  };
}

function readCurrentPortalHistoryIndex() {
  const historyIndex = readPortalHistoryState().portalHistoryIndex;

  return typeof historyIndex === "number" ? historyIndex : null;
}

export function ensureCurrentPortalHistoryIndex() {
  const currentState = readPortalHistoryState();

  if (typeof currentState.portalHistoryIndex === "number") {
    nextPortalHistoryIndex = Math.max(
      nextPortalHistoryIndex,
      currentState.portalHistoryIndex + 1
    );

    return currentState.portalHistoryIndex;
  }

  const historyIndex = nextPortalHistoryIndex;
  nextPortalHistoryIndex += 1;

  window.history.replaceState(
    {
      ...currentState,
      portalHistoryIndex: historyIndex
    } satisfies PortalHistoryState,
    "",
    window.location.href
  );

  return historyIndex;
}

export function markLastSeenPortalHistoryIndex(historyIndex: number) {
  lastSeenPortalHistoryIndex = historyIndex;
}

export function getNextPortalHistoryIndex() {
  const historyIndex = nextPortalHistoryIndex;
  nextPortalHistoryIndex += 1;

  return historyIndex;
}

export function buildPortalRouteHref(
  path: string,
  direction: PortalDirection,
  shouldSkipGroups = false
) {
  const url = new URL(path, window.location.origin);

  url.searchParams.set(PORTAL_DIRECTION_QUERY_KEY, direction);

  if (shouldSkipGroups) {
    url.searchParams.set(PORTAL_GROUP_ANIMATION_QUERY_KEY, "skip");
  } else {
    url.searchParams.delete(PORTAL_GROUP_ANIMATION_QUERY_KEY);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function getPortalCurrentHrefWithoutDirection() {
  const url = new URL(window.location.href);

  url.searchParams.delete(PORTAL_DIRECTION_QUERY_KEY);
  url.searchParams.delete(PORTAL_GROUP_ANIMATION_QUERY_KEY);

  return `${url.pathname}${url.search}${url.hash}`;
}

export function getPortalEntryDirection() {
  const directionFromQuery = readCurrentPortalDirection();

  if (directionFromQuery) {
    return directionFromQuery;
  }

  const currentHistoryIndex = readCurrentPortalHistoryIndex();

  if (currentHistoryIndex === null || lastSeenPortalHistoryIndex === null) {
    return null;
  }

  if (currentHistoryIndex === lastSeenPortalHistoryIndex) {
    return null;
  }

  return currentHistoryIndex > lastSeenPortalHistoryIndex ? "next" : "prev";
}

export function getShouldAnimatePortalGroups(direction: PortalDirection | null) {
  if (readShouldSkipPortalGroupAnimation()) {
    return false;
  }

  if (direction === "next" && !readCurrentPortalDirection()) {
    return false;
  }

  return direction !== null;
}

export function getPortalEnterAnimation(direction: PortalDirection | null) {
  if (direction === "next") {
    return {
      x: PORTAL_ENTER_TRANSITION_OFFSET_PX,
      opacity: 0
    };
  }

  if (direction === "prev") {
    return {
      x: -PORTAL_ENTER_TRANSITION_OFFSET_PX,
      opacity: 0
    };
  }

  return false;
}

export function getPortalAnimateState(transitionState: PortalTransitionState) {
  if (transitionState.phase === "exiting" && transitionState.direction === "next") {
    return {
      x: -PORTAL_EXIT_TRANSITION_OFFSET_PX,
      opacity: 0
    };
  }

  if (transitionState.phase === "exiting" && transitionState.direction === "prev") {
    return {
      x: PORTAL_EXIT_TRANSITION_OFFSET_PX,
      opacity: 0
    };
  }

  return {
    x: 0,
    opacity: 1
  };
}

export function getPortalTransitionXEase(transitionState: PortalTransitionState) {
  return transitionState.phase === "exiting"
    ? PORTAL_EXIT_X_TRANSITION_EASE
    : PORTAL_ENTER_X_TRANSITION_EASE;
}

export function getPortalTransitionOpacityEase(transitionState: PortalTransitionState) {
  return transitionState.phase === "exiting"
    ? PORTAL_EXIT_OPACITY_TRANSITION_EASE
    : PORTAL_ENTER_OPACITY_TRANSITION_EASE;
}

export function getPortalGroupEnterAnimation(direction: PortalDirection | null) {
  if (direction === "next") {
    return {
      x: PORTAL_GROUP_ENTER_OFFSET_PX,
      opacity: 0
    };
  }

  if (direction === "prev") {
    return {
      x: -PORTAL_GROUP_ENTER_OFFSET_PX,
      opacity: 0
    };
  }

  return false;
}

export function getPortalGroupAnimateState() {
  return {
    x: 0,
    opacity: 1
  };
}
