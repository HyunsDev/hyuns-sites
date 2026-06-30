import {
  HYUNS_UI_ACCENT_TOKENS,
  HYUNS_UI_THEME_BASE_TOKENS,
  getHyunsUiAccentToken,
  type HyunsUiAccentId,
  type HyunsUiOklchCoordinate,
  type HyunsUiThemeId,
  type HyunsUiThemeTokenRole,
} from "./presentation-hyuns-ui-oklch-data.ts"

export type {
  HyunsUiAccentId,
  HyunsUiOklchCoordinate,
  HyunsUiThemeId,
  HyunsUiThemeTokenRole,
} from "./presentation-hyuns-ui-oklch-data.ts"

export type HyunsUiAccentRow = {
  readonly color: string
  readonly coordinate: HyunsUiOklchCoordinate
  readonly id: HyunsUiAccentId
  readonly label: string
  readonly token: string
}

export type HyunsUiStateTokenRow = {
  readonly color: string
  readonly coordinate: HyunsUiOklchCoordinate
  readonly formula: string
  readonly id: "active" | "base" | "disabled" | "hover"
  readonly label: string
  readonly token: string
}

export type HyunsUiThemeToken = {
  readonly color: string
  readonly coordinate: HyunsUiOklchCoordinate
  readonly role: HyunsUiThemeTokenRole
  readonly token: string
}

export type HyunsUiThemeTokenRow = {
  readonly id: HyunsUiThemeId
  readonly label: string
  readonly tokens: readonly HyunsUiThemeToken[]
}

type AccentShift = {
  readonly alpha?: number
  readonly chromaDelta: number
  readonly coordinate: HyunsUiOklchCoordinate
  readonly lightnessDelta: number
}

const HYUNS_UI_THEME_IDS = ["light", "dark"] as const

export function createHyunsUiAccentRows(
  theme: HyunsUiThemeId = "light"
): readonly HyunsUiAccentRow[] {
  return HYUNS_UI_ACCENT_TOKENS.map((accent) => {
    const coordinate = accent[theme]

    return {
      color: formatOklch(coordinate),
      coordinate,
      id: accent.id,
      label: accent.label,
      token: `--accent-${accent.id}`,
    }
  })
}

export function createHyunsUiInteractiveAccentRows(
  theme: HyunsUiThemeId = "light",
  accentId: HyunsUiAccentId = "default"
): readonly HyunsUiStateTokenRow[] {
  const accent = getHyunsUiAccentToken(accentId)
  const coordinate = accent[theme]
  const direction = theme === "light" ? 1 : -1

  return [
    {
      color: formatOklch(coordinate),
      coordinate,
      formula: "--interactive-accent",
      id: "base",
      label: "base",
      token: "--interactive-accent",
    },
    createStateTokenRow({
      coordinate,
      formula: "--accent-1",
      id: "hover",
      label: "hover",
      lightnessDelta: direction * 0.03,
      token: "--interactive-accent-hover",
    }),
    createStateTokenRow({
      coordinate,
      formula: "--accent-3",
      id: "active",
      label: "active",
      lightnessDelta: direction * 0.09,
      token: "--interactive-accent-active-hover",
    }),
    createStateTokenRow({
      alpha: 0.5,
      coordinate,
      formula: "--accent-2 / .5",
      id: "disabled",
      label: "disabled",
      lightnessDelta: direction * 0.06,
      token: "--interactive-accent-disabled",
    }),
  ]
}

export function createHyunsUiThemeLightnessRows(
  accentId: HyunsUiAccentId = "default"
): readonly HyunsUiThemeTokenRow[] {
  const accent = getHyunsUiAccentToken(accentId)

  return HYUNS_UI_THEME_IDS.map((themeId) => {
    const row = HYUNS_UI_THEME_BASE_TOKENS[themeId]
    const accentCoordinate = accent[themeId]
    const tokens = [
      ...row.tokens,
      ["accent", `--accent-${accent.id}`, accentCoordinate],
    ] as const satisfies readonly (readonly [
      HyunsUiThemeTokenRole,
      string,
      HyunsUiOklchCoordinate,
    ])[]

    return {
      id: themeId,
      label: row.label,
      tokens: tokens.map(([role, token, coordinate]) => ({
        color: formatOklch(coordinate),
        coordinate,
        role,
        token,
      })),
    }
  })
}

function createStateTokenRow({
  alpha,
  coordinate,
  formula,
  id,
  label,
  lightnessDelta,
  token,
}: Omit<AccentShift, "chromaDelta"> & {
  readonly formula: string
  readonly id: HyunsUiStateTokenRow["id"]
  readonly label: string
  readonly token: string
}): HyunsUiStateTokenRow {
  const shiftedCoordinate = shiftCoordinate({
    alpha,
    chromaDelta: 0.005,
    coordinate,
    lightnessDelta,
  })

  return {
    color: formatOklch(shiftedCoordinate, alpha),
    coordinate: shiftedCoordinate,
    formula,
    id,
    label,
    token,
  }
}

function shiftCoordinate({
  chromaDelta,
  coordinate,
  lightnessDelta,
}: AccentShift): HyunsUiOklchCoordinate {
  return {
    chroma: roundCoordinatePart(coordinate.chroma + chromaDelta),
    hue: coordinate.hue,
    lightness: roundCoordinatePart(coordinate.lightness + lightnessDelta),
  }
}

function formatOklch(coordinate: HyunsUiOklchCoordinate, alpha?: number) {
  const value = `${coordinate.lightness} ${coordinate.chroma} ${coordinate.hue}`

  return alpha === undefined ? `oklch(${value})` : `oklch(${value} / ${alpha})`
}

function roundCoordinatePart(value: number) {
  return Math.round(value * 10000) / 10000
}
