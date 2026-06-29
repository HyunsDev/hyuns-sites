import { createFileRoute } from "@tanstack/react-router"

import { RgbChannelCodePage } from "@/color-models/RgbChannelCodePage"

export const Route = createFileRoute("/rgb-channel-gamut-codes")({
  component: RgbChannelCodePage,
})
