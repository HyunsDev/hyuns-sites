import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PortalCenter } from "./PortalCenter";
import {
  PortalTransitionProvider,
  usePortalTransitionContext
} from "./portal-route-context";
import {
  PORTAL_ENTER_TRANSITION_DURATION_SECONDS,
  PORTAL_EXIT_TRANSITION_DURATION_SECONDS,
  ensureCurrentPortalHistoryIndex,
  getPortalAnimateState,
  getPortalCurrentHrefWithoutDirection,
  getPortalEnterAnimation,
  getPortalEntryDirection,
  getPortalTransitionOpacityEase,
  getPortalTransitionXEase,
  getShouldAnimatePortalGroups,
  markLastSeenPortalHistoryIndex,
  readCurrentPortalDirection
} from "./portal-route-state";
import type { PortalTransitionState } from "./portal-route-state";

function PortalIndexPageContent({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();
  const { transitionState } = usePortalTransitionContext();
  const entryDirection = useMemo(() => getPortalEntryDirection(), []);

  useEffect(() => {
    const historyIndex = ensureCurrentPortalHistoryIndex();

    markLastSeenPortalHistoryIndex(historyIndex);
  }, []);

  useEffect(() => {
    if (!readCurrentPortalDirection()) {
      return;
    }

    void navigate({
      href: getPortalCurrentHrefWithoutDirection(),
      replace: true,
      state: (previousState) => previousState ?? {}
    });
  }, [navigate]);

  return (
    <motion.div
      className="flex w-full flex-col items-center justify-center gap-10 md:flex-row md:items-start md:gap-4"
      initial={getPortalEnterAnimation(entryDirection)}
      animate={getPortalAnimateState(transitionState)}
      transition={{
        x: {
          duration:
            transitionState.phase === "exiting"
              ? PORTAL_EXIT_TRANSITION_DURATION_SECONDS
              : PORTAL_ENTER_TRANSITION_DURATION_SECONDS,
          ease: getPortalTransitionXEase(transitionState)
        },
        opacity: {
          duration:
            transitionState.phase === "exiting"
              ? PORTAL_EXIT_TRANSITION_DURATION_SECONDS
              : PORTAL_ENTER_TRANSITION_DURATION_SECONDS,
          ease: getPortalTransitionOpacityEase(transitionState)
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function PortalIndexPage({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const entryDirection = useMemo(() => getPortalEntryDirection(), []);
  const shouldAnimateGroups = useMemo(
    () => getShouldAnimatePortalGroups(entryDirection),
    [entryDirection]
  );
  const [transitionState, setTransitionState] = useState<PortalTransitionState>({
    phase: "idle",
    direction: null
  });
  const nextColumnIndexRef = useRef(0);
  const nextStandaloneGroupIndexRef = useRef(0);
  const getNextColumnIndex = useCallback(() => {
    const columnIndex = nextColumnIndexRef.current;
    nextColumnIndexRef.current += 1;

    return columnIndex;
  }, []);
  const getNextStandaloneGroupIndex = useCallback(() => {
    const groupIndex = nextStandaloneGroupIndexRef.current;
    nextStandaloneGroupIndexRef.current += 1;

    return groupIndex;
  }, []);

  return (
    <PortalTransitionProvider
      value={{
        transitionState,
        setTransitionState,
        entryDirection,
        shouldAnimateGroups,
        getNextColumnIndex,
        getNextStandaloneGroupIndex
      }}
    >
      <PortalCenter
        title={title}
        description={description}
        className="bg-background-secondary! bg-dot-grid"
      >
        <PortalIndexPageContent>{children}</PortalIndexPageContent>
      </PortalCenter>
    </PortalTransitionProvider>
  );
}
