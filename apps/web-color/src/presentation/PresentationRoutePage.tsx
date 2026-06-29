import { Outlet, useLocation } from "@tanstack/react-router"

import { PresentationDeckPage } from "@/presentation/PresentationDeckPage"

export function PresentationRoutePage() {
  const location = useLocation()

  if (location.pathname === "/presentation") {
    return <PresentationDeckPage />
  }

  return <Outlet />
}
