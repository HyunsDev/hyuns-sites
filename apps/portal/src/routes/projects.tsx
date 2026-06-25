import { FolderClockIcon, FolderIcon, HomeIcon } from "lucide-react";
import { Button } from "@hyunsdev/ui/components/button";
import {
  PortalIndexPage,
  PortalRouteColumn,
  PortalRouteGroup,
  PortalRouteIndex
} from "../portal-route";

export function ProjectsRoute() {
  return (
    <PortalIndexPage title="Projects">
      <PortalRouteColumn>
        <PortalRouteGroup name="프로젝트" icon={FolderIcon}>
          <Button type="button" disabled className="justify-start">
            <FolderClockIcon />
            추후 추가 예정
          </Button>
          <PortalRouteIndex icon={HomeIcon} label="Portal" path="/" direction="prev" />
        </PortalRouteGroup>
      </PortalRouteColumn>
    </PortalIndexPage>
  );
}
