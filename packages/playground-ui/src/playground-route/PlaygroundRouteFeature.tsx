import type { ElementType } from "react"

import { Link } from "@tanstack/react-router"

import { Button } from "@hyunsdev/ui/components/button"

export type PlaygroundFeature = {
  icon: ElementType
  label: string
  path: string
}

export function PlaygroundRouteFeature({
  icon,
  label,
  path,
}: {
  icon: ElementType
  label: string
  path: string
}) {
  const RouteIcon = icon

  return (
    <Button asChild>
      <Link to={path}>
        <RouteIcon />
        {label}
      </Link>
    </Button>
  )
}
