import {
  PresentationSlideShell,
  SlideKeyword,
  SlideKeywords,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import { ColorCoordinateControlDemo } from "@/presentation/PresentationHslHsvControls"
import {
  ColorModelPurposeMap,
  GamutCautionDiagram,
  LabAxisDiagram,
  LabToOklabComparison,
  LchPolarDiagram,
  PerceptualNeedDiagram,
} from "@/presentation/PresentationPerceptualVisuals"

export function PerceptualModelsSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="지각 기반 색 모델의 대두"
      title="지각 기반 색 모델"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>같은 숫자 차이</SlideKeyword>
          <SlideKeyword>같은 시각 차이?</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <PerceptualNeedDiagram />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function LabModelSlide() {
  return (
    <PresentationSlideShell ariaLabel="Lab" title="Lab">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>L: Lightness</SlideKeyword>
          <SlideKeyword>a: Green &lt;-&gt; Red</SlideKeyword>
          <SlideKeyword>b: Blue &lt;-&gt; Yellow</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage>
          <LabAxisDiagram />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function LchModelSlide() {
  return (
    <PresentationSlideShell ariaLabel="LCH" title="LCH">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>L: Lightness</SlideKeyword>
          <SlideKeyword>C: Chroma</SlideKeyword>
          <SlideKeyword>H: Hue</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage>
          <LchPolarDiagram />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function OutOfGamutSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="out of gamut"
      title="문법적으로 가능해도 화면 밖일 수 있다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>valid coordinate</SlideKeyword>
          <SlideKeyword>display gamut</SlideKeyword>
          <SlideKeyword>out of gamut</SlideKeyword>
          <SlideKeyword>clipped or mapped</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <GamutCautionDiagram />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function LabToOklabSlide() {
  return (
    <PresentationSlideShell ariaLabel="Lab에서 Oklab으로" title="Lab에서 Oklab으로">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>Lab: perceptual, but not perfect</SlideKeyword>
          <SlideKeyword>Blue hue shift</SlideKeyword>
          <SlideKeyword>Oklab: better hue / lightness / gradients</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="grid content-center">
          <LabToOklabComparison />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function OklchModelSlide() {
  return (
    <PresentationSlideShell ariaLabel="OKLCH" title="OKLCH">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>L: perceived lightness</SlideKeyword>
          <SlideKeyword>C: chroma</SlideKeyword>
          <SlideKeyword>H: hue</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage>
          <ColorCoordinateControlDemo modelId="oklch" planeAxisIds={{ x: "c", y: "l" }} />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function Part1SummarySlide() {
  return (
    <PresentationSlideShell ariaLabel="1부 정리" title="색 모델의 지도">
      <SlideVisualStage className="grid content-center">
        <ColorModelPurposeMap />
      </SlideVisualStage>
    </PresentationSlideShell>
  )
}
