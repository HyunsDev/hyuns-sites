import { useEffect, useRef, useState } from "react";
import type { ElementType, MouseEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@hyunsdev/ui/components/button";
import { cn } from "@hyunsdev/ui/lib/utils";
import { usePortalTransitionContext } from "./portal-route-context";
import {
  PORTAL_EXIT_SKIP_THRESHOLD_MS,
  PORTAL_EXIT_TRANSITION_DURATION_SECONDS,
  buildPortalRouteHref,
  ensureCurrentPortalHistoryIndex,
  getNextPortalHistoryIndex,
  mergePortalHistoryIndex
} from "./portal-route-state";
import type { PortalDirection, PortalHistoryState } from "./portal-route-state";

export function PortalRouteIndex({
  direction = "next",
  icon,
  label,
  openInNewTab = false,
  path
}: {
  icon: ElementType;
  label: string;
  openInNewTab?: boolean;
  path: string;
  direction?: PortalDirection;
}) {
  const RouteIcon = icon;
  const [pressed, setPressed] = useState(false);
  const navigate = useNavigate();
  const navigationTimeoutRef = useRef<number | null>(null);
  const pressStartedAtRef = useRef<number | null>(null);
  const isNavigatingRef = useRef(false);
  const { transitionState, setTransitionState } = usePortalTransitionContext();

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const navigateToTarget = (shouldSkipGroups = false) => {
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;

    const targetHistoryIndex = getNextPortalHistoryIndex();

    void navigate({
      href: buildPortalRouteHref(path, direction, shouldSkipGroups),
      state: (previousState) =>
        mergePortalHistoryIndex(previousState, targetHistoryIndex) satisfies PortalHistoryState
    });
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (transitionState.phase === "exiting" || isNavigatingRef.current) {
      return;
    }

    if (openInNewTab || event.metaKey || event.ctrlKey) {
      window.open(path, "_blank", "noopener,noreferrer");
      setPressed(false);
      pressStartedAtRef.current = null;

      return;
    }

    ensureCurrentPortalHistoryIndex();
    setPressed(false);

    const pressStartedAt = pressStartedAtRef.current;
    const heldDurationMs =
      pressStartedAt === null ? Number.POSITIVE_INFINITY : performance.now() - pressStartedAt;

    pressStartedAtRef.current = null;

    if (heldDurationMs < PORTAL_EXIT_SKIP_THRESHOLD_MS) {
      navigateToTarget(true);

      return;
    }

    setTransitionState({
      phase: "exiting",
      direction
    });

    navigationTimeoutRef.current = window.setTimeout(() => {
      navigateToTarget(false);
    }, PORTAL_EXIT_TRANSITION_DURATION_SECONDS * 1000);
  };

  const handlePressStart = () => {
    pressStartedAtRef.current = performance.now();
    setPressed(true);
  };

  const handlePressEnd = () => {
    setPressed(false);
  };

  const handlePressCancel = () => {
    pressStartedAtRef.current = null;
    setPressed(false);
  };

  return (
    <Button
      applied
      type="button"
      disabled={transitionState.phase === "exiting"}
      className="group w-full justify-between"
      onClick={handleClick}
      onKeyDown={handlePressStart}
      onKeyUp={handlePressEnd}
      onBlur={handlePressCancel}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerLeave={handlePressEnd}
      onPointerCancel={handlePressCancel}
    >
      <ArrowLeftIcon
        className={cn(
          "shrink-0 transition-transform duration-200 ease-out",
          direction === "prev" && pressed && "-translate-x-1"
        )}
        style={{
          opacity: direction === "next" ? "0%" : "100%"
        }}
      />

      <span className="flex w-full items-center justify-center gap-2">
        <RouteIcon />
        <span className={cn(openInNewTab && "underline underline-offset-4")}>{label}</span>
      </span>

      <ArrowRightIcon
        className={cn(
          "shrink-0 transition-transform duration-200 ease-out",
          direction === "next" && pressed && "translate-x-1"
        )}
        style={{
          opacity: direction === "prev" ? "0%" : "100%"
        }}
      />
    </Button>
  );
}
