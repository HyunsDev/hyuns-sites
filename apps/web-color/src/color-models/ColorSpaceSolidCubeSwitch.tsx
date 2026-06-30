import { Switch } from "@hyunsdev/ui/components/switch"
import { cn } from "@hyunsdev/ui/lib/utils"

type ColorSpaceSolidCubeSwitchProps = {
  readonly checked: boolean
  readonly className?: string
  readonly disabled?: boolean
  readonly onCheckedChange: (checked: boolean) => void
}

export function ColorSpaceSolidCubeSwitch({
  checked,
  className,
  disabled = false,
  onCheckedChange,
}: ColorSpaceSolidCubeSwitchProps) {
  return (
    <label
      className={cn(
        "grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-2",
        disabled && "opacity-60",
        className
      )}
    >
      <span className="font-medium text-text-muted">Cube로 표시</span>
      <Switch
        size="sm"
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label="Toggle cube coordinate model"
        className="justify-self-end"
      />
    </label>
  )
}
