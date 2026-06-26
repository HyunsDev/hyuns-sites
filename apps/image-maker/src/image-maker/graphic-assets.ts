import { sanitizeSvgText } from "./renderers";
import type { GraphicAsset } from "./types";

export function svgGraphicFromText(svgText: string): GraphicAsset | null {
  const svg = sanitizeSvgText(svgText);

  if (!svg) {
    return null;
  }

  return {
    kind: "svg",
    title: "Custom SVG",
    svg
  };
}
