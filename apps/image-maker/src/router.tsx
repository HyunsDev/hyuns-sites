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
import { ThumbnailWorkbench } from "./image-maker/ThumbnailWorkbench";

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

const thumbnailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/thumbnail",
  component: ThumbnailWorkbench
});

const routeTree = rootRoute.addChildren([indexRoute, svgRoute, pngRoute, thumbnailRoute]);

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
