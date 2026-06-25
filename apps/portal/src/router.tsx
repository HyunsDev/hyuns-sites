/* eslint-disable react-refresh/only-export-components */
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet
} from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/react-router";
import { DynamicPageRoute, HomeRoute } from "./routes/page";

function RootRoute() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootRoute
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeRoute
});

const dynamicPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$pageId",
  component: DynamicPageRoute
});

const routeTree = rootRoute.addChildren([indexRoute, dynamicPageRoute]);

export function getRouter({ history }: { history?: RouterHistory } = {}) {
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
