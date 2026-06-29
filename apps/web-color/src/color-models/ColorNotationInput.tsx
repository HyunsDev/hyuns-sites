import { Input } from "@hyunsdev/ui/components/input"
import { cn } from "@hyunsdev/ui/lib/utils"

import { getColorNotationInputState } from "./color-notation-input-models.ts"

export type ColorNotationInputProps = {
  readonly className?: string
  readonly inputAriaLabel?: string
  readonly label: string
  readonly onChange: (value: string) => void
  readonly value: string
}

export function ColorNotationInput({
  className,
  inputAriaLabel,
  label,
  onChange,
  value,
}: ColorNotationInputProps) {
  const inputState = getColorNotationInputState(value)
  const isParsed = inputState.status === "parsed"

  return (
    <label className={cn("grid gap-1.5 text-xs", className)}>
      <span className="font-medium">{label}</span>
      <span className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            "size-8 shrink-0 rounded-md border border-border bg-background-secondary",
            !isParsed && "border-border-error"
          )}
          style={
            isParsed ? { backgroundColor: inputState.swatchColor } : undefined
          }
        />
        <Input
          type="text"
          value={value}
          aria-label={inputAriaLabel ?? `${label} CSS color`}
          aria-invalid={isParsed ? undefined : true}
          spellCheck={false}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      </span>
    </label>
  )
}
