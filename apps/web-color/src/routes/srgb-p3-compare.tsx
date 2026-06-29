import { createFileRoute } from "@tanstack/react-router"

import { SrgbP3ComparePage } from "@/color-models/SrgbP3ComparePage"

export const Route = createFileRoute("/srgb-p3-compare")({
  component: SrgbP3ComparePage,
})
