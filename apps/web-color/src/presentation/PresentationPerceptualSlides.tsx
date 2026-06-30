import {
  PresentationSlideShell,
  SlideKeyword,
  SlideKeywords,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import { CieRgbGamutCanvas } from "@/color-models/CieRgbGamutCanvas"
import type { CieXyzGamutId } from "@/color-models/cie-xyz-gamut-data"
import { LabToOklabComparison } from "@/presentation/PresentationLabToOklabComparison"
import { LabGamutPlaneCanvas } from "@/presentation/PresentationLabGamutPlaneCanvas"
import {
  ColorModelPurposeMap,
  GamutCautionDiagram,
} from "@/presentation/PresentationPerceptualVisuals"
import { PresentationSolidModelSlide } from "@/presentation/PresentationSolidModelSlide"

const MACADAM_ELLIPSE_SOURCE_URL =
  "https://fujiwaratko.sakura.ne.jp/infosci/lab_e.html"
const MACADAM_XY_IMAGE_URL = new URL(
  "./assets/macadam-ellipses-xy.png",
  import.meta.url
).href
const MACADAM_LAB_IMAGE_URL = new URL(
  "./assets/macadam-ellipses-lab.png",
  import.meta.url
).href
const PRESENTATION_CIE_GAMUT_IDS = [
  "srgb",
  "display-p3",
] as const satisfies readonly CieXyzGamutId[]
const PRESENTATION_SRGB_GAMUT_IDS = [
  "srgb",
] as const satisfies readonly CieXyzGamutId[]

export function PerceptualModelsSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="지각 기반 색 모델의 대두"
      title="지각 기반 색 모델"
    >
      <SlideVisualStage className="grid min-h-0 content-center">
        <MacAdamEllipseComparison />
      </SlideVisualStage>
    </PresentationSlideShell>
  )
}

function MacAdamEllipseComparison() {
  return (
    <div className="relative grid w-full min-h-0 justify-items-center gap-[1.6cqh] pb-[3cqh]">
      <div className="grid w-full max-w-[86cqw] grid-cols-2 place-items-center gap-[2.8cqw]">
        <MacAdamFigure
          alt="MacAdam ellipses on the xy chromaticity diagram"
          caption="xy chromaticity"
          src={MACADAM_XY_IMAGE_URL}
        />
        <MacAdamFigure
          alt="MacAdam ellipses mapped onto Lab space"
          caption="Lab space"
          src={MACADAM_LAB_IMAGE_URL}
        />
      </div>
      <p className="max-w-[56cqw] text-center text-[clamp(0.76rem,1.12cqw,0.98rem)] leading-snug font-medium text-text-muted text-balance">
        MacAdam ellipse는 사람이 거의 같은 색으로 느끼는 범위다. 타원 크기와 방향의 차이가
        줄어든다는 것은 좌표상의 거리와 사람이 느끼는 색 차이가 더 비슷해진다는 뜻이다.
      </p>
      <a
        className="absolute right-0 bottom-0 max-w-[32ch] truncate text-right font-mono text-[clamp(0.48rem,0.72cqw,0.62rem)] leading-none text-text-muted underline-offset-2 hover:underline"
        href={MACADAM_ELLIPSE_SOURCE_URL}
        rel="noreferrer"
        target="_blank"
      >
        Source: fujiwaratko.sakura.ne.jp/infosci/lab_e.html
      </a>
    </div>
  )
}

function MacAdamFigure({
  alt,
  caption,
  src,
}: {
  readonly alt: string
  readonly caption: string
  readonly src: string
}) {
  return (
    <figure className="grid w-full min-w-0 justify-items-center gap-[0.75cqh]">
      <div className="grid aspect-square w-full max-w-[min(25rem,40cqw)] place-items-center overflow-hidden rounded-md border border-border bg-background-primary/84 p-[0.65cqw]">
        <img
          alt={alt}
          className="block aspect-square h-full w-full object-contain"
          draggable={false}
          src={src}
          style={{
            aspectRatio: "1 / 1",
            height: "100%",
            objectFit: "contain",
            width: "100%",
          }}
        />
      </div>
      <figcaption className="font-mono text-[clamp(0.56rem,0.86cqw,0.72rem)] leading-none font-bold text-text-muted">
        {caption}
      </figcaption>
    </figure>
  )
}

export function LabModelSlide() {
  return (
    <PresentationSolidModelSlide
      ariaLabel="Lab"
      baseModelId="lab"
      showCubeSwitch={false}
      showGamutSelect
      targetCssColor="lab(64 55 42)"
      title="Lab"
    />
  )
}

export function LchModelSlide() {
  return (
    <PresentationSolidModelSlide
      ariaLabel="LCH"
      baseModelId="lch"
      showGamutSelect
      targetCssColor="lch(64% none 38)"
      title="LCH"
    />
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

export function GamutConceptSlide() {
  return (
    <PresentationSlideShell ariaLabel="색역" title="색역">
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>표시할 수 있는 색의 범위</SlideKeyword>
          <SlideKeyword>RGB primary가 삼각형을 만든다</SlideKeyword>
          <SlideKeyword>sRGB보다 Display P3가 더 넓다</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="min-h-0">
          <CieRgbGamutCanvas
            className="h-[52cqh] min-h-0 rounded-none border-0 bg-transparent md:min-h-0"
            gamutIds={PRESENTATION_CIE_GAMUT_IDS}
            points={[]}
          />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function RgbGamutCubeSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="CIE 1931 xy에서 본 sRGB 색역"
      title="sRGB는 xy에서 삼각형이다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>R, G, B primary가 꼭짓점이 된다</SlideKeyword>
          <SlideKeyword>세 점이 만들 수 있는 영역이 sRGB 색역이다</SlideKeyword>
          <SlideKeyword>xy는 밝기를 떼어낸 색도의 지도다</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="min-h-0">
          <CieRgbGamutCanvas
            className="h-[52cqh] min-h-0 rounded-none border-0 bg-transparent md:min-h-0"
            gamutIds={PRESENTATION_SRGB_GAMUT_IDS}
            points={[]}
          />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function PerceptualGamutShapeSlide() {
  return (
    <PresentationSlideShell
      ariaLabel="CIE Lab L*=50 단면에서 본 sRGB 색역"
      title="Lab 단면에서는 경계가 휘어진다"
    >
      <SlideTwoColumn variant="visualWide">
        <SlideKeywords>
          <SlideKeyword>L*=50으로 밝기를 고정한다</SlideKeyword>
          <SlideKeyword>a*, b* 평면 위에 sRGB 가능 영역을 표시한다</SlideKeyword>
          <SlideKeyword>지각 좌표계에서는 RGB 큐브가 비정형 경계가 된다</SlideKeyword>
        </SlideKeywords>
        <SlideVisualStage className="h-[54cqh] min-h-0">
          <LabGamutPlaneCanvas className="size-full min-h-0" />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function LabToOklabSlide() {
  return (
    <PresentationSlideShell ariaLabel="Lab에서 Oklab으로" title="Lab에서 Oklab으로">
      <SlideVisualStage className="grid min-h-0 content-center">
        <div className="grid min-h-0 content-center">
          <LabToOklabComparison />
        </div>
      </SlideVisualStage>
    </PresentationSlideShell>
  )
}

export function OklchModelSlide() {
  return (
    <PresentationSolidModelSlide
      ariaLabel="OKLCH"
      baseModelId="oklch"
      showGamutSelect
      targetCssColor="oklch(70% 0.18 32)"
      title="OKLCH"
    />
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
