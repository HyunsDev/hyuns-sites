import type { CSSProperties } from "react"

import { Button } from "@hyunsdev/ui/components/button"
import { Slider } from "@hyunsdev/ui/components/slider"
import { Switch } from "@hyunsdev/ui/components/switch"
import { useTheme } from "@hyunsdev/ui/components/theme-provider"
import { cn } from "@hyunsdev/ui/lib/utils"

import {
  createHyunsUiAccentRows,
  createHyunsUiInteractiveAccentRows,
  createHyunsUiThemeLightnessRows,
  type HyunsUiAccentId,
  type HyunsUiAccentRow,
  type HyunsUiStateTokenRow,
  type HyunsUiThemeToken,
} from "@/presentation/presentation-hyuns-ui-oklch-models"

type AccentPreviewStyle = CSSProperties & {
  readonly "--interactive-accent"?: string
  readonly "--interactive-accent-active-hover"?: string
  readonly "--interactive-accent-disabled"?: string
  readonly "--interactive-accent-hover"?: string
}

export function HyunsUiLightnessRoleDemo() {
  const accentId = useHyunsUiSelectedAccentId()
  const lightRow = createHyunsUiThemeLightnessRows(accentId).find(
    (row) => row.id === "light"
  )
  const tokens = lightRow?.tokens ?? []

  return (
    <div className="grid gap-[1.2cqw]">
      <div
        className="grid gap-[0.9cqw] rounded-md border border-border bg-background-primary/90 p-[1cqw]"
        style={createAccentPreviewStyle(accentId)}
      >
        <div className="grid gap-[0.7cqw] rounded-md border border-border bg-background-secondary p-[1cqw]">
          <div className="flex items-center justify-between gap-[1cqw]">
            <span className="font-mono text-[clamp(0.56rem,0.86cqw,0.72rem)] font-bold text-text-muted">
              Hyuns UI surface
            </span>
            <span className="rounded-md border border-border bg-background-primary px-[0.55cqw] py-[0.25cqw] text-[clamp(0.5rem,0.76cqw,0.64rem)] text-text-muted">
              semantic tokens
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-[0.7cqw]">
            <Button size="sm" variant="normal">
              normal
            </Button>
            <Button size="sm" variant="accent">
              accent
            </Button>
            <Button size="sm" variant="outline">
              outline
            </Button>
          </div>
        </div>
      </div>
      <ThemeTokenGrid tokens={tokens} />
    </div>
  )
}

export function HyunsUiAccentFamilyDemo() {
  const accentId = useHyunsUiSelectedAccentId()

  return (
    <div className="grid grid-cols-2 gap-[0.8cqw] sm:grid-cols-3">
      {createHyunsUiAccentRows().map((row) => (
        <AccentTokenCard key={row.id} row={row} selected={row.id === accentId} />
      ))}
    </div>
  )
}

export function HyunsUiStateSpecimen() {
  const accentId = useHyunsUiSelectedAccentId()
  const stateRows = createHyunsUiInteractiveAccentRows("light", accentId)

  return (
    <div className="grid gap-[1.1cqw]">
      <div
        className="grid gap-[1cqw] rounded-md border border-border bg-background-primary/90 p-[1cqw]"
        style={createAccentPreviewStyle(accentId)}
      >
        <div className="flex flex-wrap items-center gap-[0.8cqw]">
          <Button size="sm" variant="accent">
            Button
          </Button>
          <Switch defaultChecked size="sm" aria-label="Accent switch specimen" />
          <div className="w-[min(100%,12rem)] min-w-28">
            <Slider
              defaultValue={[68]}
              max={100}
              min={0}
              aria-label="Accent slider specimen"
            />
          </div>
          <Button size="sm" variant="accent" disabled>
            disabled
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[0.65cqw]">
        {stateRows.map((row) => (
          <StateTokenChip key={row.id} row={row} />
        ))}
      </div>
      <pre className="min-w-0 overflow-hidden rounded-md border border-border bg-background-primary/90 p-[0.8cqw]">
        <code className="block whitespace-pre-wrap text-[clamp(0.46rem,0.72cqw,0.62rem)] leading-[1.35] text-text-muted">
          {[
            "--interactive-accent: var(--accent);",
            "--interactive-accent-hover: var(--accent-1);",
            "--interactive-accent-active-hover: var(--accent-3);",
          ].join("\n")}
        </code>
      </pre>
    </div>
  )
}

export function HyunsUiThemeTokenMap() {
  const accentId = useHyunsUiSelectedAccentId()

  return (
    <div className="grid gap-[1.45cqw]">
      {createHyunsUiThemeLightnessRows(accentId).map((row) => (
        <div key={row.id} className="grid gap-[0.65cqw]">
          <code className="font-mono text-[clamp(0.68rem,1cqw,0.86rem)] font-bold text-text-muted">
            {row.label}
          </code>
          <ThemeTokenGrid tokens={row.tokens} />
        </div>
      ))}
    </div>
  )
}

function AccentTokenCard({
  row,
  selected,
}: {
  readonly row: HyunsUiAccentRow
  readonly selected: boolean
}) {
  return (
    <div
      aria-current={selected ? "true" : undefined}
      className="grid min-w-0 gap-[0.7cqw] rounded-md border border-border bg-background-primary/86 p-[0.8cqw]"
      style={{
        ...createAccentPreviewStyle(row.id),
        borderColor: selected ? "var(--interactive-accent)" : undefined,
      }}
    >
      <div
        className="h-[4.2cqw] min-h-8 rounded-sm border border-border"
        style={{ backgroundColor: row.color }}
      />
      <div className="grid gap-[0.22cqw]">
        <span className="truncate font-mono text-[clamp(0.56rem,0.86cqw,0.72rem)] font-bold">
          {row.token}
        </span>
        <code className="truncate text-[clamp(0.48rem,0.72cqw,0.6rem)] text-text-muted">
          {formatCoordinate(row.coordinate)}
        </code>
      </div>
      <Button size="xs" variant="accent" className="justify-self-start">
        button
      </Button>
    </div>
  )
}

function StateTokenChip({ row }: { readonly row: HyunsUiStateTokenRow }) {
  return (
    <div className="grid overflow-hidden rounded-md border border-border bg-background-primary/86">
      <div
        className="grid h-[4.4cqw] min-h-8 content-center px-[0.55cqw] text-text-on-accent"
        style={{ backgroundColor: row.color }}
      >
        <span className="truncate font-mono text-[clamp(0.48rem,0.72cqw,0.62rem)] font-bold">
          {row.label}
        </span>
      </div>
      <div className="grid gap-[0.18cqw] p-[0.5cqw]">
        <code className="truncate text-[clamp(0.46rem,0.68cqw,0.58rem)] leading-none text-text-muted">
          {row.token}
        </code>
        <span className="truncate text-[clamp(0.44rem,0.64cqw,0.54rem)] text-text-muted">
          {row.formula}
        </span>
      </div>
    </div>
  )
}

function ThemeTokenGrid({
  tokens,
}: {
  readonly tokens: readonly HyunsUiThemeToken[]
}) {
  return (
    <div className="grid grid-cols-5 gap-[0.65cqw]">
      {tokens.map((token) => (
        <ThemeTokenChip key={`${token.token}-${token.role}`} token={token} />
      ))}
    </div>
  )
}

function ThemeTokenChip({ token }: { readonly token: HyunsUiThemeToken }) {
  return (
    <div className="grid overflow-hidden rounded-md border border-border bg-background-primary/84">
      <div
        className={cn(
          "h-[4.4cqw] min-h-7",
          token.role === "text" && "border-b border-border"
        )}
        style={{ backgroundColor: token.color }}
      />
      <div className="grid gap-[0.18cqw] p-[0.5cqw]">
        <span className="truncate text-[clamp(0.5rem,0.8cqw,0.66rem)] font-bold">
          {token.role}
        </span>
        <code className="truncate text-[clamp(0.44rem,0.64cqw,0.54rem)] leading-none text-text-muted">
          L {token.coordinate.lightness}
        </code>
      </div>
    </div>
  )
}

function createAccentPreviewStyle(
  accentId: HyunsUiAccentId
): AccentPreviewStyle {
  const states = createHyunsUiInteractiveAccentRows("light", accentId)
  const base = states.find((row) => row.id === "base")
  const hover = states.find((row) => row.id === "hover")
  const active = states.find((row) => row.id === "active")
  const disabled = states.find((row) => row.id === "disabled")

  return {
    "--interactive-accent": base?.color,
    "--interactive-accent-active-hover": active?.color,
    "--interactive-accent-disabled": disabled?.color,
    "--interactive-accent-hover": hover?.color,
  } satisfies AccentPreviewStyle
}

function formatCoordinate(coordinate: HyunsUiAccentRow["coordinate"]) {
  return `L ${coordinate.lightness} / C ${coordinate.chroma} / H ${coordinate.hue}`
}

function useHyunsUiSelectedAccentId(): HyunsUiAccentId {
  const { accentPreset } = useTheme()

  return accentPreset
}
