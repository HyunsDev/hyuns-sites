import { createFileRoute } from "@tanstack/react-router";
import { PlaygroundIndexPage } from "@hyunsdev/playground-ui/PlaygroundRoute";

export const Route = createFileRoute("/foundations")({
  component: () => (
    <PlaygroundIndexPage
      title="foundations"
      description="Theme tokens, typography, spacing, and surface rules for Hyuns UI consumers."
    />
  )
});
