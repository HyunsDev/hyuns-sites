import { describe, expect, it } from "vitest";
import { DEFAULT_THUMBNAIL_OPTIONS } from "./presets";
import { renderThumbnailSvg } from "./thumbnail-renderer";
import type { ThumbnailSourceImage } from "./thumbnail-types";

const image: ThumbnailSourceImage = {
  colorProfile: null,
  dataUrl: "data:image/png;base64,test",
  height: 900,
  id: "desktop",
  suggestedBackgroundColor: null,
  title: "Desktop",
  width: 1600
};

const mobileImages: readonly ThumbnailSourceImage[] = [
  {
    colorProfile: null,
    dataUrl: "data:image/png;base64,one",
    height: 2532,
    id: "one",
    suggestedBackgroundColor: null,
    title: "One",
    width: 1170
  },
  {
    colorProfile: null,
    dataUrl: "data:image/png;base64,two",
    height: 2532,
    id: "two",
    suggestedBackgroundColor: null,
    title: "Two",
    width: 1170
  }
];

describe("renderThumbnailSvg", () => {
  it("uses the default thumbnail background, top padding, and image radius", () => {
    const thumbnail = renderThumbnailSvg([image], DEFAULT_THUMBNAIL_OPTIONS);

    expect(thumbnail?.svg).toContain('fill="#f1f1f1"');
    expect(thumbnail?.svg).toContain('y="140.00"');
    expect(thumbnail?.svg).toContain('rx="20"');
    expect(thumbnail?.svg).toContain('clip-path="url(#thumbnail-image-clip-0)"');
  });

  it("renders desktop bottom thumbnails from horizontal and top padding", () => {
    const thumbnail = renderThumbnailSvg([image], {
      ...DEFAULT_THUMBNAIL_OPTIONS,
      horizontalPadding: 160,
      verticalPadding: 120
    });

    expect(thumbnail?.width).toBe(1920);
    expect(thumbnail?.height).toBe(1080);
    expect(thumbnail?.mode).toBe("thumbnail");
    expect(thumbnail?.svg).toContain('x="160.00"');
    expect(thumbnail?.svg).toContain('y="120.00"');
    expect(thumbnail?.svg).toContain('width="1600.00"');
    expect(thumbnail?.svg).toContain('height="900.00"');
    expect(thumbnail?.svg).toContain('filter="url(#thumbnail-image-shadow)"');
  });

  it("centers mobile thumbnails as one grouped row with the configured gap", () => {
    const thumbnail = renderThumbnailSvg(mobileImages, {
      ...DEFAULT_THUMBNAIL_OPTIONS,
      mode: "mobile",
      horizontalPadding: 100,
      mobileGap: 40,
      verticalPadding: 80
    });

    expect(thumbnail?.svg).toContain('x="514.88"');
    expect(thumbnail?.svg).toContain('x="980.00"');
    expect(thumbnail?.svg).toContain('width="425.12"');
    expect(thumbnail?.svg).toContain('height="920.00"');
  });

  it("does not apply shadow in image mode", () => {
    const thumbnail = renderThumbnailSvg([image], {
      ...DEFAULT_THUMBNAIL_OPTIONS,
      mode: "image"
    });

    expect(thumbnail?.svg).not.toContain("thumbnail-image-shadow");
    expect(thumbnail?.svg).not.toContain("filter=");
  });

  it("clips desktop and mobile images with the configured border radius", () => {
    const desktopThumbnail = renderThumbnailSvg([image], {
      ...DEFAULT_THUMBNAIL_OPTIONS,
      imageBorderRadius: 24
    });
    const mobileThumbnail = renderThumbnailSvg(mobileImages, {
      ...DEFAULT_THUMBNAIL_OPTIONS,
      imageBorderRadius: 32,
      mode: "mobile"
    });

    expect(desktopThumbnail?.svg).toContain('id="thumbnail-image-clip-0"');
    expect(desktopThumbnail?.svg).toContain('rx="24"');
    expect(desktopThumbnail?.svg).toContain('clip-path="url(#thumbnail-image-clip-0)"');
    expect(mobileThumbnail?.svg).toContain('id="thumbnail-image-clip-1"');
    expect(mobileThumbnail?.svg).toContain('rx="32"');
    expect(mobileThumbnail?.svg).toContain('clip-path="url(#thumbnail-image-clip-1)"');
  });

  it("does not clip image mode thumbnails", () => {
    const thumbnail = renderThumbnailSvg([image], {
      ...DEFAULT_THUMBNAIL_OPTIONS,
      imageBorderRadius: 48,
      mode: "image"
    });

    expect(thumbnail?.svg).not.toContain("clipPath");
    expect(thumbnail?.svg).not.toContain("clip-path");
  });
});
