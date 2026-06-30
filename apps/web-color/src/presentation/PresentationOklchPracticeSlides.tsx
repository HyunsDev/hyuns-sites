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
  HyunsUiAccentFamilyDemo,
  HyunsUiLightnessRoleDemo,
  HyunsUiStateSpecimen,
  HyunsUiThemeTokenMap,
} from "@/presentation/PresentationHyunsUiOklchVisuals"
import {
  GradientInterpolationComparison,
  HslOklchPaletteComparison,
} from "@/presentation/PresentationOklchPaletteVisuals"
import {
  ColorModelDecisionTable,
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
          claim="Hyuns UI의 surface 계층도 결국 lightness 차이로 읽힌다"
          rules={[
            "background, surface, border, text가 모두 역할별 L 값을 가진다",
            "컴포넌트는 raw color가 아니라 semantic token을 사용한다",
            "대비 조정은 hue 변경보다 역할별 L 재배치에서 시작한다",
          ]}
          formulas={[
            {
              expression: "--background-* / --text-* / --border",
              label: "tokens",
              note: "Hyuns UI globals.css",
            },
          ]}
          badges={["lightness", "surface", "component"]}
        />
        <SlideVisualStage className="grid content-center">
          <HyunsUiLightnessRoleDemo />
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
          claim="Hyuns UI의 accent는 L, C, H 세 값으로 교체 가능한 브랜드 축이다"
          rules={[
            "blue, green, yellow 같은 accent가 모두 L/C/H 변수로 선언된다",
            "data-accent는 컴포넌트를 바꾸지 않고 accent 축만 바꾼다",
            "같은 Button이 accent token만 바꿔 다른 브랜드 색을 얻는다",
          ]}
          formulas={[
            { expression: "--accent-l", label: "L" },
            { expression: "--accent-c", label: "C" },
            { expression: "--accent-h", label: "H" },
          ]}
          badges={["data-accent", "Button", "token"]}
          caption="예시는 hyuns-ui/packages/ui/src/styles/globals.css의 실제 accent 값이다."
        />
        <SlideVisualStage className="grid content-center">
          <HyunsUiAccentFamilyDemo />
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
          claim="Hyuns UI의 상태 색상은 component마다 새로 찍지 않고 accent에서 파생된다"
          rules={[
            "Button, Switch, Slider가 interactive-accent 계열을 공유한다",
            "hover와 active는 --accent-1, --accent-3으로 연결된다",
            "light와 dark에서는 같은 관계를 유지하되 L delta 방향이 바뀐다",
          ]}
          formulas={[
            { expression: "L + .03, C + .005", label: "hover" },
            { expression: "L + .09, C + .005", label: "active" },
            { expression: "L - .03 / -.09", label: "dark" },
          ]}
          badges={["Button", "Switch", "Slider", "state"]}
        />
        <SlideVisualStage className="grid content-center">
          <HyunsUiStateSpecimen />
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
          claim="Hyuns UI의 다크모드는 역할별 OKLCH lightness map을 다시 배치한다"
          rules={[
            "background와 surface는 낮은 L 영역으로 이동한다",
            "text는 높은 L로 올라가고 border는 중간 완충 역할을 한다",
            "선택한 accent는 theme별 L/C/H 프리셋으로 대비를 맞춘다",
          ]}
          formulas={[
            { expression: "1.00 -> .24", label: "background" },
            { expression: ".145 -> .95", label: "text" },
            { expression: "light -> dark", label: "accent" },
          ]}
          badges={["background", "surface", "text", "accent"]}
        />
        <SlideVisualStage className="grid content-center">
          <HyunsUiThemeTokenMap />
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
