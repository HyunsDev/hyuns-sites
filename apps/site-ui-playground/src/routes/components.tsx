import { createFileRoute } from "@tanstack/react-router";
import { PlaygroundIndexPage } from "@workspace/playground-ui/PlaygroundRoute";

export const Route = createFileRoute("/components")({
  component: () => (
    <PlaygroundIndexPage
      title="components"
      description="Reusable controls and composed component states exposed through Hyuns UI."
    />
  )
});
