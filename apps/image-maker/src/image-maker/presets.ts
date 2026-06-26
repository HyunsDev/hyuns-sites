import type { ColorPreset, ImageMakerOptions } from "./types";

const USER_PRESET_STORAGE_KEY = "hyunsdev:image-maker:color-presets";
const DEFAULT_ICON_SIZE = 512;
const IOS_APP_ICON_RADIUS_RATIO = 0.234375;

export const DEFAULT_IMAGE_OPTIONS: ImageMakerOptions = {
  iconSize: DEFAULT_ICON_SIZE,
  bannerWidth: 1920,
  bannerHeight: 1080,
  bannerGraphicSize: 512,
  backgroundColor: "#111827",
  iconColor: "#ffffff",
  borderRadius: Math.round(DEFAULT_ICON_SIZE * IOS_APP_ICON_RADIUS_RATIO),
  curvature: 5,
  padding: 96
};

export const DEFAULT_COLOR_PRESETS: readonly ColorPreset[] = [
  {
    id: "transparent",
    name: "Transparent",
    backgroundColor: "transparent",
    iconColor: "#111827"
  },
  {
    id: "ink",
    name: "Ink",
    backgroundColor: "#111827",
    iconColor: "#ffffff"
  },
  {
    id: "paper",
    name: "Paper",
    backgroundColor: "#ffffff",
    iconColor: "#111827"
  },
  {
    id: "hyunsdev",
    name: "HyunsDev",
    backgroundColor: "#0f172a",
    iconColor: "#38bdf8"
  },
  {
    id: "lime",
    name: "Lime",
    backgroundColor: "#052e16",
    iconColor: "#bef264"
  }
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isColorPreset(value: unknown): value is ColorPreset {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.backgroundColor === "string" &&
    typeof value.iconColor === "string"
  );
}

function parseStoredPresets(value: string | null): readonly ColorPreset[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isColorPreset);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return [];
    }

    throw error;
  }
}

export function readUserColorPresets(storage: Storage = window.localStorage) {
  return parseStoredPresets(storage.getItem(USER_PRESET_STORAGE_KEY));
}

export function writeUserColorPresets(
  presets: readonly ColorPreset[],
  storage: Storage = window.localStorage
) {
  storage.setItem(USER_PRESET_STORAGE_KEY, JSON.stringify(presets));
}

export function createUserColorPreset(options: ImageMakerOptions): ColorPreset {
  const now = new Date();
  const time = now.toISOString().replaceAll(/[-:.TZ]/g, "").slice(0, 14);

  return {
    id: `custom-${time}`,
    name: `Custom ${time.slice(8, 12)}`,
    backgroundColor: options.backgroundColor,
    iconColor: options.iconColor
  };
}
