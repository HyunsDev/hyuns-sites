import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./app";

describe("App", () => {
  it("renders the workspace example", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "hyuns-sites" })
    ).toBeVisible();
  });
});
