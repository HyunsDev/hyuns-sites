import { createFileRoute } from "@tanstack/react-router";
import { PlaygroundIndexPage } from "@workspace/playground-ui/PlaygroundRoute";

export const Route = createFileRoute("/layouts")({
  component: () => (
    <PlaygroundIndexPage
      title="layouts"
      description="Application shells and navigation layouts for playground-style product surfaces."
    />
  )
});
