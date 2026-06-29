import type { ElementType, ReactNode } from "react"

import {
  NavigationIndexColumn,
  NavigationIndexGroup,
} from "@hyunsdev/ui/layouts/navigation-index"

export function PlaygroundRouteGroup({
  name,
  icon,
  children,
}: {
  readonly name?: string
  readonly icon?: ElementType
  readonly children: ReactNode
}) {
  if (name && icon) {
    return (
      <NavigationIndexGroup label={name} icon={icon}>
        {children}
      </NavigationIndexGroup>
    )
  }

  if (name) {
    return <NavigationIndexGroup label={name}>{children}</NavigationIndexGroup>
  }

  if (icon) {
    return <NavigationIndexGroup icon={icon}>{children}</NavigationIndexGroup>
  }

  return (
    <NavigationIndexGroup>
      {children}
    </NavigationIndexGroup>
  )
}

export function PlaygroundRouteColumn({ children }: { readonly children: ReactNode }) {
  return <NavigationIndexColumn>{children}</NavigationIndexColumn>
}
