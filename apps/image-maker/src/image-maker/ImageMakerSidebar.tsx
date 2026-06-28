import { Link } from "@tanstack/react-router";
import { FileCode2Icon, ImageIcon, PanelsTopLeftIcon } from "lucide-react";
import {
  WorkbenchPrimarySidebar,
  WorkbenchSidebarContent,
  WorkbenchSidebarFooter,
  WorkbenchSidebarGroup,
  WorkbenchSidebarGroupContent,
  WorkbenchSidebarGroupLabel,
  WorkbenchSidebarHeader,
  WorkbenchSidebarMenu,
  WorkbenchSidebarMenuButton,
  WorkbenchSidebarMenuItem
} from "@hyunsdev/ui/layouts/workbench";
import { NAVIGATION_CONFIGS, REPOSITORY_LINK } from "./source-config";
import { assertNever } from "./types";
import type { ImageMakerNavKind } from "./source-config";

type ImageMakerSidebarProps = {
  readonly activeKind: ImageMakerNavKind;
};

const GITHUB_ICON_PATH =
  "M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.56v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.19 1.18.93-.26 1.92-.39 2.91-.39.99 0 1.98.13 2.91.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13v3.15c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z";

function SourceIcon({ kind }: { readonly kind: ImageMakerNavKind }) {
  switch (kind) {
    case "svg":
      return <FileCode2Icon aria-hidden="true" className="size-4" />;
    case "png":
      return <ImageIcon aria-hidden="true" className="size-4" />;
    case "thumbnail":
      return <PanelsTopLeftIcon aria-hidden="true" className="size-4" />;
    default:
      return assertNever(kind);
  }
}

export function ImageMakerSidebar({ activeKind }: ImageMakerSidebarProps) {
  return (
    <WorkbenchPrimarySidebar>
      <WorkbenchSidebarHeader>
        <div className="grid gap-1 px-2 py-1">
          <p className="text-base font-semibold leading-6">Image Maker</p>
          <p className="text-xs leading-4 text-muted-foreground">Icons and banners</p>
        </div>
      </WorkbenchSidebarHeader>
      <WorkbenchSidebarContent>
        <WorkbenchSidebarGroup>
          <WorkbenchSidebarGroupLabel>Sources</WorkbenchSidebarGroupLabel>
          <WorkbenchSidebarGroupContent>
            <WorkbenchSidebarMenu>
              {NAVIGATION_CONFIGS.map((config) => (
                <WorkbenchSidebarMenuItem key={config.kind}>
                  <WorkbenchSidebarMenuButton
                    asChild
                    isActive={config.kind === activeKind}
                    leadingVisual={<SourceIcon kind={config.kind} />}
                  >
                    <Link to={config.path}>{config.label}</Link>
                  </WorkbenchSidebarMenuButton>
                </WorkbenchSidebarMenuItem>
              ))}
            </WorkbenchSidebarMenu>
          </WorkbenchSidebarGroupContent>
        </WorkbenchSidebarGroup>
      </WorkbenchSidebarContent>
      <WorkbenchSidebarFooter>
        <WorkbenchSidebarMenu>
          <WorkbenchSidebarMenuItem>
            <WorkbenchSidebarMenuButton
              asChild
              leadingVisual={
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
                  <path d={GITHUB_ICON_PATH} />
                </svg>
              }
            >
              <a href={REPOSITORY_LINK.href} target="_blank" rel="noreferrer">
                {REPOSITORY_LINK.label}
              </a>
            </WorkbenchSidebarMenuButton>
          </WorkbenchSidebarMenuItem>
        </WorkbenchSidebarMenu>
      </WorkbenchSidebarFooter>
    </WorkbenchPrimarySidebar>
  );
}
