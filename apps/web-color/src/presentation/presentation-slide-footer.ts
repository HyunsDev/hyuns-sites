export type PresentationFooterModel = {
  readonly partLabel: string
  readonly slideNumber: string
}

type PresentationFooterModelInput = {
  readonly currentIndex: number
  readonly isPartTwo: boolean
  readonly isTitleSlide: boolean
}

const PRESENTATION_PART_LABELS = {
  part1: "1부 RGB부터 OKLCH까지",
  part2: "2부 당신이 OKLCH를 써야 하는 이유",
} as const

export function getPresentationFooterModel({
  currentIndex,
  isPartTwo,
  isTitleSlide,
}: PresentationFooterModelInput): PresentationFooterModel | null {
  if (isTitleSlide) {
    return null
  }

  return {
    partLabel: isPartTwo
      ? PRESENTATION_PART_LABELS.part2
      : PRESENTATION_PART_LABELS.part1,
    slideNumber: formatPresentationSlideNumber(currentIndex),
  }
}

function formatPresentationSlideNumber(currentIndex: number) {
  return String(currentIndex + 1).padStart(2, "0")
}
