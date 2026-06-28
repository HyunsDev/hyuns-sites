import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";
import { App } from "./app";
import { ThumbnailOptionsPanel } from "./image-maker/ThumbnailOptionsPanel";
import { DEFAULT_THUMBNAIL_OPTIONS } from "./image-maker/presets";
import type { ThumbnailSourceImage } from "./image-maker/thumbnail-types";
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
    expect(screen.getByRole("link", { name: "Thumbnail" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Developed By HyunsDev" })).toHaveAttribute(
      "href",
      "https://github.com/HyunsDev/hyuns-sites"
    );
  });

  it("shows icon and banner preview export controls", async () => {
    renderImageMaker();

    expect(await screen.findByAltText("Custom SVG 아이콘 미리보기")).toBeVisible();
    expect(screen.getByAltText("Custom SVG 배너 미리보기")).toBeVisible();
    expect(screen.getAllByRole("button", { name: "SVG 복사" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "PNG 다운로드" })).toHaveLength(2);
  });

  it("renders image size controls as compact number inputs", async () => {
    renderImageMaker();

    expect(await screen.findByLabelText("Icon size")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Banner width")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Banner height")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Banner icon")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Banner icon")).toHaveValue(128);
    expect(screen.queryByText("Banner width")).not.toBeInTheDocument();
    expect(screen.queryByText("Banner height")).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: "Icon size" })).not.toBeInTheDocument();
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

  it("shows icon library links at the bottom of the SVG options panel", async () => {
    renderImageMaker("/svg");

    const iconLibraries = await screen.findByRole("navigation", { name: "Icon libraries" });

    expect(iconLibraries).toContainElement(screen.getByRole("link", { name: "Lucide Icons" }));
    expect(screen.getByRole("link", { name: "Lucide Icons" })).toHaveAttribute(
      "href",
      "https://lucide.dev/icons"
    );
    expect(iconLibraries).toContainElement(screen.getByRole("link", { name: "Simple Icons" }));
    expect(screen.getByRole("link", { name: "Simple Icons" })).toHaveAttribute(
      "href",
      "https://simpleicons.org/"
    );
  });

  it("renders the thumbnail generator route", async () => {
    renderImageMaker("/thumbnail");

    expect(await screen.findByRole("heading", { name: "Thumbnail" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Desktop" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByLabelText("Thumbnail width")).toHaveValue(1920);
    expect(screen.getByLabelText("Thumbnail height")).toHaveValue(1080);
    expect(screen.getByLabelText("Background picker")).toHaveValue("#f1f1f1");
    expect(screen.getByRole("button", { name: "Auto background" })).toBeDisabled();
    expect(screen.getByLabelText("Top padding", { selector: "input" })).toHaveValue(140);
    expect(screen.getByLabelText("Image radius", { selector: "input" })).toHaveValue(20);
    expect(screen.getByLabelText("Thumbnail image files")).toBeVisible();
  });

  it("enables thumbnail auto background when an image suggestion exists", () => {
    const onAutoBackground = vi.fn();
    const image: ThumbnailSourceImage = {
      colorProfile: {
        hue: 210,
        luminance: 0.2,
        saturation: 0.7,
        weight: 1
      },
      dataUrl: "data:image/png;base64,test",
      height: 900,
      id: "desktop",
      suggestedBackgroundColor: "#dbeafe",
      title: "Desktop",
      width: 1600
    };

    render(
      <ThumbnailOptionsPanel
        autoBackgroundColor="#dbeafe"
        images={[image]}
        options={DEFAULT_THUMBNAIL_OPTIONS}
        onAutoBackground={onAutoBackground}
        onClearImages={() => undefined}
        onFilesAdded={() => undefined}
        onOptionsChange={() => undefined}
      />
    );

    const autoButton = screen.getByRole("button", { name: "Auto background" });

    expect(autoButton).toBeEnabled();
    fireEvent.click(autoButton);
    expect(onAutoBackground).toHaveBeenCalledOnce();
  });
});
