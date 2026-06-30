import {
  PresentationSlideShell,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import {
  PartTwoProblemMap,
  SlideExplanationRail,
} from "@/presentation/PresentationOklchExplanation"
import {
  GradientInterpolationComparison,
  HslOklchPaletteComparison,
  OklchBrandPaletteGenerator,
  OklchLightnessSystemDemo,
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
      <div className="grid size-full content-center justify-items-center gap-[2.4cqh] px-[6.8cqw] text-center">
        <p className="font-mono text-[clamp(0.72rem,1.25cqw,1.05rem)] leading-none font-bold tracking-normal text-text-muted">
          2부
        </p>
        <h1 className="max-w-[36ch] text-[clamp(1.55rem,4.3cqw,3.05rem)] leading-[1.14] font-bold tracking-normal text-balance">
          <span className="block">색을 고르는 문제에서</span>
          <span className="block">관계를 설계하는 문제로</span>
        </h1>
        <p className="max-w-[48ch] text-[clamp(0.82rem,1.42cqw,1.08rem)] leading-snug font-bold text-text-muted text-balance">
          OKLCH는 최신 문법이 아니라 팔레트, 상태, 테마 관계를 조작하는
          좌표다.
        </p>
        <PartTwoProblemMap />
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
        <SlideExplanationRail
          claim="디자인 시스템은 단일 색보다 색 사이의 관계가 더 중요하다"
          rules={[
            "HSL의 L은 지각 밝기와 직접 대응하지 않는다",
            "같은 50-900 숫자가 같은 밝기 단계가 되지 않는다",
            "OKLCH는 L, C, H를 분리해 관계를 설계한다",
          ]}
          formulas={[
            {
              expression: "L / C / H",
              label: "OKLCH",
              note: "명도, 강도, 색상 방향",
            },
          ]}
          badges={["palette", "state", "theme"]}
        />
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
        <SlideExplanationRail
          claim="토큰 스케일의 뼈대는 hue가 아니라 lightness다"
          rules={[
            "background, surface, border, text는 밝기 차이로 읽힌다",
            "hue는 브랜드 방향이고 L은 UI 계층 구조다",
            "대비 조정은 색상 변경보다 L 조정으로 시작한다",
          ]}
          formulas={[
            {
              expression: "50 -> 100 -> ... -> 900",
              label: "scale",
              note: "역할별 밝기 단계",
            },
          ]}
          badges={["lightness", "contrast", "token"]}
        />
        <SlideVisualStage className="grid content-center">
          <OklchLightnessSystemDemo />
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
        <SlideExplanationRail
          claim="브랜드 색 하나를 팔레트 규칙으로 확장한다"
          rules={[
            "H는 브랜드 색상 방향을 고정한다",
            "C는 색의 강도를 일정한 범위로 제한한다",
            "L은 50-900 단계 전체를 만든다",
          ]}
          formulas={[
            { expression: "H = identity", label: "Hue" },
            { expression: "C = intensity", label: "Chroma" },
            { expression: "L = scale", label: "Lightness" },
          ]}
          badges={["brand", "palette", "gamut"]}
          caption="입력 색을 바꾸면 같은 규칙으로 전체 scale이 다시 계산된다."
        />
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
        <SlideExplanationRail
          claim="상태 색상은 새 색이 아니라 base color의 delta다"
          rules={[
            "hover는 더 가볍고 덜 강하게 만든다",
            "active는 더 눌린 밝기 관계를 만든다",
            "disabled는 chroma를 크게 줄여 상태를 분리한다",
          ]}
          formulas={[
            { expression: "L + 5, C - 0.02", label: "hover" },
            { expression: "L - 7, C - 0.03", label: "active" },
            { expression: "C * 0.16", label: "disabled" },
          ]}
          badges={["base", "hover", "active", "disabled"]}
        />
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
        <SlideExplanationRail
          claim="보간도 색상 관계의 한 종류다"
          rules={[
            "RGB는 장치 채널 사이를 직선으로 섞는다",
            "HSL은 hue 경로가 중간색을 크게 바꾼다",
            "OKLCH는 지각 좌표에서 중간 단계를 만든다",
          ]}
          badges={["RGB", "HSL", "OKLCH"]}
          caption="이 장은 보조 데모다. 팔레트, 상태, 테마 논리를 해치지 않을 때만 사용한다."
        />
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
        <SlideExplanationRail
          claim="다크모드는 색을 뒤집는 것이 아니라 역할의 밝기 관계를 다시 짜는 것이다"
          rules={[
            "background와 surface는 낮은 L 영역에서 다시 배치한다",
            "text는 높은 L로 올라가고 border는 중간 완충 역할을 한다",
            "accent는 theme 안에서 인식되는 강조축을 유지한다",
          ]}
          formulas={[
            { expression: "L 98 -> L 14", label: "background" },
            { expression: "L 18 -> L 92", label: "text" },
            { expression: "L 66 -> L 72", label: "accent" },
          ]}
          badges={["background", "surface", "text", "accent"]}
        />
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
      <SlideTwoColumn variant="balanced">
        <SlideExplanationRail
          claim="OKLCH는 모든 곳의 정답이 아니라 설계 좌표다"
          rules={[
            "화면에 저장하고 전달할 값은 RGB가 편하다",
            "picker에서 빠르게 고르는 값은 HSL/HSV가 편하다",
            "팔레트, 상태, 테마 관계를 만들 때 OKLCH가 강하다",
          ]}
          badges={["output", "picker", "design"]}
        />
        <SlideVisualStage className="grid content-center">
          <ColorModelDecisionTable />
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}
