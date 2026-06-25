import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { Button } from "@hyunsdev/ui/components/button";
import { cn } from "@hyunsdev/ui/lib/utils";

export type PortalFeature = {
  icon: ElementType;
  label: string;
  href: string;
  openInNewTab?: boolean;
};

type PortalRouteFeatureProps = PortalFeature &
  Omit<ComponentPropsWithoutRef<"a">, keyof PortalFeature | "children">;

export const PortalRouteFeature = forwardRef<HTMLAnchorElement, PortalRouteFeatureProps>(
  function PortalRouteFeature({ icon, label, href, openInNewTab = false, ...anchorProps }, ref) {
    const RouteIcon = icon;

    return (
      <Button asChild className="w-full">
        <a ref={ref} href={href} {...anchorProps}>
          <RouteIcon />
          <span className={cn(openInNewTab && "underline underline-offset-4")}>{label}</span>
        </a>
      </Button>
    );
  }
);
