import {
  PresentationSlideShell,
  SlideKeyword,
  SlideKeywords,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import { PresentationSolidModelVisual } from "@/presentation/PresentationSolidModelVisual"
import {
  GradientInterpolationComparison,
  HslOklchPaletteComparison,
  OklchBrandPaletteGenerator,
  OklchLightnessRamp,
  OklchUseCaseChips,
} from "@/presentation/PresentationOklchPaletteVisuals"
import {
  ColorModelDecisionTable,
  StateColorRelationDemo,
  ThemeTokenLightnessMap,
} from "@/presentation/PresentationOklchSystemVisuals"

export function Part2IntroSlide() {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label="2부: 당신이 OKLCH를 사용해야 하는 이유"
    >
      <PresentationSolidModelVisual />
      <div className="absolute inset-x-[8%] top-[72%] grid justify-items-center gap-[2cqh] text-center">
        <p className="font-mono text-[clamp(0.72rem,1.25cqw,1.05rem)] leading-none font-bold tracking-normal text-text-muted">
          2부
        </p>
        <h1 className="max-w-[34ch] text-[clamp(1.65rem,4.8cqw,3.25rem)] leading-[1.18] font-bold tracking-normal text-balance">
          <span className="block">OKLCH</span>
          <span className="block">색을 시스템으로 설계하기</span>
        </h1>
      </div>
    </section>
  )
}

export function WhyOklchSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="HSL으로는 부족한 이유"
      title="HSL은 직관적이지만, 팔레트에는 불안정하다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>색을 고르기는 쉽다</SlideKeyword>
          <SlideKeyword>단계를 설계하기는 어렵다</SlideKeyword>
          <SlideKeyword>관계를 설계해야 한다</SlideKeyword>
          <OklchUseCaseChips />
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <HslOklchPaletteComparison />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function OklchLightnessSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="OKLCH 명도 설계"
      title="UI에서 중요한 것은 사람이 느끼는 밝기다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>L = perceived lightness</SlideKeyword>
          <SlideKeyword>50 -&gt; 100 -&gt; ... -&gt; 900</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <OklchLightnessRamp />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function OklchBrandPaletteSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="OKLCH 브랜드 팔레트"
      title="팔레트를 감이 아닌 규칙으로 만든다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>base hue</SlideKeyword>
          <SlideKeyword>fixed chroma</SlideKeyword>
          <SlideKeyword>lightness scale</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <OklchBrandPaletteGenerator />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function OklchStateColorsSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="OKLCH 상태 색상"
      title="hover와 active를 감으로 찍지 않는다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>base</SlideKeyword>
          <SlideKeyword>hover</SlideKeyword>
          <SlideKeyword>active</SlideKeyword>
          <SlideKeyword>disabled</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <StateColorRelationDemo />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function OklchGradientSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="OKLCH 그라데이션"
      title="중간색은 어디에서 섞느냐에 따라 달라진다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>RGB</SlideKeyword>
          <SlideKeyword>HSL</SlideKeyword>
          <SlideKeyword>OKLCH</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <GradientInterpolationComparison />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function OklchDarkModeSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="OKLCH 다크모드 설계"
      title="다크모드는 명도 관계를 다시 설계한다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>background</SlideKeyword>
          <SlideKeyword>surface</SlideKeyword>
          <SlideKeyword>border</SlideKeyword>
          <SlideKeyword>text</SlideKeyword>
          <SlideKeyword>accent</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <ThemeTokenLightnessMap />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function ChooseTheToolSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="상황에 따라 도구를 고르기"
      title="상황에 따라 도구를 골라야 한다"
    >
      <SlideVisualStage className="grid content-center">
        <ColorModelDecisionTable />
      </SlideVisualStage>
    </PresentationSlideShell>
  )
}
