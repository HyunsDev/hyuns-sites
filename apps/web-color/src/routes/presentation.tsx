import { createFileRoute } from "@tanstack/react-router"

import { PresentationRoutePage } from "@/presentation/PresentationRoutePage"

export const Route = createFileRoute("/presentation")({
  component: PresentationRoutePage,
})
