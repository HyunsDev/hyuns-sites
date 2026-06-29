import { cn } from "@hyunsdev/ui/lib/utils"

import {
  PresentationSlideShell,
  SlideKeyword,
  SlideKeywords,
  SlideTwoColumn,
} from "@/presentation/PresentationSlideLayout"
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
    <PresentationSlideShell ariaLabel="오늘의 지도" title="오늘의 지도">
      <SlideTwoColumn variant="visualWide">
        <div className="grid content-center gap-[5.4cqh]">
          <SlideKeywords>
            <AgendaPart index="1부" title="RGB부터 OKLCH까지" />
            <AgendaPart
              index="2부"
              title="당신이 OKLCH를 사용해야 하는 이유"
            />
          </SlideKeywords>
          <SlideKeyword>표현에서 설계로</SlideKeyword>
        </div>
        <ColorModelTimeline />
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function RgbIntroPresentationSlide() {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label="RGB: 기계가 좋아하는 색 모델"
    >
      <PresentationSolidModelVisual modelId="rgb" variant="section" />
      <div className="absolute inset-x-[8%] top-[72%] grid justify-items-center gap-[2cqh] text-center">
        <h1 className="max-w-[34ch] text-[clamp(1.65rem,4.8cqw,3.25rem)] leading-[1.18] font-bold tracking-normal text-balance">
          <span className="block">RGB</span>
          <span className="block">기계가 좋아하는 색 모델</span>
        </h1>
      </div>
    </section>
  )
}

type AgendaPartProps = {
  readonly index: string
  readonly title: string
}

function AgendaPart({ index, title }: AgendaPartProps) {
  return (
    <div className="grid gap-[0.9cqh]">
      <span className="font-mono text-[clamp(0.64rem,1.1cqw,0.92rem)] leading-none font-bold tracking-normal text-text-muted">
        {index}
      </span>
      <span className="text-[clamp(1.05rem,2.35cqw,2rem)] leading-[1.15] font-bold tracking-normal text-balance">
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
    <ol
      className={cn(
        "relative grid grid-cols-4 items-start gap-[1.1cqw] pt-[5.2cqh]",
        "before:absolute before:top-[6.65cqh] before:right-[10%] before:left-[10%] before:h-px before:bg-border",
        className
      )}
    >
      {COLOR_MODEL_TIMELINE_STEPS.map((step, index) => (
        <li key={step.label} className="relative grid justify-items-center gap-[1.7cqh]">
          <span
            className={cn(
              "relative z-10 grid size-[2.9cqw] min-h-8 min-w-8 place-items-center rounded-full border border-border bg-background-secondary font-mono text-[clamp(0.68rem,1.1cqw,0.92rem)] leading-none font-bold",
              index === 0 && "border-text-normal bg-text-normal text-background-primary"
            )}
          >
            {index + 1}
          </span>
          <div className="grid justify-items-center gap-[0.8cqh] text-center">
            <span className="text-[clamp(0.86rem,1.65cqw,1.38rem)] leading-[1.1] font-bold tracking-normal text-balance">
              {step.label}
            </span>
            <span className="font-mono text-[clamp(0.58rem,0.95cqw,0.8rem)] leading-none font-bold tracking-normal text-text-muted">
            {step.caption}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}
