import {
  PresentationSlideShell,
  SlideKeyword,
  SlideKeywords,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import {
  HsvColorPickerDemo,
} from "@/presentation/PresentationHslHsvControls"
import {
  HslHsvComparisonRows,
  HslHsvIntroModels,
  HsvAxisPaletteRows,
  LightnessComparisonGrid,
  ModelFamilyBridge,
} from "@/presentation/PresentationHslHsvVisuals"
import { PresentationSolidModelSlide } from "@/presentation/PresentationSolidModelViewer"

export function HslHsvIntroPresentationSlide() {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label="HSL과 HSV: 사람이 고르기 쉬운 색 모델"
    >
      <HslHsvIntroModels />
      <div className="absolute inset-x-[8%] top-[72%] grid justify-items-center gap-[2cqh] text-center">
        <h1 className="max-w-[34ch] text-[clamp(1.65rem,4.8cqw,3.25rem)] leading-[1.18] font-bold tracking-normal text-balance">
          <span className="block">HSL / HSV</span>
          <span className="block">사람이 고르기 쉬운 색 모델</span>
        </h1>
      </div>
    </section>
  )
}

export function HslModelSlide() {
  return (
    <PresentationSolidModelSlide ariaLabel="HSL" baseModelId="hsl" title="HSL" />
  )
}

export function HsvModelSlide() {
  return (
    <PresentationSolidModelSlide ariaLabel="HSV" baseModelId="hsv" title="HSV" />
  )
}

export function HsvPickerSlide() {
  return (
    <PresentationSlideShell ariaLabel="HSL / HSV Color Picker" title="Color Picker는 왜 이렇게 생겼을까?">
      <SlideTwoColumn
        variant="visualWide"
        className="max-md:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)] max-md:gap-[1cqw]"
      >
        <SlideKeywords className="max-md:gap-[0.8cqh] max-md:[&_p]:grid-cols-[0.18rem_minmax(0,1fr)] max-md:[&_p]:gap-[0.5cqw] max-md:[&_p]:text-[0.52rem] max-md:[&_p]:leading-[1.05]">
          <SlideKeyword>Hue</SlideKeyword>
          <SlideKeyword>HSV: Saturation x Value</SlideKeyword>
          <SlideKeyword>HSL: Saturation x Lightness</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="max-md:origin-center max-md:scale-[0.62]">
          <HsvColorPickerDemo />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function HslVsHsvSlide() {
  return (
    <PresentationSlideShell ariaLabel="HSL vs HSV" title="HSL vs HSV">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>HSL: 색상 변형을 설명하기 쉽다</SlideKeyword>
          <SlideKeyword>HSV: 색상 선택기에 적합하다</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage>
          <HslHsvComparisonRows />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function AxisPalettesSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="특정 값만 바꿔서 컬러셋을 만들 수 있다"
      title="특정 값만 바꿔서 컬러셋을 만들 수 있다"
    >
      <SlideVisualStage className="grid">
        <HsvAxisPaletteRows />
      </SlideVisualStage>
    </PresentationSlideShell>
  )
}

export function HslLightnessTrapSlide() {
  return (
    <PresentationSlideShell ariaLabel="HSL의 함정" title="Lightness는 진짜 밝기가 아니다">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>HSL L = 50%</SlideKeyword>
          <SlideKeyword>같은 숫자, 다른 밝기</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <LightnessComparisonGrid />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function RgbDerivedLimitsSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="RGB 기반 색 모델의 한계"
      title="HSL과 HSV는 RGB를 다시 읽은 것이다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>RGB의 기하학적 변환</SlideKeyword>
          <SlideKeyword>디스플레이 표현에 가깝다</SlideKeyword>
          <SlideKeyword>지각 차이를 직접 다루지는 않는다</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <ModelFamilyBridge />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}
