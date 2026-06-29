import { cn } from "@hyunsdev/ui/lib/utils"

import { PresentationSolidModelVisual } from "@/presentation/PresentationSolidModelVisual"

const COLOR_MODEL_TIMELINE_STEPS = [
  {
    label: "RGB",
    caption: "표시",
  },
  {
    label: "HSL/HSV",
    caption: "선택",
  },
  {
    label: "Lab/LCH",
    caption: "지각",
  },
  {
    label: "Oklab/OKLCH",
    caption: "설계",
  },
] as const

export function IntroPresentationSlide() {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label="RGB부터 OKLCH까지"
    >
      <PresentationSolidModelVisual />
      <div className="absolute inset-x-[8%] top-[72%] grid justify-items-center gap-[2cqh] text-center">
        <h1 className="max-w-[34ch] text-[clamp(1.65rem,4.8cqw,3.25rem)] leading-[1.18] font-bold tracking-normal text-balance">
          <span className="block">RGB부터 OKLCH까지</span>
          <span className="block">/ 당신이 OKLCH를 사용해야 하는 이유</span>
        </h1>
        <p className="text-[clamp(0.95rem,1.85cqw,2.25rem)] leading-[1.32] font-semibold tracking-normal">
          Yourssu FE | Hyuns
        </p>
      </div>
    </section>
  )
}

export function AgendaPresentationSlide() {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label="오늘의 지도"
    >
      <h1 className="absolute top-[11.8%] left-[6.8%] text-[clamp(1.25rem,2.9cqw,2.5rem)] leading-[1.2] font-bold tracking-normal">
        오늘의 지도
      </h1>
      <div className="absolute top-[27%] left-[7%] grid w-[35%] gap-[3.2cqh]">
        <AgendaPart index="1부" title="RGB부터 OKLCH까지" />
        <AgendaPart index="2부" title="당신이 OKLCH를 사용해야 하는 이유" />
      </div>
      <ColorModelTimeline className="absolute top-[35%] right-[6.8%] w-[50%]" />
      <p className="absolute right-[7.2%] bottom-[12%] text-[clamp(1rem,2.55cqw,2.15rem)] leading-none font-bold tracking-normal">
        표현에서 설계로
      </p>
    </section>
  )
}

type AgendaPartProps = {
  readonly index: string
  readonly title: string
}

function AgendaPart({ index, title }: AgendaPartProps) {
  return (
    <div className="grid gap-[0.8cqh] border-l-[0.42cqw] border-text-normal pl-[1.2cqw]">
      <span className="text-[clamp(0.7rem,1.4cqw,1.1rem)] leading-none font-bold tracking-normal text-text-muted">
        {index}
      </span>
      <span className="text-[clamp(1rem,2.3cqw,2rem)] leading-[1.16] font-bold tracking-normal text-balance">
        {title}
      </span>
    </div>
  )
}

type ColorModelTimelineProps = {
  readonly className?: string
}

function ColorModelTimeline({ className }: ColorModelTimelineProps) {
  return (
    <ol className={cn("grid grid-cols-4 items-center gap-[0.8cqw]", className)}>
      {COLOR_MODEL_TIMELINE_STEPS.map((step, index) => (
        <li key={step.label} className="relative grid gap-[1.25cqh]">
          {index > 0 ? (
            <span className="absolute top-[2.4cqh] right-[calc(100%+0.15cqw)] h-px w-[0.7cqw] bg-border" />
          ) : null}
          <div className="grid h-[18cqh] place-items-center rounded-sm border border-border bg-background-primary/86 p-[1cqw] shadow-sm">
            <span className="text-center text-[clamp(0.82rem,1.85cqw,1.55rem)] leading-[1.1] font-bold tracking-normal text-balance">
              {step.label}
            </span>
          </div>
          <span className="text-center text-[clamp(0.62rem,1.15cqw,0.92rem)] leading-none font-bold tracking-normal text-text-muted">
            {step.caption}
          </span>
        </li>
      ))}
    </ol>
  )
}
