import "@testing-library/jest-dom/vitest";
import { RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { router } from "./router";

describe("Site UI Playground", () => {
  it("renders the temporary empty page", async () => {
    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId("site-ui-playground")).toBeVisible();
  });
});
