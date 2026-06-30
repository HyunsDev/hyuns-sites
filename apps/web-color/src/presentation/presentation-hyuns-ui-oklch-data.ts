import type { AccentPreset } from "@hyunsdev/ui/lib/theme"

export type HyunsUiThemeId = "dark" | "light"

export type HyunsUiAccentId = AccentPreset

export type HyunsUiOklchCoordinate = {
  readonly chroma: number
  readonly hue: number
  readonly lightness: number
}

export type HyunsUiThemeTokenRole =
  | "accent"
  | "background"
  | "border"
  | "surface"
  | "text"

export type HyunsUiAccentToken = {
  readonly dark: HyunsUiOklchCoordinate
  readonly id: HyunsUiAccentId
  readonly label: string
  readonly light: HyunsUiOklchCoordinate
}

type HyunsUiThemeBaseTokenRole = Exclude<HyunsUiThemeTokenRole, "accent">

type HyunsUiThemeBaseToken = readonly [
  HyunsUiThemeBaseTokenRole,
  string,
  HyunsUiOklchCoordinate,
]

type HyunsUiThemeBaseTokenRow = {
  readonly label: string
  readonly tokens: readonly HyunsUiThemeBaseToken[]
}

const HYUNS_UI_DEFAULT_ACCENT_TOKEN = {
  dark: { chroma: 0, hue: 0, lightness: 0.985 },
  id: "default",
  label: "default",
  light: { chroma: 0, hue: 0, lightness: 0.205 },
} as const satisfies HyunsUiAccentToken

export const HYUNS_UI_ACCENT_TOKENS = [
  HYUNS_UI_DEFAULT_ACCENT_TOKEN,
  {
    dark: { chroma: 0.165, hue: 254.624, lightness: 0.707 },
    id: "blue",
    label: "blue",
    light: { chroma: 0.2529, hue: 253.376, lightness: 0.624 },
  },
  {
    dark: { chroma: 0.209, hue: 151.711, lightness: 0.792 },
    id: "green",
    label: "green",
    light: { chroma: 0.254, hue: 150.069, lightness: 0.627 },
  },
  {
    dark: { chroma: 0.199, hue: 91.936, lightness: 0.852 },
    id: "yellow",
    label: "yellow",
    light: { chroma: 0.173, hue: 86, lightness: 0.8079 },
  },
  {
    dark: { chroma: 0.202, hue: 349.761, lightness: 0.718 },
    id: "pink",
    label: "pink",
    light: { chroma: 0.253, hue: 3.958, lightness: 0.625 },
  },
  {
    dark: { chroma: 0.183, hue: 55.934, lightness: 0.75 },
    id: "orange",
    label: "orange",
    light: { chroma: 0.183, hue: 56.934, lightness: 0.693 },
  },
  {
    dark: { chroma: 0.203, hue: 305.504, lightness: 0.714 },
    id: "purple",
    label: "purple",
    light: { chroma: 0.265, hue: 301.924, lightness: 0.496 },
  },
] as const satisfies readonly HyunsUiAccentToken[]

export const HYUNS_UI_THEME_BASE_TOKENS = {
  dark: {
    label: "Dark",
    tokens: [
      ["background", "--background-primary", { chroma: 0, hue: 0, lightness: 0.24 }],
      ["surface", "--background-secondary", { chroma: 0, hue: 0, lightness: 0.21 }],
      ["border", "--border", { chroma: 0, hue: 0, lightness: 0.32 }],
      ["text", "--text-color", { chroma: 0, hue: 0, lightness: 0.95 }],
    ],
  },
  light: {
    label: "Light",
    tokens: [
      ["background", "--background-primary", { chroma: 0, hue: 0, lightness: 1 }],
      ["surface", "--background-secondary", { chroma: 0, hue: 0, lightness: 0.98 }],
      ["border", "--border", { chroma: 0, hue: 0, lightness: 0.922 }],
      ["text", "--text-color", { chroma: 0, hue: 0, lightness: 0.145 }],
    ],
  },
} as const satisfies Record<HyunsUiThemeId, HyunsUiThemeBaseTokenRow>

export function getHyunsUiAccentToken(
  accentId: HyunsUiAccentId
): HyunsUiAccentToken {
  return (
    HYUNS_UI_ACCENT_TOKENS.find((accent) => accent.id === accentId) ??
    HYUNS_UI_DEFAULT_ACCENT_TOKEN
  )
}
