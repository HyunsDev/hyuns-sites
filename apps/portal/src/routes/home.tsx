import {
  AtSignIcon,
  BookOpenTextIcon,
  CameraIcon,
  CaptionsIcon,
  ChartSplineIcon,
  Code2Icon,
  ExternalLinkIcon,
  FolderIcon,
  Globe2Icon,
  HouseIcon,
  MessageCircleIcon,
  NotebookTextIcon,
  TvMinimalPlayIcon,
  WrenchIcon
} from "lucide-react";
import {
  PortalIndexPage,
  PortalRouteColumn,
  PortalRouteFeature,
  PortalRouteGroup,
  PortalRouteIndex
} from "../portal-route";

export function HomeRoute() {
  return (
    <PortalIndexPage title="Portal">
      <PortalRouteColumn>
        <PortalRouteGroup name="개인 웹사이트" icon={Globe2Icon}>
          <PortalRouteFeature icon={Code2Icon} label="HyunsDev" href="https://hyuns.dev" />
          <PortalRouteFeature icon={HouseIcon} label="현우공간" href="https://hyuns.space" />
          <PortalRouteFeature
            icon={CaptionsIcon}
            label="Subtitle"
            href="https://subtitle.hyuns.dev"
          />
        </PortalRouteGroup>

        <PortalRouteGroup name="유틸리티" icon={WrenchIcon}>
          <PortalRouteFeature
            icon={NotebookTextIcon}
            label="PKM Utils"
            href="https://pkm-utils.hyuns.dev"
          />
          <PortalRouteFeature
            icon={ChartSplineIcon}
            label="Cubic Bezier"
            href="https://cubic-bezier.hyuns.dev"
          />
        </PortalRouteGroup>
      </PortalRouteColumn>

      <PortalRouteColumn>
        <PortalRouteGroup name="프로젝트" icon={FolderIcon}>
          <PortalRouteIndex icon={FolderIcon} label="Projects" path="/projects" />
        </PortalRouteGroup>
      </PortalRouteColumn>

      <PortalRouteColumn>
        <PortalRouteGroup name="외부 링크" icon={ExternalLinkIcon}>
          <PortalRouteFeature
            icon={BookOpenTextIcon}
            label="블로그"
            href="https://velog.io/@phw3071"
          />
          <PortalRouteFeature
            icon={TvMinimalPlayIcon}
            label="유튜브 (개발)"
            href="https://www.youtube.com/@hyunsdev"
          />
          <PortalRouteFeature
            icon={TvMinimalPlayIcon}
            label="유튜브 (영상)"
            href="https://www.youtube.com/@hyuns_production"
          />
          <PortalRouteFeature
            icon={AtSignIcon}
            label="인스타그램 (개인)"
            href="https://www.instagram.com/hyunsdev"
          />
          <PortalRouteFeature
            icon={CameraIcon}
            label="인스타그램 (현우공간)"
            href="https://www.instagram.com/hyuns.space"
          />
          <PortalRouteFeature
            icon={CameraIcon}
            label="인스타그램 (일상)"
            href="https://www.instagram.com/hyuns.privacy"
          />
          <PortalRouteFeature
            icon={MessageCircleIcon}
            label="Threads"
            href="https://www.instagram.com/hyunsdev"
          />
        </PortalRouteGroup>
      </PortalRouteColumn>
    </PortalIndexPage>
  );
}
