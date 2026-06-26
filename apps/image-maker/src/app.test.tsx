import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { App } from "./app";
import { getRouter } from "./router";

function renderImageMaker(path = "/svg") {
  const history = createMemoryHistory({
    initialEntries: [path]
  });
  const router = getRouter({ history });

  return render(<App router={router} />);
}

describe("Image Maker", () => {
  it("renders the Workbench source navigation", async () => {
    renderImageMaker();

    expect(await screen.findByText("Image Maker")).toBeVisible();
    expect(screen.getByRole("link", { name: "Svg 아이콘/배너" })).toBeVisible();
    expect(screen.getByRole("link", { name: "PNG 아이콘/배너" })).toBeVisible();
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Developed By HyunsDev" })).toHaveAttribute(
      "href",
      "https://github.com/HyunsDev/hyuns-sites"
    );
  });

  it("shows icon and banner preview export controls", async () => {
    renderImageMaker();

    expect(await screen.findByText("아이콘 미리보기")).toBeVisible();
    expect(screen.getByText("배너 미리보기")).toBeVisible();
    expect(screen.getAllByRole("button", { name: "SVG 복사" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "PNG 다운로드" })).toHaveLength(2);
  });

  it("renders image size controls as compact number inputs", async () => {
    renderImageMaker();

    expect(await screen.findByLabelText("Icon image")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Banner width")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Banner height")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Banner icon")).toHaveAttribute("type", "number");
    expect(screen.queryByText("Banner width")).not.toBeInTheDocument();
    expect(screen.queryByText("Banner height")).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "Icon image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "Banner width" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "Banner height" })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "Banner icon" })).not.toBeInTheDocument();
  });

  it("renders the SVG source route", async () => {
    renderImageMaker("/svg");

    expect(await screen.findByRole("heading", { name: "Svg 아이콘/배너" })).toBeVisible();
    expect(screen.getByLabelText("SVG source")).toBeVisible();
    expect(screen.getByRole("button", { name: "Reset SVG" })).toBeVisible();
  });
});
