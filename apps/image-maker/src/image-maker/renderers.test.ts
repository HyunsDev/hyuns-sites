import { describe, expect, it } from "vitest";
import { DEFAULT_IMAGE_OPTIONS } from "./presets";
import { renderImageSvg, sanitizeSvgText } from "./renderers";
import type { GraphicAsset } from "./types";

const asset: GraphicAsset = {
  kind: "brand",
  title: "Test",
  path: "M0 0h24v24H0z",
  color: "#111827"
};

describe("renderImageSvg", () => {
  it("renders icon and banner SVGs with configured dimensions", () => {
    const icon = renderImageSvg(asset, DEFAULT_IMAGE_OPTIONS, "icon");
    const banner = renderImageSvg(asset, DEFAULT_IMAGE_OPTIONS, "banner");

    expect(icon.width).toBe(512);
    expect(icon.height).toBe(512);
    expect(icon.svg).toContain('width="512"');
    expect(icon.svg).toContain('fill="#ffffff"');
    expect(banner.width).toBe(1920);
    expect(banner.height).toBe(1080);
    expect(banner.svg).toContain('viewBox="0 0 1920 1080"');
  });

  it("uses the configured banner graphic size", () => {
    const banner = renderImageSvg(
      asset,
      {
        ...DEFAULT_IMAGE_OPTIONS,
        bannerGraphicSize: 240
      },
      "banner"
    );

    expect(banner.svg).toContain("scale(10.000000)");
  });

  it("does not apply squircle curvature to banners", () => {
    const curvedBanner = renderImageSvg(
      asset,
      {
        ...DEFAULT_IMAGE_OPTIONS,
        curvature: 2
      },
      "banner"
    );
    const squircleBanner = renderImageSvg(
      asset,
      {
        ...DEFAULT_IMAGE_OPTIONS,
        curvature: 8
      },
      "banner"
    );
    const curvedIcon = renderImageSvg(
      asset,
      {
        ...DEFAULT_IMAGE_OPTIONS,
        curvature: 2
      },
      "icon"
    );
    const squircleIcon = renderImageSvg(
      asset,
      {
        ...DEFAULT_IMAGE_OPTIONS,
        curvature: 8
      },
      "icon"
    );

    expect(curvedBanner.svg).toBe(squircleBanner.svg);
    expect(curvedIcon.svg).not.toBe(squircleIcon.svg);
  });
});

describe("sanitizeSvgText", () => {
  it("removes script nodes and event attributes", () => {
    const parsed = sanitizeSvgText(
      '<svg viewBox="0 0 24 24"><script>alert(1)</script><path onclick="alert(1)" fill="currentColor" d="M0 0h24v24H0z"/></svg>'
    );

    expect(parsed?.viewBox).toBe("0 0 24 24");
    expect(parsed?.body).not.toContain("script");
    expect(parsed?.body).not.toContain("onclick");
    expect(parsed?.body).toContain("currentColor");
  });
});
