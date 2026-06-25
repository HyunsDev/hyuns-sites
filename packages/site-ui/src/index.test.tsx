import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from ".";

describe("@workspace/site-ui", () => {
  it("re-exports the base Button", () => {
    render(<Button>Open site</Button>);

    expect(screen.getByRole("button", { name: "Open site" })).toBeVisible();
  });
});
