import type { ElementType } from "react";
import { Button } from "@hyunsdev/ui/components/button";

export type PortalFeature = {
  icon: ElementType;
  label: string;
  href: string;
};

export function PortalRouteFeature({
  icon,
  label,
  href
}: {
  icon: ElementType;
  label: string;
  href: string;
}) {
  const RouteIcon = icon;

  return (
    <Button asChild>
      <a href={href}>
        <RouteIcon />
        {label}
      </a>
    </Button>
  );
}
