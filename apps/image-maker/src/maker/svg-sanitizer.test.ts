import { describe, expect, it } from "vitest";

import { toCssColor } from "./color";
import { sanitizeSvg } from "./svg-sanitizer";

describe("sanitizeSvg", () => {
  it("removes executable SVG content and unsafe references", () => {
    const result = sanitizeSvg(`
      <svg width="24" height="24" onclick="alert(1)">
        <script>alert(1)</script>
        <path d="M0 0h24v24H0z" fill="red" onload="alert(2)" />
        <image href="https://example.com/pixel.png" />
      </svg>
    `);

    expect(result.isValid).toBe(true);
    expect(result.svg).not.toContain("<script");
    expect(result.svg).not.toContain("onclick");
    expect(result.svg).not.toContain("onload");
    expect(result.svg).not.toContain("<image");
    expect(result.svg).toContain('viewBox="0 0 24 24"');
  });
});

describe("toCssColor", () => {
  it("keeps sRGB colors as hex and converts display-p3 colors", () => {
    expect(toCssColor("#ff0000", "srgb")).toBe("#ff0000");
    expect(toCssColor("#ff0000", "display-p3")).toBe("color(display-p3 1.0000 0.0000 0.0000)");
  });
});
