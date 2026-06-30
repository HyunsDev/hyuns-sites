import { useMemo, useState } from "react"

import { cn } from "@hyunsdev/ui/lib/utils"

import {
  detectColorGamutCapabilities,
  resolveColorGamutRendering,
} from "@/color-models/color-gamut"
import type { ColorGamutCapabilities } from "@/color-models/color-gamut"
import {
  COLOR_SPACE_MODEL_BY_ID,
  type ColorSpaceModelId,
} from "@/color-models/color-space-models"
import { buildSolidColorSpaceMesh } from "@/color-models/color-space-solid-mesh"
import { SolidColorSpaceModelCanvas } from "@/color-models/SolidColorSpaceModelCanvas"
import {
  PresentationSlideShell,
  SlideKeyword,
  SlideKeywords,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import { PresentationSolidModelVisual } from "@/presentation/PresentationSolidModelVisual"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hyunsdev/ui/components/select"

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

const COLOR_MODEL_OVERVIEW_OPTIONS = [
  {
    id: "rgb",
    role: "display",
    summary: "화면이 출력하기 쉬운 세 채널 좌표",
  },
  {
    id: "hsl",
    role: "selection",
    summary: "Hue, saturation, lightness로 색을 고르기 쉬운 좌표",
  },
  {
    id: "hsv",
    role: "picker",
    summary: "컬러 피커의 saturation/value 평면과 잘 맞는 좌표",
  },
  {
    id: "lab",
    role: "perception",
    summary: "사람이 느끼는 색 차이에 가까워지려는 좌표",
  },
  {
    id: "lch",
    role: "polar",
    summary: "Lab을 lightness, chroma, hue로 다시 읽는 좌표",
  },
  {
    id: "oklch",
    role: "design",
    summary: "현대 UI 팔레트와 상태 색 설계에 다루기 좋은 좌표",
  },
] as const satisfies readonly {
  readonly id: ColorModelOverviewId
  readonly role: string
  readonly summary: string
}[]

type ColorModelOverviewId = Extract<
  ColorSpaceModelId,
  "hsl" | "hsv" | "lab" | "lch" | "oklch" | "rgb"
>

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

export function ColorModelIntroPresentationSlide() {
  return (
    <PresentationSlideShell ariaLabel="색 모델" title="색 모델">
      <SlideTwoColumn variant="visualWide">
        <ColorModelIntroCopy />
        <SlideVisualStage className="min-h-0">
          <ColorModelOverviewSelector />
        </SlideVisualStage>
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

function ColorModelIntroCopy() {
  return (
    <div className="grid content-center gap-[3.4cqh]">
      <p className="max-w-[20ch] text-[clamp(1.12rem,2.45cqw,2.08rem)] leading-[1.12] font-bold tracking-normal text-balance">
        색 모델은 색을 좌표로 읽는 방법이다.
      </p>
      <SlideKeywords className="gap-[1.7cqh]">
        <SlideKeyword>어떤 축으로 나눌까</SlideKeyword>
        <SlideKeyword>어떤 조작이 쉬울까</SlideKeyword>
        <SlideKeyword>어떤 문제를 해결할까</SlideKeyword>
      </SlideKeywords>
    </div>
  )
}

function ColorModelOverviewSelector() {
  const [selectedModelId, setSelectedModelId] =
    useState<ColorModelOverviewId>("rgb")
  const [gamutCapabilities] = useState<ColorGamutCapabilities>(() =>
    detectColorGamutCapabilities()
  )
  const model = COLOR_SPACE_MODEL_BY_ID[selectedModelId]
  const selectedOption = getColorModelOverviewOption(selectedModelId)
  const gamutRendering = useMemo(
    () => resolveColorGamutRendering("srgb", gamutCapabilities),
    [gamutCapabilities]
  )
  const mesh = useMemo(
    () =>
      buildSolidColorSpaceMesh(
        model.id,
        gamutRendering.mode.id,
        gamutRendering.actualOutput.id
      ),
    [gamutRendering.actualOutput.id, gamutRendering.mode.id, model.id]
  )

  return (
    <div className="relative h-full min-h-[36cqh]">
      <SolidColorSpaceModelCanvas
        autoRotate
        gamutRendering={gamutRendering}
        mesh={mesh}
        model={model}
        showGuides
        showStats={false}
        showWireframe
        surface="transparent"
        className="size-full min-h-0 scale-[1.08] md:min-h-0"
      />
      <div className="absolute right-0 bottom-0 z-10 grid w-[min(18rem,42cqw)] gap-2 rounded-md border border-border bg-background-primary/90 p-3 text-xs shadow-sm backdrop-blur">
        <label className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-medium text-text-muted">Model</span>
          <Select
            value={selectedModelId}
            onValueChange={(value) => {
              if (isColorModelOverviewId(value)) {
                setSelectedModelId(value)
              }
            }}
          >
            <SelectTrigger
              size="sm"
              className="w-full justify-between bg-background-primary/75"
              aria-label="Select color model"
            >
              <SelectValue aria-label={model.name}>{model.name}</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              {COLOR_MODEL_OVERVIEW_OPTIONS.map((option) => {
                const optionModel = COLOR_SPACE_MODEL_BY_ID[option.id]

                return (
                  <SelectItem key={option.id} value={option.id}>
                    {optionModel.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </label>
        <div className="grid gap-1 border-t border-border pt-2">
          <span className="font-mono text-[clamp(0.56rem,0.92cqw,0.74rem)] leading-none font-bold text-text-muted">
            {selectedOption.role}
          </span>
          <span className="text-[clamp(0.72rem,1.08cqw,0.9rem)] leading-snug font-semibold text-balance">
            {selectedOption.summary}
          </span>
          <code className="mt-1 text-[clamp(0.58rem,0.9cqw,0.74rem)] leading-none text-text-muted">
            {model.coordinate}
          </code>
        </div>
      </div>
    </div>
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

function getColorModelOverviewOption(modelId: ColorModelOverviewId) {
  const option = COLOR_MODEL_OVERVIEW_OPTIONS.find((item) => item.id === modelId)

  if (!option) {
    throw new RangeError(`Missing color model overview option for ${modelId}`)
  }

  return option
}

function isColorModelOverviewId(value: string): value is ColorModelOverviewId {
  return COLOR_MODEL_OVERVIEW_OPTIONS.some((option) => option.id === value)
}
