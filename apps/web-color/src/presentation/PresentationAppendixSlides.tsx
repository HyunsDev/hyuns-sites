import type { ReactNode } from "react"

import {
  AppendixHslLightnessVisual,
  AppendixLchPolarVisual,
  AppendixOklchChecklistVisual,
  AppendixOklchChromaLimitVisual,
  AppendixOklchChromaStrategyVisual,
  AppendixOklchContrastVisual,
  AppendixOklchHclRolesVisual,
  AppendixOklchLightnessVisual,
  AppendixPerceptualUniformityVisual,
  AppendixRgbFamilyVisual,
  AppendixScopeVisual,
  AppendixTerminologyVisual,
} from "@/presentation/PresentationAppendixVisuals"
import {
  PresentationSlideShell,
  SlideTwoColumn,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import { SlideExplanationRail } from "@/presentation/PresentationOklchExplanation"

type AppendixTextSlideProps = {
  readonly badges: readonly string[]
  readonly claim: string
  readonly rules: readonly string[]
  readonly title: string
  readonly visual: ReactNode
}

const APPENDIX_TEXT_SLIDES = {
  scope: {
    badges: ["scope", "model", "not spec"],
    claim: "이번 발표는 CSS 색상 사양 전체가 아니라 모델 선택 기준을 다룬다",
    rules: [
      "문법 지원보다 색을 어떤 좌표로 다룰지가 중심이다",
      "CSS Color Level 4/5 기능은 필요한 순간에만 예시로 연결한다",
      "목표는 최신 문법 암기가 아니라 상황별 도구 선택이다",
    ],
    title: "이번 발표가 CSS Color 전체를 다루지 않는 이유",
    visual: <AppendixScopeVisual />,
  },
  terminology: {
    badges: ["notation", "model", "gamut"],
    claim: "표기법, 모델, 공간, 색역은 서로 다른 층위다",
    rules: [
      "표기법은 CSS에 값을 쓰는 문법이다",
      "모델은 색을 어떤 축으로 읽을지 정한다",
      "색역은 실제 장치가 표시할 수 있는 범위다",
    ],
    title: "네 단어 구분: 표기법, 모델, 공간, 색역",
    visual: <AppendixTerminologyVisual />,
  },
  rgbFamily: {
    badges: ["sRGB", "P3", "Rec.2020"],
    claim: "sRGB, Display P3, Rec.2020은 모두 RGB 계열이지만 범위가 다르다",
    rules: [
      "각 색 공간은 서로 다른 primary와 white point를 가진다",
      "같은 RGB 숫자가 항상 같은 실제 색을 뜻하지는 않는다",
      "넓은 색역은 더 많은 색을 담지만 모든 OKLCH 좌표를 담지는 못한다",
    ],
    title: "sRGB, Display P3, Rec.2020은 무엇이 다른가",
    visual: <AppendixRgbFamilyVisual />,
  },
  hslLightness: {
    badges: ["HSL", "L", "luminance"],
    claim: "HSL Lightness는 RGB 최대값과 최소값으로 계산한 기하학적 값이다",
    rules: [
      "HSL L은 사람이 느끼는 밝기를 직접 모델링하지 않는다",
      "같은 L=50%라도 hue에 따라 화면 밝기가 크게 달라진다",
      "균일한 UI 단계에는 relative luminance나 OKLCH L 검증이 필요하다",
    ],
    title: "HSL Lightness는 어떻게 계산되는가",
    visual: <AppendixHslLightnessVisual />,
  },
  perceptualUniformity: {
    badges: ["MacAdam", "Delta E", "approximation"],
    claim: "지각 균일성은 사람 눈을 완벽히 복제한다는 뜻이 아니다",
    rules: [
      "목표는 같은 좌표 거리와 비슷한 시각 차이를 더 가깝게 만드는 것이다",
      "MacAdam ellipse는 같은 색처럼 보이는 범위가 위치마다 다름을 보여준다",
      "Delta E도 상황과 모델에 따라 해석해야 하는 근사값이다",
    ],
    title: "MacAdam ellipse가 말하는 것",
    visual: <AppendixPerceptualUniformityVisual />,
  },
  lchPolar: {
    badges: ["Lab", "LCH", "polar"],
    claim: "LCH는 Lab의 a/b 평면을 Chroma와 Hue로 다시 읽은 표현이다",
    rules: [
      "a/b는 Green-Red, Blue-Yellow 상대축이다",
      "C는 중립축에서 얼마나 멀리 떨어졌는지 나타낸다",
      "H는 a/b 평면에서 색상 방향을 각도로 읽는다",
    ],
    title: "LCH는 Lab을 극좌표로 읽은 것이다",
    visual: <AppendixLchPolarVisual />,
  },
  oklchChromaLimit: {
    badges: ["chroma", "gamut", "not 100%"],
    claim: "OKLCH Chroma의 실질적인 최대값은 L과 H와 대상 색역에 따라 달라진다",
    rules: [
      "C는 HSL saturation처럼 0-100%로 고정된 비율 축이 아니다",
      "노랑과 파랑은 같은 C에서도 색역 한계에 닿는 위치가 다르다",
      "팔레트 생성은 C를 올린 뒤 gamut check로 줄이는 과정이 필요하다",
    ],
    title: "OKLCH Chroma의 최대값은 고정되어 있지 않다",
    visual: <AppendixOklchChromaLimitVisual />,
  },
  oklchContrast: {
    badges: ["OKLCH L", "WCAG", "verify"],
    claim: "OKLCH L은 설계 축이고, 접근성 대비는 별도 검증이다",
    rules: [
      "L 값이 비슷하면 팔레트 초안의 밝기 관계를 보기 쉽다",
      "텍스트 대비는 실제 배경 위에서 WCAG contrast로 확인해야 한다",
      "OKLCH는 접근성을 자동 해결하지 않고 검증 전 단계를 안정화한다",
    ],
    title: "OKLCH L은 접근성 대비가 아니다",
    visual: <AppendixOklchContrastVisual />,
  },
  startWithLightness: {
    badges: ["L first", "scale", "roles"],
    claim: "OKLCH 팔레트는 hue가 아니라 Lightness 배치부터 시작한다",
    rules: [
      "background, surface, border, text 역할의 L 범위를 먼저 정한다",
      "그 다음 브랜드 H를 얹고 C로 색의 존재감을 조절한다",
      "밝은 끝과 어두운 끝은 C를 낮춰 UI 역할을 안정화한다",
    ],
    title: "OKLCH 팔레트는 L부터 정한다",
    visual: <AppendixOklchLightnessVisual />,
  },
  hclRoles: {
    badges: ["H", "C", "L"],
    claim: "Hue는 정체성, Chroma는 강도, Lightness는 UI 역할이다",
    rules: [
      "H는 브랜드나 의미 색상의 방향을 고정한다",
      "C는 얼마나 선명하고 공격적인 색인지 결정한다",
      "L은 토큰 scale과 컴포넌트 역할의 위계를 만든다",
    ],
    title: "H는 정체성, C는 강도, L은 UI 역할",
    visual: <AppendixOklchHclRolesVisual />,
  },
  chromaStrategies: {
    badges: ["safe", "brand", "vivid"],
    claim: "C 전략은 팔레트가 얼마나 튀어도 되는지에 대한 정책이다",
    rules: [
      "safe는 C를 낮춰 surface와 text 주변에서 안정적으로 쓴다",
      "brand는 기본 accent scale에 맞는 중간 C를 쓴다",
      "vivid는 강한 강조에 쓰되 out-of-gamut과 대비를 먼저 본다",
    ],
    title: "Safe / Brand / Vivid chroma 전략",
    visual: <AppendixOklchChromaStrategyVisual />,
  },
  colorChecklist: {
    badges: ["choose", "adjust", "verify"],
    claim: "색 지정은 선택보다 검증까지 포함한 절차다",
    rules: [
      "H 선택: 브랜드와 의미 방향을 정한다",
      "L 배치: 역할과 scale을 먼저 만든다",
      "C 조정: gamut과 contrast를 확인하며 강도를 낮춘다",
    ],
    title: "OKLCH 색 지정 체크리스트",
    visual: <AppendixOklchChecklistVisual />,
  },
} as const

function AppendixTextSlide({
  badges,
  claim,
  rules,
  title,
  visual,
}: AppendixTextSlideProps) {
  return (
    <PresentationSlideShell ariaLabel={title} title={title}>
      <SlideTwoColumn variant="visualWide">
        <SlideExplanationRail
          badges={badges}
          claim={claim}
          rules={rules}
        />
        <SlideVisualStage className="grid content-center">
          {visual}
        </SlideVisualStage>
      </SlideTwoColumn>
    </PresentationSlideShell>
  )
}

export function AppendixPresentationScopeSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.scope} />
}

export function AppendixTerminologyMapSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.terminology} />
}

export function AppendixRgbGamutFamilySlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.rgbFamily} />
}

export function AppendixHslLightnessFormulaSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.hslLightness} />
}

export function AppendixPerceptualUniformitySlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.perceptualUniformity} />
}

export function AppendixLchPolarCoordinatesSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.lchPolar} />
}

export function AppendixOklchChromaLimitSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.oklchChromaLimit} />
}

export function AppendixOklchContrastCheckSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.oklchContrast} />
}

export function AppendixOklchStartWithLightnessSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.startWithLightness} />
}

export function AppendixOklchHclRolesSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.hclRoles} />
}

export function AppendixOklchChromaStrategiesSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.chromaStrategies} />
}

export function AppendixOklchColorChecklistSlide() {
  return <AppendixTextSlide {...APPENDIX_TEXT_SLIDES.colorChecklist} />
}
