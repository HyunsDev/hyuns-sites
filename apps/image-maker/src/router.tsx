/* eslint-disable react-refresh/only-export-components */
import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet
} from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/react-router";
import { ImageMakerWorkbench } from "./image-maker/ImageMakerWorkbench";

function redirectToSvgRoute() {
  return <Navigate to="/svg" replace />;
}

function RootRoute() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootRoute
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: redirectToSvgRoute
});

const svgRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/svg",
  component: () => <ImageMakerWorkbench sourceKind="svg" />
});

const pngRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/png",
  component: () => <ImageMakerWorkbench sourceKind="png" />
});

const routeTree = rootRoute.addChildren([indexRoute, svgRoute, pngRoute]);

export function getRouter({ history }: { readonly history?: RouterHistory } = {}) {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    ...(history ? { history } : {})
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
