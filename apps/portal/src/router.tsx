/* eslint-disable react-refresh/only-export-components */
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet
} from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/react-router";
import { HomeRoute } from "./routes/home";
import { ProjectsRoute } from "./routes/projects";

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

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectsRoute
});

const routeTree = rootRoute.addChildren([indexRoute, projectsRoute]);

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
