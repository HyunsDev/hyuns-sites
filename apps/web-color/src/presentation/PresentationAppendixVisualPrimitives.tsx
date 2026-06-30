export function ScopeLane({
  items,
  muted = false,
  title,
}: {
  readonly items: readonly string[]
  readonly muted?: boolean
  readonly title: string
}) {
  return (
    <div className="grid gap-[0.65cqw] rounded-md border border-border bg-background-primary/84 p-[1cqw]">
      <code className="font-mono text-[clamp(0.58rem,0.88cqw,0.74rem)] font-bold text-text-muted">
        {title}
      </code>
      <div className="grid grid-cols-3 gap-[0.55cqw]">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-sm border border-border px-[0.55cqw] py-[0.8cqh] text-center text-[clamp(0.52rem,0.82cqw,0.7rem)] font-bold ${
              muted ? "text-text-muted" : ""
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function MetricChip({
  label,
  value,
}: {
  readonly label: string
  readonly value: string
}) {
  return (
    <div className="grid gap-[0.25cqw] rounded-md border border-border bg-background-primary/84 p-[0.75cqw] text-center">
      <span className="font-mono text-[clamp(0.54rem,0.82cqw,0.7rem)] font-bold text-text-muted">
        {label}
      </span>
      <span className="text-[clamp(0.66rem,1cqw,0.86rem)] font-bold">
        {value}
      </span>
    </div>
  )
}

export function FormulaCard({
  expression,
  label,
}: {
  readonly expression: string
  readonly label: string
}) {
  return (
    <div className="grid gap-[0.35cqw] rounded-md border border-border bg-background-primary/90 p-[0.9cqw]">
      <span className="text-[clamp(0.54rem,0.82cqw,0.7rem)] font-bold text-text-muted">
        {label}
      </span>
      <code className="text-[clamp(0.58rem,0.92cqw,0.78rem)] font-bold">
        {expression}
      </code>
    </div>
  )
}

export function EllipseMarker({ className }: { readonly className: string }) {
  return (
    <span
      className={`absolute rounded-[50%] border-2 border-text-normal/80 ${className}`}
    />
  )
}

export function AxisLabel({
  className,
  label,
}: {
  readonly className: string
  readonly label: string
}) {
  return (
    <span
      className={`absolute font-mono text-[clamp(0.52rem,0.82cqw,0.72rem)] text-text-muted ${className}`}
    >
      {label}
    </span>
  )
}

export function SwatchRows({
  rows,
}: {
  readonly rows: readonly {
    readonly label: string
    readonly swatches: readonly string[]
  }[]
}) {
  return (
    <div className="grid gap-[1cqw]">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-[0.8cqw]"
        >
          <code className="font-mono text-[clamp(0.56rem,0.86cqw,0.74rem)] font-bold text-text-muted">
            {row.label}
          </code>
          <div className="grid grid-cols-3 overflow-hidden rounded-md border border-border">
            {row.swatches.map((color) => (
              <span
                key={color}
                className="h-[9cqw] min-h-12"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ContrastCard({
  background,
  foreground,
  ratio,
  weak = false,
}: {
  readonly background: string
  readonly foreground: string
  readonly ratio: string
  readonly weak?: boolean
}) {
  return (
    <div
      className="grid min-h-[13cqh] content-center gap-[0.5cqw] rounded-md border border-border p-[1cqw]"
      style={{ backgroundColor: background, color: foreground }}
    >
      <span className="text-[clamp(0.76rem,1.2cqw,1rem)] font-bold">
        Text
      </span>
      <code className="text-[clamp(0.52rem,0.78cqw,0.66rem)]">{ratio}</code>
      <span className="text-[clamp(0.48rem,0.72cqw,0.6rem)] font-bold">
        {weak ? "check fails" : "check passes"}
      </span>
    </div>
  )
}
