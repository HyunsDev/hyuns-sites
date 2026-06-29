import { createFileRoute } from "@tanstack/react-router"

import { PresentationSlideRoutePage } from "@/presentation/PresentationSlideRoutePage"

export const Route = createFileRoute("/presentation/$slideId")({
  component: PresentationSlideRoutePage,
})
