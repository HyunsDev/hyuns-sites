import { Badge } from "@hyunsdev/ui/components/badge"
import { cn } from "@hyunsdev/ui/lib/utils"

type FormulaItem = {
  readonly expression: string
  readonly label: string
  readonly note?: string
}

type SlideExplanationRailProps = {
  readonly badges?: readonly string[]
  readonly caption?: string
  readonly claim: string
  readonly className?: string
  readonly formulas?: readonly FormulaItem[]
  readonly rules?: readonly string[]
}

const PART_TWO_PROBLEM_CARDS = [
  {
    caption: "50-900 단계가 균일해야 한다",
    label: "palette scale",
  },
  {
    caption: "hover, active는 base와 관계여야 한다",
    label: "state delta",
  },
  {
    caption: "light/dark는 역할별 L 재배치다",
    label: "theme roles",
  },
] as const

export function SlideExplanationRail({
  badges,
  caption,
  claim,
  className,
  formulas,
  rules,
}: SlideExplanationRailProps) {
  return (
    <div className={cn("grid content-center gap-[2.1cqh]", className)}>
      <p className="text-[clamp(1rem,2.08cqw,1.72rem)] leading-[1.15] font-bold tracking-normal text-balance">
        {claim}
      </p>
      {rules && rules.length > 0 && <RuleList rules={rules} />}
      {formulas && formulas.length > 0 && <FormulaList formulas={formulas} />}
      {badges && badges.length > 0 && <BadgeList badges={badges} />}
      {caption && (
        <p className="max-w-[30ch] text-[clamp(0.68rem,1.08cqw,0.9rem)] leading-snug font-medium text-text-muted text-balance">
          {caption}
        </p>
      )}
    </div>
  )
}

export function PartTwoProblemMap() {
  return (
    <div className="grid w-full max-w-[78cqw] min-w-0 grid-cols-1 gap-[0.8cqw] sm:grid-cols-3 sm:gap-[1cqw]">
      {PART_TWO_PROBLEM_CARDS.map((card) => (
        <div
          key={card.label}
          className="grid min-h-[7.2cqh] min-w-0 content-center gap-[0.45cqh] rounded-md border border-border bg-background-primary/78 px-[1.2cqw] py-[0.8cqh] backdrop-blur sm:min-h-[10cqh] sm:gap-[0.6cqh] sm:py-[1.2cqh]"
        >
          <code className="truncate font-mono text-[clamp(0.56rem,0.9cqw,0.78rem)] leading-none font-bold text-text-muted">
            {card.label}
          </code>
          <p className="text-[clamp(0.74rem,1.18cqw,0.98rem)] leading-tight font-bold text-balance">
            {card.caption}
          </p>
        </div>
      ))}
    </div>
  )
}

function RuleList({ rules }: { readonly rules: readonly string[] }) {
  return (
    <ul className="grid gap-[1.15cqh]">
      {rules.map((rule) => (
        <li
          key={rule}
          className="grid grid-cols-[0.34cqw_minmax(0,1fr)] items-start gap-[1.1cqw] text-[clamp(0.78rem,1.42cqw,1.08rem)] leading-[1.2] font-bold text-balance"
        >
          <span className="mt-[0.32em] h-[0.64em] rounded-full bg-text-normal" />
          <span>{rule}</span>
        </li>
      ))}
    </ul>
  )
}

function FormulaList({ formulas }: { readonly formulas: readonly FormulaItem[] }) {
  return (
    <div className="grid gap-[0.8cqh]">
      {formulas.map((formula) => (
        <p
          key={`${formula.label}-${formula.expression}`}
          className="grid grid-cols-[5.6rem_minmax(0,1fr)] gap-x-[1cqw] gap-y-[0.3cqh] rounded-md border border-border bg-background-primary/72 px-[1cqw] py-[0.85cqh] text-[clamp(0.56rem,0.9cqw,0.76rem)] leading-tight"
        >
          <span className="text-text-muted">{formula.label}</span>
          <code>{formula.expression}</code>
          {formula.note && (
            <span className="col-start-2 text-text-muted">{formula.note}</span>
          )}
        </p>
      ))}
    </div>
  )
}

function BadgeList({ badges }: { readonly badges: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-[0.7cqw]">
      {badges.map((badge) => (
        <Badge key={badge} variant="outline" className="font-mono">
          {badge}
        </Badge>
      ))}
    </div>
  )
}
