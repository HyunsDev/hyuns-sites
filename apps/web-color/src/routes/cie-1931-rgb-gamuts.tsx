import { createFileRoute } from "@tanstack/react-router"

import { CieRgbGamutPage } from "@/color-models/CieRgbGamutPage"

export const Route = createFileRoute("/cie-1931-rgb-gamuts")({
  component: CieRgbGamutPage,
})
