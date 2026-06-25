import { useCallback, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { motion } from "motion/react";
import {
  PortalColumnProvider,
  useOptionalPortalColumnContext,
  usePortalTransitionContext
} from "./portal-route-context";
import {
  PORTAL_ENTER_OPACITY_TRANSITION_EASE,
  PORTAL_ENTER_X_TRANSITION_EASE,
  PORTAL_GROUP_COLUMN_DELAY_SECONDS,
  PORTAL_GROUP_ENTER_DURATION_SECONDS,
  PORTAL_GROUP_ROW_DELAY_SECONDS,
  getPortalGroupAnimateState,
  getPortalGroupEnterAnimation
} from "./portal-route-state";

function EmptyIcon() {
  return null;
}

export function PortalRouteGroup({
  name,
  icon,
  children
}: {
  name?: string;
  icon?: ElementType;
  children: ReactNode;
}) {
  const ListIcon = icon ?? EmptyIcon;
  const groupIndexRef = useRef<number | null>(null);
  const { entryDirection, shouldAnimateGroups, getNextStandaloneGroupIndex } =
    usePortalTransitionContext();
  const columnContext = useOptionalPortalColumnContext();
  const columnIndex = columnContext?.columnIndex ?? 0;
  const getNextGroupIndex = columnContext?.getNextGroupIndex ?? getNextStandaloneGroupIndex;

  if (groupIndexRef.current === null) {
    groupIndexRef.current = getNextGroupIndex();
  }

  const groupDelaySeconds =
    columnIndex * PORTAL_GROUP_COLUMN_DELAY_SECONDS +
    groupIndexRef.current * PORTAL_GROUP_ROW_DELAY_SECONDS;
  const groupMotionProps = shouldAnimateGroups
    ? {
        initial: getPortalGroupEnterAnimation(entryDirection),
        animate: getPortalGroupAnimateState(),
        transition: {
          x: {
            duration: PORTAL_GROUP_ENTER_DURATION_SECONDS,
            delay: groupDelaySeconds,
            ease: PORTAL_ENTER_X_TRANSITION_EASE
          },
          opacity: {
            duration: PORTAL_GROUP_ENTER_DURATION_SECONDS,
            delay: groupDelaySeconds,
            ease: PORTAL_ENTER_OPACITY_TRANSITION_EASE
          }
        }
      }
    : {
        initial: false
      };

  return (
    <motion.div className="flex w-full flex-col md:w-[180px]" {...groupMotionProps}>
      {name ? (
        <div className="mb-4 flex items-center justify-center gap-1 text-center font-mono text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <ListIcon /> {name}
        </div>
      ) : null}

      <div className="flex flex-col gap-1">{children}</div>
    </motion.div>
  );
}

export function PortalRouteColumn({ children }: { children: ReactNode }) {
  const columnIndexRef = useRef<number | null>(null);
  const nextGroupIndexRef = useRef(0);
  const { getNextColumnIndex } = usePortalTransitionContext();
  const getNextGroupIndex = useCallback(() => {
    const groupIndex = nextGroupIndexRef.current;
    nextGroupIndexRef.current += 1;

    return groupIndex;
  }, []);

  if (columnIndexRef.current === null) {
    columnIndexRef.current = getNextColumnIndex();
  }

  return (
    <PortalColumnProvider
      value={{
        columnIndex: columnIndexRef.current,
        getNextGroupIndex
      }}
    >
      <div className="flex w-full flex-col justify-start gap-10 md:w-[180px]">{children}</div>
    </PortalColumnProvider>
  );
}
