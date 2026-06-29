import { useMemo, useState } from "react"

import { Button } from "@hyunsdev/ui/components/button"
import { cn } from "@hyunsdev/ui/lib/utils"

import { ColorNotationInput } from "@/color-models/ColorNotationInput"
import {
  COLOR_MODEL_DECISION_ROWS,
  createStateColorRelations,
  createThemeLightnessRows,
  type StateColorRow,
  type ThemeToken,
} from "@/presentation/presentation-oklch-practice-models"

export function StateColorRelationDemo() {
  const [colorInput, setColorInput] = useState("oklch(70% 0.18 32)")
  const result = useMemo(
    () => createStateColorRelations(colorInput),
    [colorInput]
  )

  return (
    <div className="grid gap-[1cqw]">
      <ColorNotationInput
        label="base color"
        value={colorInput}
        onChange={setColorInput}
      />
      <div className="grid grid-cols-4 gap-[0.65cqw]">
        {result.rows.map((row) => (
          <StateButton key={row.id} row={row} />
        ))}
      </div>
      <pre className="min-w-0 overflow-hidden rounded-md border border-border bg-background-primary/90 p-[0.9cqw]">
        <code
          className={cn(
            "block whitespace-pre-wrap text-[clamp(0.48rem,0.76cqw,0.66rem)] leading-[1.32] text-text-muted",
            result.status === "invalid" && "text-field-text-error"
          )}
        >
          {result.status === "parsed" ? result.cssExample : "invalid color"}
        </code>
      </pre>
    </div>
  )
}

export function ThemeTokenLightnessMap() {
  return (
    <div className="grid gap-[1.8cqw]">
      {createThemeLightnessRows().map((row) => (
        <div key={row.id} className="grid gap-[0.7cqw]">
          <code className="font-mono text-[clamp(0.7rem,1cqw,0.86rem)] font-bold text-text-muted">
            {row.label}
          </code>
          <div className="grid grid-cols-5 gap-[0.8cqw]">
            {row.tokens.map((token) => (
              <ThemeTokenChip key={`${row.id}-${token.role}`} token={token} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ColorModelDecisionTable() {
  return (
    <div className="grid gap-[1.8cqw]">
      <div className="grid grid-cols-3 gap-[1cqw]">
        {COLOR_MODEL_DECISION_ROWS.map((row) => (
          <div
            key={row.model}
            className={cn(
              "grid min-h-[18cqh] content-center gap-[0.8cqw] rounded-md border border-border bg-background-primary/84 p-[1.4cqw]",
              row.model === "OKLCH" && "border-text-normal bg-background-primary"
            )}
          >
            <span className="text-center text-[clamp(1rem,1.75cqw,1.45rem)] leading-tight font-bold">
              {row.model}
            </span>
            <span className="text-center text-[clamp(0.68rem,1cqw,0.86rem)] leading-tight text-text-muted">
              {row.use}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-[clamp(0.9rem,1.45cqw,1.18rem)] leading-tight font-bold text-balance">
        RGB는 표시, HSL/HSV는 선택, OKLCH는 설계
      </p>
    </div>
  )
}

type StateButtonProps = {
  readonly row: StateColorRow
}

function StateButton({ row }: StateButtonProps) {
  return (
    <Button
      type="button"
      className="h-[5.6cqw] min-h-9 px-[0.7cqw] font-mono"
      disabled={row.id === "disabled"}
      style={{
        backgroundColor: row.color,
        borderColor: row.color,
        color: "#fff",
        opacity: row.id === "disabled" ? 0.52 : 1,
      }}
      title={row.css}
    >
      <span>{row.label}</span>
    </Button>
  )
}

type ThemeTokenChipProps = {
  readonly token: ThemeToken
}

function ThemeTokenChip({ token }: ThemeTokenChipProps) {
  return (
    <div className="grid overflow-hidden rounded-md border border-border bg-background-primary/84">
      <div
        className="h-[4.8cqw] min-h-7"
        style={{ backgroundColor: token.color }}
      />
      <div className="grid gap-[0.2cqw] p-[0.5cqw]">
        <span className="truncate text-[clamp(0.58rem,0.92cqw,0.76rem)] font-bold">
          {token.role}
        </span>
        <code className="text-[clamp(0.5rem,0.78cqw,0.64rem)] leading-none text-text-muted">
          L {token.lightness}
        </code>
      </div>
    </div>
  )
}
