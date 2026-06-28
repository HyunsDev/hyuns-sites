import { createFileRoute } from "@tanstack/react-router"

import { ArduinoRgbPage } from "@/arduino-rgb/ArduinoRgbPage"

export const Route = createFileRoute("/arduino-rgb")({
  component: ArduinoRgbPage,
})
