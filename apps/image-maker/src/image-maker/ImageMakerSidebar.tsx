import { Link } from "@tanstack/react-router";
import { siGithub } from "simple-icons";
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
import { REPOSITORY_LINK, SOURCE_CONFIGS } from "./source-config";
import type { SourceKind } from "./types";

type ImageMakerSidebarProps = {
  readonly activeKind: SourceKind;
};

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
              {SOURCE_CONFIGS.map((config) => {
                const SourceIcon = config.Icon;

                return (
                  <WorkbenchSidebarMenuItem key={config.kind}>
                    <WorkbenchSidebarMenuButton
                      asChild
                      isActive={config.kind === activeKind}
                      leadingVisual={<SourceIcon className="size-4" />}
                    >
                      <Link to={config.path}>{config.label}</Link>
                    </WorkbenchSidebarMenuButton>
                  </WorkbenchSidebarMenuItem>
                );
              })}
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
                  <path d={siGithub.path} />
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
