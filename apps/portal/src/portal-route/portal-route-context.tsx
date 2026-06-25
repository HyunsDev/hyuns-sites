/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { PortalTransitionContextValue } from "./portal-route-state";

type PortalColumnContextValue = {
  columnIndex: number;
  getNextGroupIndex: () => number;
};

const portalTransitionContext = createContext<PortalTransitionContextValue | null>(null);
const portalColumnContext = createContext<PortalColumnContextValue | null>(null);

export function PortalTransitionProvider({
  children,
  value
}: {
  children: ReactNode;
  value: PortalTransitionContextValue;
}) {
  return (
    <portalTransitionContext.Provider value={value}>{children}</portalTransitionContext.Provider>
  );
}

export function PortalColumnProvider({
  children,
  value
}: {
  children: ReactNode;
  value: PortalColumnContextValue;
}) {
  return <portalColumnContext.Provider value={value}>{children}</portalColumnContext.Provider>;
}

export function usePortalTransitionContext() {
  const context = useContext(portalTransitionContext);

  if (!context) {
    throw new Error("Portal transition context is missing.");
  }

  return context;
}

export function useOptionalPortalColumnContext() {
  return useContext(portalColumnContext);
}
