import "@testing-library/jest-dom/vitest";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { router } from "./router";

describe("Site UI Playground", () => {
  it("renders the playground-ui route index landing page", async () => {
    render(<RouterProvider router={router} />);

    expect(await screen.findByText("site-ui-playground")).toBeVisible();
    expect(
      screen.getByText("Explore Hyuns UI surfaces through reusable playground shell patterns.")
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /Foundations/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /Components/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /Layouts/ })).toBeVisible();
  });
});
