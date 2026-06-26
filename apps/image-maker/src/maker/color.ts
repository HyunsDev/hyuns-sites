import type { ColorSpace } from "./types";

function parseHexColor(hex: string) {
  const normalized = hex.trim().replace(/^#/, "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized;

  if (!/^[0-9a-f]{6}$/i.test(value)) {
    return null;
  }

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  };
}

export function toCssColor(color: string, colorSpace: ColorSpace) {
  const rgb = parseHexColor(color);

  if (!rgb || colorSpace === "srgb") {
    return color;
  }

  return `color(display-p3 ${(rgb.r / 255).toFixed(4)} ${(rgb.g / 255).toFixed(4)} ${(rgb.b / 255).toFixed(4)})`;
}

export function getSupportsDisplayP3() {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("color", "color(display-p3 1 0 0)")
  );
}
