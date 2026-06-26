import type { MakerOptions } from "./types";

export type ColorPreset = {
  id: string;
  name: string;
  options: Pick<MakerOptions, "backgroundColor" | "iconColor" | "paddingPercent" | "radiusPercent">;
};

export const defaultColorPresets: ColorPreset[] = [
  {
    id: "ink",
    name: "Ink",
    options: {
      backgroundColor: "#111827",
      iconColor: "#f9fafb",
      paddingPercent: 24,
      radiusPercent: 22.37
    }
  },
  {
    id: "paper",
    name: "Paper",
    options: {
      backgroundColor: "#f8fafc",
      iconColor: "#0f172a",
      paddingPercent: 24,
      radiusPercent: 22.37
    }
  },
  {
    id: "signal",
    name: "Signal",
    options: {
      backgroundColor: "#0f172a",
      iconColor: "#38bdf8",
      paddingPercent: 22,
      radiusPercent: 22.37
    }
  }
];

const userPresetStorageKey = "hyunsdev:image-maker:color-presets";

export function readUserColorPresets() {
  try {
    const value = window.localStorage.getItem(userPresetStorageKey);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value) as ColorPreset[];

    return parsed.filter((preset) => preset.id && preset.name && preset.options);
  } catch {
    return [];
  }
}

export function writeUserColorPresets(presets: ColorPreset[]) {
  window.localStorage.setItem(userPresetStorageKey, JSON.stringify(presets));
}
