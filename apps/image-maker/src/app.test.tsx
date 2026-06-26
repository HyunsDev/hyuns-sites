import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "@/app";

describe("Image Maker", () => {
  it("renders the Workbench shell", () => {
    render(<App />);

    expect(screen.getByText("Image Maker")).toBeVisible();
    expect(screen.getByRole("button", { name: /Sites/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Lucide 아이콘" })).toBeVisible();
    expect(screen.getByRole("link", { name: /Developed By HyunsDev/i })).toHaveAttribute(
      "href",
      "https://github.com/HyunsDev/hyuns-sites"
    );
  });
});
