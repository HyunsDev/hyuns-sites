import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Button } from "@hyunsdev/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@hyunsdev/ui/components/tooltip";
import { getPortalPage } from "../portal-data";
import type { PortalItem, PortalPage } from "../portal-data";
import { getPortalIcon } from "../portal-icons";
import {
  PortalIndexPage,
  PortalRouteColumn,
  PortalRouteFeature,
  PortalRouteGroup,
  PortalRouteIndex
} from "../portal-route";

function getPathFromParams(params: Record<string, string | undefined>) {
  const pageId = params.pageId;

  return pageId ? `/${pageId}` : "/";
}

function useOpenInNewTabModifier() {
  const [openInNewTab, setOpenInNewTab] = useState(false);

  useEffect(() => {
    const updateFromKeyboardEvent = (event: KeyboardEvent) => {
      setOpenInNewTab(event.metaKey || event.ctrlKey);
    };

    const reset = () => {
      setOpenInNewTab(false);
    };

    window.addEventListener("keydown", updateFromKeyboardEvent);
    window.addEventListener("keyup", updateFromKeyboardEvent);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);

    return () => {
      window.removeEventListener("keydown", updateFromKeyboardEvent);
      window.removeEventListener("keyup", updateFromKeyboardEvent);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);

  return openInNewTab;
}

function PortalItemButton({
  item,
  openInNewTab
}: {
  item: PortalItem;
  openInNewTab: boolean;
}) {
  const ItemIcon = getPortalIcon(item.icon);

  if (item.disabled) {
    return (
      <Button type="button" disabled className="w-full justify-start">
        {ItemIcon ? <ItemIcon /> : null}
        {item.label}
      </Button>
    );
  }

  if (item.path) {
    return (
      <PortalRouteIndex
        icon={ItemIcon}
        label={item.label}
        openInNewTab={openInNewTab}
        path={item.path}
        direction={item.direction}
      />
    );
  }

  if (item.href) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <PortalRouteFeature
            icon={ItemIcon}
            label={item.label}
            href={item.href}
            openInNewTab={openInNewTab}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
          />
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className="max-w-[min(320px,calc(100vw-32px))] overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs"
        >
          {item.href}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button type="button" disabled className="w-full justify-start">
      {ItemIcon ? <ItemIcon /> : null}
      {item.label}
    </Button>
  );
}

function PortalPageView({ page }: { page: PortalPage }) {
  const openInNewTab = useOpenInNewTabModifier();

  return (
    <PortalIndexPage title={page.title} description={page.description}>
      {page.columns.map((column, columnIndex) => (
        <PortalRouteColumn key={`${page.path}:column:${columnIndex}`}>
          {column.groups.map((group) => (
            <PortalRouteGroup
              key={`${page.path}:group:${group.title}`}
              name={group.title}
              icon={getPortalIcon(group.icon)}
            >
              {group.items.map((item) => (
                <PortalItemButton
                  key={`${group.title}:${item.label}`}
                  item={item}
                  openInNewTab={openInNewTab}
                />
              ))}
            </PortalRouteGroup>
          ))}
        </PortalRouteColumn>
      ))}
    </PortalIndexPage>
  );
}

export function HomeRoute() {
  const page = getPortalPage("/");

  if (!page) {
    throw new Error('Portal YAML: missing "/" page.');
  }

  return <PortalPageView page={page} />;
}

export function DynamicPageRoute() {
  const params = useParams({ strict: false }) as Record<string, string | undefined>;
  const page = getPortalPage(getPathFromParams(params));

  if (!page) {
    return <PortalIndexPage title="Not Found" />;
  }

  return <PortalPageView page={page} />;
}
