import { cn } from "@hyunsdev/ui/lib/utils"

import {
  createLabToOklabComparisonPalettes,
  type ComparisonSwatch,
} from "@/presentation/presentation-perceptual-models"

export function LabToOklabComparison() {
  return (
    <div className="grid gap-[1cqw]">
      {createLabToOklabComparisonPalettes().map((palette, index) => (
        <section
          key={palette.id}
          className={cn(
            "grid gap-[0.72cqw] rounded-md border border-border bg-background-primary/84 p-[0.74cqw] max-sm:gap-[0.32cqw] max-sm:p-[0.42cqw]",
            index > 0 && "max-sm:hidden"
          )}
        >
          <div className="flex items-center justify-between gap-[1cqw] max-sm:hidden">
            <span className="font-mono text-[clamp(0.6rem,0.9cqw,0.78rem)] leading-none font-bold text-text-muted">
              {palette.label}
            </span>
          </div>
          <div className="grid gap-[0.72cqw]">
            {palette.rows.map((row) => (
              <ComparisonRow
                key={`${palette.id}-${row.label}`}
                label={row.label}
                note={row.note}
                swatches={row.swatches}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

type ComparisonRowProps = {
  readonly label: string
  readonly note: string
  readonly swatches: readonly ComparisonSwatch[]
}

function ComparisonRow({
  label,
  note,
  swatches,
}: ComparisonRowProps) {
  return (
    <div className="grid gap-[0.36cqw] max-sm:gap-[0.18cqw]">
      <div className="flex items-center justify-between gap-[1cqw]">
        <span className="font-mono text-[clamp(0.56rem,0.82cqw,0.7rem)] leading-none font-bold">
          {label}
        </span>
        <span className="font-mono text-[clamp(0.44rem,0.64cqw,0.56rem)] leading-none font-bold text-text-muted max-sm:hidden">
          {note}
        </span>
      </div>
      <div className="grid grid-cols-11 gap-[0.12cqw] max-sm:gap-[0.06cqw]">
        {swatches.map((swatch, index) => (
          <ComparisonSwatchChip
            isFirst={index === 0}
            isLast={index === swatches.length - 1}
            key={`${label}-${swatch.label}`}
            swatch={swatch}
          />
        ))}
      </div>
    </div>
  )
}

type ComparisonSwatchChipProps = {
  readonly isFirst: boolean
  readonly isLast: boolean
  readonly swatch: ComparisonSwatch
}

function ComparisonSwatchChip({
  isFirst,
  isLast,
  swatch,
}: ComparisonSwatchChipProps) {
  const label = isFirst || isLast || swatch.emphasisLabel ? swatch.label : null

  return (
    <div className="grid min-w-0 gap-[0.2cqw] max-sm:gap-0">
      <div className="grid min-h-[0.55rem] place-items-center max-sm:hidden">
        {label ? (
          <code
            className={cn(
              "truncate text-center text-[clamp(0.36rem,0.52cqw,0.46rem)] leading-none text-text-muted",
              swatch.emphasisLabel && "font-bold text-text-normal"
            )}
          >
            {label}
          </code>
        ) : null}
      </div>
      <div
        className={cn(
          "h-[2.85cqw] min-h-6 rounded-[0.12rem] border border-border max-sm:h-[2.4cqw] max-sm:min-h-0",
          isFirst && "rounded-l-sm",
          isLast && "rounded-r-sm",
          swatch.emphasisLabel && "border-text-normal ring-2 ring-text-normal/30"
        )}
        style={{ backgroundColor: swatch.color }}
        title={`${swatch.css} ${swatch.emphasisLabel ?? swatch.label}`}
      />
    </div>
  )
}
