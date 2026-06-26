import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <main
      aria-label="Site UI Playground"
      className="min-h-[100svh]"
      data-testid="site-ui-playground"
    />
  )
});
