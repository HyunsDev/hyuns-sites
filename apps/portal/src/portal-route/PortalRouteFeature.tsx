import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { Button } from "@hyunsdev/ui/components/button";

export type PortalFeature = {
  icon: ElementType;
  label: string;
  href: string;
};

type PortalRouteFeatureProps = PortalFeature &
  Omit<ComponentPropsWithoutRef<"a">, keyof PortalFeature | "children">;

export const PortalRouteFeature = forwardRef<HTMLAnchorElement, PortalRouteFeatureProps>(
  function PortalRouteFeature({ icon, label, href, ...anchorProps }, ref) {
    const RouteIcon = icon;

    return (
      <Button asChild className="w-full">
        <a ref={ref} href={href} {...anchorProps}>
          <RouteIcon />
          {label}
        </a>
      </Button>
    );
  }
);
