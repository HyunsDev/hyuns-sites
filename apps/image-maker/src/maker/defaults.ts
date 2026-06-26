import type { AssetKind, MakerOptions, SourceKind } from "./types";

export const APPLE_SQUIRCLE_RADIUS_PERCENT = 22.37;

export const DEFAULT_ICON_SIZE = 512;
export const DEFAULT_BANNER_WIDTH = 1920;
export const DEFAULT_BANNER_HEIGHT = 1080;

export function createDefaultOptions(asset: AssetKind, source: SourceKind): MakerOptions {
  const isBanner = asset === "banner";

  return {
    width: isBanner ? DEFAULT_BANNER_WIDTH : DEFAULT_ICON_SIZE,
    height: isBanner ? DEFAULT_BANNER_HEIGHT : DEFAULT_ICON_SIZE,
    backgroundColor: "#111827",
    iconColor: source === "brand" ? "#ffffff" : "#f9fafb",
    paddingPercent: isBanner ? 12 : 24,
    radiusPercent: isBanner ? 0 : APPLE_SQUIRCLE_RADIUS_PERCENT,
    colorSpace: source === "png" ? "srgb" : "srgb"
  };
}

export function normalizeOptionsForMode(
  options: MakerOptions,
  asset: AssetKind,
  source: SourceKind
): MakerOptions {
  const defaults = createDefaultOptions(asset, source);
  const isBanner = asset === "banner";

  return {
    ...options,
    width: isBanner ? DEFAULT_BANNER_WIDTH : options.width || defaults.width,
    height: isBanner ? DEFAULT_BANNER_HEIGHT : options.height || defaults.height,
    paddingPercent: Number.isFinite(options.paddingPercent)
      ? options.paddingPercent
      : defaults.paddingPercent,
    radiusPercent: isBanner ? 0 : options.radiusPercent || defaults.radiusPercent,
    colorSpace: source === "png" ? "srgb" : options.colorSpace
  };
}
