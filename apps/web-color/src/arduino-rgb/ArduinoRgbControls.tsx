import {
  CableIcon,
  SlidersHorizontalIcon,
} from "lucide-react"

import { Badge } from "@hyunsdev/ui/components/badge"
import { connectionLabel } from "@/arduino-rgb/arduino-serial-labels"
import type { SerialConnectionState } from "@/arduino-rgb/useArduinoSerial"
import { cn } from "@hyunsdev/ui/lib/utils"

export function Readout({
  label,
  tone = "normal",
  value,
}: {
  readonly label: string
  readonly tone?: "error" | "normal"
  readonly value: string
}) {
  return (
    <div className="grid min-w-0 gap-1 rounded-md border border-border bg-background-secondary/70 p-2">
      <span className="text-[0.65rem] font-medium text-text-muted">
        {label}
      </span>
      <code
        className={cn(
          "min-w-0 truncate text-xs text-text-normal",
          tone === "error" && "text-text-error"
        )}
      >
        {value}
      </code>
    </div>
  )
}

export function StatusBadge({ state }: { readonly state: SerialConnectionState }) {
  return (
    <Badge
      variant={state === "unsupported" ? "destructive" : "outline"}
      className="gap-1.5"
    >
      {state === "connected" ? (
        <CableIcon className="size-3" />
      ) : (
        <SlidersHorizontalIcon className="size-3" />
      )}
      {connectionLabel(state)}
    </Badge>
  )
}
