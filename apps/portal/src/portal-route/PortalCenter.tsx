import type { ReactNode } from "react";
import {
  CenterContent,
  CenterFooter,
  CenterHeader,
  CenterLayout
} from "@hyunsdev/ui/layouts/center";
import { PortalTools } from "./PortalTools";

export function PortalCenter({
  children,
  title,
  description,
  width = "min(100vw - 2rem, 620px)",
  className
}: {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  width?: string;
  className?: string;
}) {
  return (
    <CenterLayout className={className}>
      <CenterHeader className="flex flex-col gap-1 py-3">
        {title ? <code className="text-sm font-bold">{title}</code> : null}
        {description ? <p className="text-text-muted text-center text-xs">{description}</p> : null}
      </CenterHeader>
      <CenterContent style={{ width }}>{children}</CenterContent>
      <CenterFooter className="py-3">
        <PortalTools />
      </CenterFooter>
    </CenterLayout>
  );
}
