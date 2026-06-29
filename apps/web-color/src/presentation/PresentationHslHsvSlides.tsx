import {
  PresentationSlideShell,
  SlideKeyword,
  SlideKeywords,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import {
  ColorCoordinateControlDemo,
  HsvColorPickerDemo,
} from "@/presentation/PresentationHslHsvControls"
import {
  HslHsvComparisonRows,
  HslHsvIntroModels,
  HsvAxisPaletteRows,
  LightnessComparisonGrid,
  ModelFamilyBridge,
} from "@/presentation/PresentationHslHsvVisuals"

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
    <PresentationSlideShell ariaLabel="HSL" title="HSL">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>H: Hue</SlideKeyword>
          <SlideKeyword>S: Saturation</SlideKeyword>
          <SlideKeyword>L: Lightness</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage>
          <ColorCoordinateControlDemo modelId="hsl" planeAxisIds={{ x: "s", y: "l" }} />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function HsvModelSlide() {
  return (
    <PresentationSlideShell ariaLabel="HSV" title="HSV">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>H: Hue</SlideKeyword>
          <SlideKeyword>S: Saturation</SlideKeyword>
          <SlideKeyword>V: Value</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage>
          <ColorCoordinateControlDemo modelId="hsv" planeAxisIds={{ x: "s", y: "v" }} />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function HsvPickerSlide() {
  return (
    <PresentationSlideShell ariaLabel="HSV Color Picker" title="Color Picker는 왜 이렇게 생겼을까?">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>Hue</SlideKeyword>
          <SlideKeyword>Saturation x Value</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage>
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
