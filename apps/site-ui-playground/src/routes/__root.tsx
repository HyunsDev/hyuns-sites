import { createRootRoute, Outlet } from "@tanstack/react-router";
import { MainProvider } from "@hyunsdev/ui/components/main-provider";

export const Route = createRootRoute({
  component: () => (
    <MainProvider>
      <Outlet />
    </MainProvider>
  )
});
