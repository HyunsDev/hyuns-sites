import { createFileRoute } from "@tanstack/react-router";
import {
  PlaygroundIndexPage,
  PlaygroundRouteColumn,
  PlaygroundRouteGroup,
  PlaygroundRouteIndex
} from "@workspace/playground-ui/PlaygroundRoute";
import {
  BlocksIcon,
  ComponentIcon,
  LayoutPanelLeftIcon,
  PaletteIcon
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: () => (
    <PlaygroundIndexPage
      title="site-ui-playground"
      description="Explore Hyuns UI surfaces through reusable playground shell patterns."
    >
      <PlaygroundRouteColumn>
        <PlaygroundRouteGroup name="Library" icon={BlocksIcon}>
          <PlaygroundRouteIndex
            icon={PaletteIcon}
            label="Foundations"
            path="/foundations"
          />
          <PlaygroundRouteIndex
            icon={ComponentIcon}
            label="Components"
            path="/components"
          />
          <PlaygroundRouteIndex
            icon={LayoutPanelLeftIcon}
            label="Layouts"
            path="/layouts"
          />
        </PlaygroundRouteGroup>
      </PlaygroundRouteColumn>
    </PlaygroundIndexPage>
  )
});
