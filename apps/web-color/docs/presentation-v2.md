# 색을 표현하는 방식에서 색을 설계하는 방식으로

이 문서는 `web-color` 프레젠테이션 v2를 실제 슬라이드로 구현하기 위한 제작 사양서다.

현재 목표는 최종 대본을 완성하는 것이 아니라, 슬라이드 구현자가 판단을 다시 하지 않아도 될 만큼 각 슬라이드의 목적, 화면 요소, 인터랙션, 완료 기준을 고정하는 것이다.

## 발표 계약

### 대상

- 웹 개발자
- 프론트엔드 개발자
- 디자인 시스템에 관심 있는 개발자
- CSS 색상 문법은 어느 정도 알지만 색 모델의 차이는 명확히 모르는 사람

### 목표

이 발표는 RGB, HSL, HSV, Lab, LCH, Oklab, OKLCH를 단순 나열하지 않는다.

개발자가 색을 코드로 다룰 때 다음 질문에 답할 수 있게 만드는 것이 목표다.

- 왜 색을 표현하는 방식이 여러 개 있을까?
- `rgb()`, `hsl()`, `oklch()`는 각각 어떤 문제를 해결하려고 만들어졌을까?
- HSL이 직관적인데도 왜 요즘 OKLCH가 자주 언급될까?
- 팔레트, hover 색상, 다크모드, 그라데이션을 만들 때 어떤 모델을 써야 할까?
- 실무에서는 RGB, HSL, OKLCH를 어떻게 나누어 사용해야 할까?

### 핵심 메시지

> RGB는 색을 표시하기 좋은 모델이고, HSL/HSV는 색을 고르기 쉬운 모델이며, OKLCH는 색을 시스템으로 설계하기 좋은 모델이다.

### 발표의 관점

이 발표의 흐름은 “어떤 문법이 더 최신인가”가 아니다.

```text
색을 표시한다
-> 색을 고른다
-> 색 차이를 설명한다
-> 색을 시스템으로 설계한다
```

각 색 모델은 더 오래된 모델을 폐기하기 위해 나온 것이 아니라, 다른 문제를 더 잘 풀기 위해 등장한 도구로 설명한다.

## 슬라이드 제작 원칙

### 정보 밀도

- 한 슬라이드는 하나의 주장만 가진다.
- 슬라이드 텍스트는 발표자가 읽을 문장이 아니라, 발표 내용을 지지하는 시각 단서다.
- 설명이 필요한 문장은 speaker note에 둔다.
- 화면에는 제목, 짧은 키워드, 코드, 직접 조작 가능한 시각 자료만 남긴다.

### 디자인 시스템

- Hyuns UI 컴포넌트와 토큰을 우선 사용한다.
- 코드 예시는 가능하면 Hyuns UI `CodeBlock` 계열을 사용한다.
- 슬라이드 하단 도구는 기존 `PresentationTools` 흐름을 유지한다.
- 슬라이드 내부에 `data-theme="dark"`를 직접 걸지 않는다.
- 구현 검증은 dark 테마 기준으로 한다.

### 인터랙션

- 색 모델을 설명하는 슬라이드는 가능하면 값 조작이 가능해야 한다.
- RGB, HSL, HSV, OKLCH처럼 축이 명확한 모델은 축 바, 2D plane, 입력 필드를 제공한다.
- 단순 그림으로 충분한 슬라이드는 정적 도식으로 구현하되, raster screenshot을 UI 대체물로 쓰지 않는다.
- 기존 컴포넌트가 있으면 재사용한다. 특히 RGB 축 표현은 `ColorAxisBarCanvas`를 우선 사용한다.

### 구현 단위

각 슬라이드는 다음 단위로 분리한다.

- slide component: 슬라이드 한 장의 배치와 상태를 담당
- visual component: 반복 가능한 시각화
- model helper: 색상 계산, 행 데이터, 샘플 생성
- testable helper: 숫자 변환, 팔레트 생성, 색상 목록 생성

## 전체 구성

### 0부. 오프닝

1. 인트로
2. 목차

### 1부. RGB부터 OKLCH까지

색 모델의 지도를 만든다.

```text
기계가 다루기 쉬운 RGB
-> 사람이 고르기 쉬운 HSL/HSV
-> 사람이 느끼는 색 차이에 가까운 Lab/LCH
-> 현대 웹 UI 색상 설계에 적합한 Oklab/OKLCH
```

### 2부. 당신이 OKLCH를 사용해야 하는 이유

OKLCH를 최신 문법이 아니라 실무 문제 해결 도구로 설득한다.

- 팔레트 단계가 들쭉날쭉한 문제
- hover, active 색상을 감으로 찍는 문제
- 그라데이션 중간색이 어색한 문제
- 다크모드 색상을 단순 반전하거나 단순 어둡게 처리하는 문제
- 디자인 토큰을 정적인 색 값 목록으로만 관리하는 문제

## 슬라이드 목록

총 27장의 본편 슬라이드와 1장의 보조 데모로 시작한다. `oklch-gradient`는 시간이 충분할 때 2부 안에 끼워 넣는 보조 슬라이드로 둔다.

| 번호 | id | 제목 | 역할 | 구현 우선순위 |
| --- | --- | --- | --- | --- |
| 01 | intro | RGB부터 OKLCH까지 | 발표 진입 | 완료됨 |
| 02 | agenda | 오늘의 지도 | 전체 구조 제시 | 높음 |
| 03 | css-color-notations | CSS의 다양한 색상 표기법 | 문제 제기 | 완료됨 |
| 04 | rgb-model | RGB | RGB 3축 모델 | 완료됨 |
| 05 | rgb-strengths | RGB의 장점 | 장치 친화성 | 높음 |
| 06 | rgb-limits | RGB의 한계 | 조정 불편함 | 높음 |
| 07 | hsl-hsv-intro | HSL과 HSV | RGB 재배열 모델 | 높음 |
| 08 | hsl-model | HSL | hue, saturation, lightness | 높음 |
| 09 | hsv-model | HSV | hue, saturation, value | 높음 |
| 10 | hsv-picker | HSV Color Picker | 실사용 picker 구조 | 높음 |
| 11 | hsl-vs-hsv | HSL vs HSV | 차이와 사용처 | 중간 |
| 12 | axis-palettes | 왜 편리한가 | 단일 축 변경 팔레트 | 높음 |
| 13 | hsl-lightness-trap | HSL의 함정 | L은 지각 명도가 아님 | 높음 |
| 14 | rgb-derived-limits | RGB 기반 모델의 한계 | 기하학적 변환의 한계 | 중간 |
| 15 | perceptual-models | 지각 기반 색 모델의 대두 | Lab 도입 맥락 | 중간 |
| 16 | lab-model | Lab | L, a, b 축 | 높음 |
| 17 | lch-model | LCH | Lab의 극좌표 표현 | 높음 |
| 18 | out-of-gamut | 좌표는 가능해도 화면에 다 나오는 것은 아니다 | 색역 경계와 out of gamut | 높음 |
| 19 | lab-to-oklab | Lab에서 Oklab으로 | Lab 한계와 Oklab 개선 방향 | 중간 |
| 20 | oklch-model | OKLCH | 설계하기 쉬운 지각 모델 | 높음 |
| 21 | part-1-summary | 1부 정리 | 색 모델 지도 완성 | 높음 |
| 22 | why-oklch | HSL으로는 부족한 이유 | 2부 진입 문제 제기 | 높음 |
| 23 | oklch-lightness | 이유 1: 명도 설계 | 지각 명도 중심 UI | 높음 |
| 24 | oklch-brand-palette | 이유 2: 브랜드 팔레트 | 규칙 기반 팔레트 | 높음 |
| 25 | oklch-state-colors | 이유 3: 상태 색상 | 관계적 색상 생성 | 높음 |
| 26 | oklch-dark-mode | 이유 4: 다크모드 설계 | 명도 관계 유지 | 높음 |
| 27 | choose-the-tool | 그렇다고 OKLCH만 쓰면 되는 건 아니다 | 실무 선택 기준과 결론 | 높음 |

보조 슬라이드:

| 번호 | id | 제목 | 역할 | 사용 조건 |
| --- | --- | --- | --- | --- |
| A1 | oklch-gradient | 자연스러운 그라데이션 | 보간 공간 비교 데모 | 시간이 충분하면 2부 중간에 삽입 |

## 슬라이드별 제작 사양

### Slide 01. 인트로

- id: `intro`
- title: `RGB부터 OKLCH까지`
- purpose: 발표 주제를 “색 문법 소개”가 아니라 “색 설계 모델의 변화”로 잡는다.
- on-slide:
  - `RGB부터 OKLCH까지`
  - `/ 당신이 OKLCH를 사용해야 하는 이유`
  - `Yourssu FE | Hyuns`
- speaker:
  - 웹에서 색을 쓰는 방식은 단순한 문자열 입력에서 점점 색을 설계하는 도구로 바뀌고 있다.
- visual:
  - 현재 구현된 3D solid model visual 유지
- components:
  - `PresentationSolidModelVisual`
- acceptance:
  - 제목, 부제, 발표자 정보가 첫 화면에서 명확하다.
  - 슬라이드 하단 도구가 유지된다.

### Slide 02. 목차

- id: `agenda`
- title: `오늘의 지도`
- purpose: 발표가 2부 구조라는 것을 먼저 알려준다.
- on-slide:
  - `1부. RGB부터 OKLCH까지`
  - `2부. 당신이 OKLCH를 사용해야 하는 이유`
  - 하단 또는 우측에 핵심 문장: `표현에서 설계로`
- speaker:
  - 1부에서는 색 모델이 어떤 문제를 해결하며 변해왔는지 지도를 만들고, 2부에서는 OKLCH가 UI 설계에서 왜 유용한지 본다.
- visual:
  - 왼쪽에서 오른쪽으로 이어지는 단계형 타임라인
  - `RGB -> HSL/HSV -> Lab/LCH -> Oklab/OKLCH`
- components:
  - `ColorModelTimeline`
- acceptance:
  - 청중이 발표 흐름을 5초 안에 파악할 수 있다.

### Slide 03. CSS의 다양한 색상 표기법

- id: `css-color-notations`
- title: `CSS의 다양한 색상 표기법`
- purpose: 같은 빨강도 여러 방식으로 표현될 수 있음을 보여준다.
- on-slide:
  - 코드 예시만 표시
  - `color: #ff0000;`
  - `color: rgb(255 0 0);`
  - `color: hsl(0 100% 50%);`
  - `color: oklch(62.8% 0.2577 29.23);`
- speaker:
  - 이것들은 단순히 문법 취향이 아니라 서로 다른 좌표계와 목적을 가진 표현이다.
- visual:
  - CodeBlock 중심
- components:
  - Hyuns UI `CodeBlock`
- acceptance:
  - 불필요한 설명 문장이 화면에 없다.

### Slide 04. RGB

- id: `rgb-model`
- title: `RGB: 기계가 좋아하는 색 모델`
- purpose: RGB가 Red, Green, Blue 3축으로 색을 표현한다는 것을 직접 조작으로 보여준다.
- on-slide:
  - `RGB`
  - `#RRGGBB`
  - `R`, `G`, `B`
- speaker:
  - RGB는 장치가 빛을 섞어 색을 표시하기에 좋은 모델이다. 사람이 색상을 고르는 감각과는 거리가 있다.
- visual:
  - 현재 구현된 색상 미리보기 카드
  - R/G/B 축 바
  - 숫자 input
- components:
  - `ColorAxisBarCanvas`
  - `RgbColorPreview`
  - `RgbAxisControlRow`
- acceptance:
  - R/G/B input이나 축 바를 조작하면 preview와 HEX가 즉시 바뀐다.

### Slide 05. RGB의 장점

- id: `rgb-strengths`
- title: `RGB의 장점`
- purpose: RGB가 나쁜 모델이 아니라 표시와 저장에 강한 모델임을 말한다.
- on-slide:
  - `표시 장치에 가깝다`
  - `저장과 출력이 편리하다`
- speaker:
  - 화면은 결국 빨강, 초록, 파랑 빛의 조합으로 표시된다. 그래서 RGB는 렌더링, 이미지 데이터, 디스플레이 출력에 자연스럽다.
- visual:
  - 세 개의 채널 레이어가 합쳐져 하나의 색상 카드가 되는 구조
  - RGB channel split demo를 단순 도식으로 표현
- components:
  - `RgbChannelStack`
- acceptance:
  - RGB가 실무에서 여전히 필요한 이유가 한눈에 보인다.

### Slide 06. RGB의 한계

- id: `rgb-limits`
- title: `RGB의 한계`
- purpose: RGB가 색 선택과 조정에는 불편하다는 문제를 만든다.
- on-slide:
  - `색조를 바꾸기 어렵다`
  - `채도를 바꾸기 어렵다`
  - `밝기를 감으로 맞추게 된다`
- speaker:
  - RGB 값 하나를 바꾼다고 우리가 생각하는 색조, 채도, 밝기 중 하나만 바뀌지 않는다.
- visual:
  - 같은 RGB 조작에서 hue, saturation, brightness가 함께 흔들리는 비교
  - 작은 input 세트와 불안정한 결과 preview
- components:
  - `RgbAdjustmentProblemDemo`
- acceptance:
  - “R 값을 줄이면 그냥 덜 빨간색이 되는가?”라는 질문이 생겨야 한다.

### Slide 07. HSL과 HSV

- id: `hsl-hsv-intro`
- title: `사람이 고르기 쉬운 좌표로 바꾸기`
- purpose: HSL/HSV를 RGB의 대체가 아니라 RGB를 사람이 다루기 쉬운 형태로 재배열한 모델로 소개한다.
- on-slide:
  - `Hue`
  - `Saturation`
  - `Lightness / Value`
- speaker:
  - HSL과 HSV는 색을 표시하기 위한 장치 모델이라기보다, 사람이 색을 고르기 쉽게 만든 조작 모델에 가깝다.
- visual:
  - RGB cube가 원통 또는 원뿔 형태의 HSL/HSV 모델로 변환되는 도식
- components:
  - `ColorModelTransformDiagram`
- acceptance:
  - HSL/HSV가 RGB와 완전히 독립된 세계가 아니라는 점이 드러난다.

### Slide 08. HSL

- id: `hsl-model`
- title: `HSL`
- purpose: HSL의 세 축을 설명한다.
- on-slide:
  - `H: Hue`
  - `S: Saturation`
  - `L: Lightness`
- speaker:
  - HSL은 색조를 각도로, 채도를 색의 강도로, lightness를 흰색과 검은색 사이의 위치처럼 다룬다.
- visual:
  - hue ring 또는 hue bar
  - saturation/lightness plane
  - H/S/L input
- components:
  - `HslControlDemo`
  - `ColorAxisBarCanvas`를 재사용할 수 있으면 재사용
- acceptance:
  - H, S, L 중 하나만 조작할 수 있다.

### Slide 09. HSV

- id: `hsv-model`
- title: `HSV`
- purpose: HSV가 picker에서 자주 쓰이는 이유를 설명한다.
- on-slide:
  - `H: Hue`
  - `S: Saturation`
  - `V: Value`
- speaker:
  - HSV는 색을 고르는 도구에서 자주 보인다. Value는 선택한 hue가 얼마나 밝게 표시되는지에 가까운 조작 축이다.
- visual:
  - hue bar
  - saturation/value plane
  - H/S/V input
- components:
  - `HsvControlDemo`
- acceptance:
  - Hue를 바꾸면 plane 전체가 해당 hue 계열로 바뀐다.

### Slide 10. HSV Color Picker

- id: `hsv-picker`
- title: `Color Picker는 왜 이렇게 생겼을까?`
- purpose: 실무 color picker UI가 HSV 구조와 잘 맞는다는 것을 보여준다.
- on-slide:
  - `Hue`
  - `Saturation x Value`
- speaker:
  - 많은 color picker는 hue를 먼저 고르고, 선택한 hue 안에서 saturation과 value를 고르는 구조다.
- visual:
  - Photoshop류 picker와 비슷한 구조
  - 왼쪽: saturation x value 정사각형
  - 오른쪽: 세로 hue bar
  - 아래 또는 우측: CSS color output
- components:
  - `HsvColorPickerDemo`
  - `ColorPlaneCanvas`
  - `ColorAxisBarCanvas`
- acceptance:
  - plane 드래그와 hue bar 드래그가 모두 동작한다.
  - 선택한 색이 preview와 CSS 값에 반영된다.

### Slide 11. HSL vs HSV

- id: `hsl-vs-hsv`
- title: `HSL vs HSV`
- purpose: 둘의 차이를 사용처 중심으로 정리한다.
- on-slide:
  - `HSL: 색상 변형을 설명하기 쉽다`
  - `HSV: 색상 선택기에 적합하다`
- speaker:
  - HSL은 CSS에서 색상 변형을 말하기 좋고, HSV는 색을 직접 고르는 도구에 익숙하다.
- visual:
  - 동일한 hue에서 HSL lightness 변화와 HSV value 변화 비교
- components:
  - `HslHsvComparisonRows`
- acceptance:
  - 같은 숫자 변화가 서로 다른 결과를 만든다는 점이 보인다.

### Slide 12. 왜 편리한가

- id: `axis-palettes`
- title: `특정 값만 바꿔서 컬러셋을 만들 수 있다`
- purpose: HSL/HSV의 실무적 장점을 보여준다.
- on-slide:
  - `Hue만 변경`
  - `Saturation만 변경`
  - `Value만 변경`
- speaker:
  - RGB보다 편한 이유는 “내가 바꾸고 싶은 의미 단위”가 축으로 드러나기 때문이다.
- visual:
  - HSV 기준 10개 x 3줄 팔레트
  - 1행: Hue 변화
  - 2행: Saturation 변화
  - 3행: Value 변화
- components:
  - `ColorPaletteGrid`
  - `HsvAxisPaletteRows`
- acceptance:
  - 각 행이 하나의 축만 바뀐다는 것을 레이블과 색 변화로 확인할 수 있다.

### Slide 13. HSL의 함정

- id: `hsl-lightness-trap`
- title: `Lightness는 진짜 밝기가 아니다`
- purpose: HSL의 L이 사람이 느끼는 밝기와 잘 맞지 않음을 보여준다.
- on-slide:
  - `HSL L = 50%`
  - `같은 숫자, 다른 밝기`
- speaker:
  - HSL의 lightness는 RGB에서 계산된 값이다. 사람 눈이 느끼는 지각 명도와는 다르다.
- visual:
  - HSL L 50%인 blue, yellow, red, green 비교
  - 동일 L 값인데 blue가 훨씬 어둡게 보이는 구조
- components:
  - `LightnessComparisonGrid`
- acceptance:
  - `blue`와 `yellow`의 숫자상 L은 같지만 시각적 밝기는 다르게 느껴진다.

### Slide 14. RGB 기반 색 모델의 한계

- id: `rgb-derived-limits`
- title: `HSL과 HSV는 RGB를 다시 읽은 것이다`
- purpose: HSL/HSV가 사람에게 편하지만 지각 기반 모델은 아니라는 선을 긋는다.
- on-slide:
  - `RGB의 기하학적 변환`
  - `디스플레이 표현에 가깝다`
  - `지각 차이를 직접 다루지는 않는다`
- speaker:
  - HSL/HSV는 편한 조작법이지만, 사람이 색 차이를 느끼는 방식을 직접 모델링한 것은 아니다.
- visual:
  - RGB cube에서 HSL/HSV 좌표로 변환되는 도식
  - 옆에 perceptual 모델로 넘어가는 화살표
- components:
  - `ModelFamilyBridge`
- acceptance:
  - 다음 파트인 Lab/LCH로 넘어갈 이유가 생긴다.

### Slide 15. 지각 기반 색 모델의 대두

- id: `perceptual-models`
- title: `사람이 느끼는 차이에 가까운 좌표가 필요하다`
- purpose: CIE Lab이 등장하는 문제의식을 소개한다.
- on-slide:
  - `같은 숫자 차이`
  - `같은 시각 차이?`
- speaker:
  - 팔레트나 접근성, 그라데이션에서는 숫자가 얼마나 다른지보다 사람이 얼마나 다르게 느끼는지가 중요해진다.
- visual:
  - RGB/HSL 단계와 perceptual 단계 비교
- components:
  - `PerceptualNeedDiagram`
- acceptance:
  - Lab이 왜 필요한지 한 문장으로 설명 가능하다.

### Slide 16. Lab

- id: `lab-model`
- title: `Lab`
- purpose: Lab의 축을 설명한다.
- on-slide:
  - `L: Lightness`
  - `a: Green <-> Red`
  - `b: Blue <-> Yellow`
- speaker:
  - Lab은 밝기와 두 개의 상대 색 축으로 색을 표현한다. RGB처럼 장치 채널을 직접 말하지 않는다.
- visual:
  - L 축과 a/b 평면
  - 중앙 neutral axis
- components:
  - `LabAxisDiagram`
  - 가능하면 기존 solid model 계열을 단순화해 재사용
- acceptance:
  - RGB의 R/G/B 축과 Lab의 L/a/b 축이 다른 종류의 축이라는 점이 보인다.

### Slide 17. LCH

- id: `lch-model`
- title: `LCH`
- purpose: LCH가 Lab의 다른 표현이라는 것을 설명한다.
- on-slide:
  - `L: Lightness`
  - `C: Chroma`
  - `H: Hue`
- speaker:
  - LCH는 Lab의 a/b 직교좌표를 chroma와 hue의 극좌표로 바꾼 표현이다. 색을 설계할 때는 LCH 형태가 더 다루기 쉽다.
- visual:
  - a/b 평면 위에서 점 하나를 radius와 angle로 읽는 도식
- components:
  - `PolarCoordinateDiagram`
- acceptance:
  - Lab와 LCH가 서로 다른 색 공간이 아니라 같은 값을 읽는 방식 차이라는 점이 전달된다.

### Slide 18. 좌표는 가능해도 화면에 다 나오는 것은 아니다

- id: `out-of-gamut`
- title: `문법적으로 가능해도 화면에 다 나오는 것은 아니다`
- purpose: Lab/LCH/OKLCH 좌표계와 실제 디스플레이 색역의 경계가 다르다는 점을 out-of-gamut 주제로 묶어 설명한다.
- on-slide:
  - `valid coordinate`
  - `display gamut`
  - `out of gamut`
  - `clipped or mapped`
- speaker:
  - Lab/LCH/OKLCH 같은 지각 기반 좌표는 sRGB나 Display P3 같은 표시 장치의 색역 자체가 아니다. 그래서 문법적으로 유효한 좌표라도 실제 화면에서는 표시 불가능해 clipping되거나 mapping될 수 있다.
- visual:
  - LCH 또는 OKLCH coordinate shell
  - 같은 chroma를 올리면 hue마다 먼저 clipping되는 비교
  - sRGB, Display P3, Rec.2020 경계 표시
- components:
  - `GamutClippingDemo`
  - `GamutShellPreview`
  - 기존 `ColorGamutClippingPage` 또는 `color-gamut-clipping-models` 계산 재사용
- acceptance:
  - “문법적으로 가능한 색”과 “디스플레이에 표시 가능한 색”이 다르다는 점이 한 장에서 보인다.

### Slide 19. Lab에서 Oklab으로

- id: `lab-to-oklab`
- title: `Lab에서 Oklab으로`
- purpose: Lab의 실무적 한계와 Oklab의 개선 방향을 한 장으로 연결한다.
- on-slide:
  - `Lab: perceptual, but not perfect`
  - `Blue hue shift`
  - `Oklab: better hue / lightness / gradients`
- speaker:
  - Lab과 LCH는 RGB/HSL보다 지각에 가까워졌지만 완벽하지는 않다. 특히 파란색 영역의 hue 예측 문제처럼 실무에서 어색한 결과가 생길 수 있고, Oklab은 이런 문제를 더 실용적으로 개선하려는 모델이다.
- visual:
  - Lab과 Oklab gradient 또는 hue path 비교
  - blue hue shift를 작은 곡선 도식으로 보조 표시
- components:
  - `LabToOklabComparison`
  - `OklabImprovementComparison`
- acceptance:
  - “Lab이 나쁘다”가 아니라 “Lab 계열의 문제를 개선해 OKLCH로 이어진다”로 읽힌다.

### Slide 20. OKLCH

- id: `oklch-model`
- title: `OKLCH`
- purpose: OKLCH를 UI 색상 설계에 적합한 축으로 소개한다.
- on-slide:
  - `L: perceived lightness`
  - `C: chroma`
  - `H: hue`
- speaker:
  - OKLCH는 Oklab을 사람이 조작하기 쉬운 L, C, H 축으로 다시 읽은 형태다. UI에서는 특히 L을 기준으로 단계와 상태를 설계하기 좋다.
- visual:
  - OKLCH L/C/H axis controls
  - preview + CSS output
- components:
  - `OklchControlDemo`
  - `ColorAxisBarCanvas`
- acceptance:
  - L을 바꾸면 지각 밝기 중심으로 색상이 변화한다.

### Slide 21. 1부 정리

- id: `part-1-summary`
- title: `색 모델의 지도`
- purpose: 1부의 흐름을 한 장으로 고정한다.
- on-slide:
  - `RGB: 표시`
  - `HSL/HSV: 선택`
  - `Lab/LCH: 지각 차이`
  - `Oklab/OKLCH: UI 설계`
- speaker:
  - 각 모델은 서로 대체재라기보다 다른 목적의 도구다.
- visual:
  - 4단계 지도
- components:
  - `ColorModelPurposeMap`
- acceptance:
  - 발표 핵심 메시지의 전반부가 완성된다.

### Slide 22. HSL으로는 부족한 이유

- id: `why-oklch`
- title: `HSL은 직관적이지만, 팔레트에는 불안정하다`
- purpose: 2부 진입과 OKLCH 필요성을 하나로 묶는다. HSL이 색을 고르기는 쉽지만 팔레트와 상태 색상 설계에는 불안정하다는 문제를 제기한다.
- on-slide:
  - `색을 고르기는 쉽다`
  - `단계를 설계하기는 어렵다`
  - `관계를 설계해야 한다`
- speaker:
  - 이제부터는 모델 설명이 아니라 UI 색상 설계 문제를 본다. HSL은 직관적이지만 여러 hue에서 같은 lightness 단계를 만든다고 해서 같은 시각 밝기 단계가 만들어지지는 않는다. OKLCH는 팔레트, 상태 색상, 다크모드처럼 색 사이의 관계를 설계할 때 유용하다.
- visual:
  - HSL lightness palette와 OKLCH lightness palette 비교
  - 하단에 `palette`, `state`, `dark mode` 문제 칩 배치
  - gradient 문제는 보조 데모로 분리
- components:
  - `HslOklchPaletteComparison`
  - `OklchUseCaseChips`
- acceptance:
  - 2부에서 해결할 문제가 “HSL의 조작 편의성”이 아니라 “색상 관계 설계”라는 점이 명확하다.

### Slide 23. 이유 1: OKLCH는 명도 설계가 쉽다

- id: `oklch-lightness`
- title: `UI에서 중요한 것은 사람이 느끼는 밝기다`
- purpose: L 축을 디자인 토큰의 핵심 축으로 제안한다.
- on-slide:
  - `L = perceived lightness`
  - `50 -> 100 -> ... -> 900`
- speaker:
  - UI에서 배경, 경계선, 텍스트, hover 상태는 대부분 밝기 관계로 읽힌다. OKLCH의 L은 이 관계를 다루기 좋다.
- visual:
  - 한 hue에서 L만 바꾸는 50-900 팔레트
  - HSL 버전과 비교 가능
- components:
  - `OklchLightnessRamp`
- acceptance:
  - L 단계가 팔레트 스케일로 바로 연결된다.

### Slide 24. 이유 2: 브랜드 팔레트를 규칙으로 만들 수 있다

- id: `oklch-brand-palette`
- title: `팔레트를 감이 아닌 규칙으로 만든다`
- purpose: 브랜드 색 하나에서 팔레트 전체를 생성하는 방식을 보여준다.
- on-slide:
  - `base hue`
  - `fixed chroma`
  - `lightness scale`
- speaker:
  - 하나의 브랜드 hue를 기준으로 L과 C 규칙을 정하면 50부터 900까지의 팔레트를 일관되게 만들 수 있다.
- visual:
  - base color input
  - 생성된 50, 100, 200, ..., 900 swatch
  - out-of-gamut swatch 표시
- components:
  - `OklchBrandPaletteGenerator`
- acceptance:
  - 입력 색을 바꾸면 팔레트 전체가 규칙에 따라 재계산된다.

### Slide 25. 이유 3: 상태 색상을 관계적으로 만들 수 있음

- id: `oklch-state-colors`
- title: `hover와 active를 감으로 찍지 않는다`
- purpose: 상태 색상을 base color와의 관계로 만든다.
- on-slide:
  - `base`
  - `hover`
  - `active`
  - `disabled`
- speaker:
  - 상태 색상은 별도의 색 값 목록이라기보다 base color에서 밝기, 채도, alpha 관계를 조정한 결과로 볼 수 있다.
- visual:
  - base button
  - hover, active, disabled 상태 버튼
  - 오른쪽에 `color-mix()` 또는 relative color 예시
- components:
  - `StateColorRelationDemo`
  - Hyuns UI `Button`
  - Hyuns UI `CodeBlock`
- acceptance:
  - 상태 색상이 독립 값이 아니라 관계로 설명된다.

### Slide 26. 이유 4: 다크모드 설계에 유리하다

- id: `oklch-dark-mode`
- title: `다크모드는 단순히 어둡게 만드는 것이 아니다`
- purpose: 다크모드 색상을 명도 관계로 설계하는 관점을 제시한다.
- on-slide:
  - `background`
  - `surface`
  - `border`
  - `text`
  - `accent`
- speaker:
  - 다크모드는 라이트 색상을 반전하거나 검정에 섞는 문제가 아니다. 역할별 명도 관계와 대비를 다시 설계해야 한다.
- visual:
  - light token scale과 dark token scale 비교
  - OKLCH L 값을 축으로 표시
- components:
  - `ThemeTokenLightnessMap`
  - Hyuns UI token 색상 사용 검토
- acceptance:
  - 라이트/다크 토큰이 같은 색상 목록의 반전이 아니라 역할별 관계로 보인다.

### Slide 27. 그렇다고 OKLCH만 쓰면 되는 건 아니다

- id: `choose-the-tool`
- title: `상황에 따라 도구를 골라야 한다`
- purpose: 발표 결론. 모델별 실무 사용처를 정리한다.
- on-slide:
  - `RGB: 표시, 저장, 장치 출력`
  - `HSL/HSV: picker, 빠른 색 선택`
  - `OKLCH: 팔레트, 상태, 테마 설계`
- speaker:
  - OKLCH는 모든 곳의 정답이 아니라, 색을 시스템으로 설계할 때 좋은 도구다. 각 모델은 목적이 다르다.
- visual:
  - decision table
  - 마지막 핵심 메시지 강조
- components:
  - `ColorModelDecisionTable`
- acceptance:
  - 발표 핵심 메시지가 그대로 회수된다.

### Support A. 자연스러운 그라데이션

- id: `oklch-gradient`
- title: `중간색은 어디에서 섞느냐에 따라 달라진다`
- purpose: 시간이 충분할 때 보조 데모로 사용한다. OKLCH가 gradient에서도 유용하다는 점을 보여주되, 본편의 필수 논리에서는 제외한다.
- on-slide:
  - `RGB`
  - `HSL`
  - `OKLCH`
- speaker:
  - 같은 시작색과 끝색도 어느 공간에서 섞는지에 따라 중간색이 달라진다. 시간이 충분하다면 이 데모로 OKLCH의 보간 장점을 추가로 보여준다.
- visual:
  - 동일 start/end 색을 RGB, HSL, OKLCH에서 보간한 gradient rows
- components:
  - 기존 `ColorInterpolationPage`의 row/model 계산 재사용
  - `GradientInterpolationComparison`
- acceptance:
  - 이 슬라이드를 건너뛰어도 2부 핵심 논리가 끊기지 않는다.

## 재사용 컴포넌트 후보

### 이미 있는 컴포넌트

- `PresentationDeckPage`: 슬라이드 라우팅과 stage 연결
- `PresentationTools`: 이전/다음, fullscreen, accent color, theme selector
- `ColorAxisBarCanvas`: 단일 축 조작용 gradient bar
- `ColorPlaneCanvas`: 2D plane 조작이 필요할 때 재사용 검토
- `CodeBlock`: CSS 코드 중심 슬라이드
- `ColorInterpolationPage` 관련 모델: gradient 보간 비교 계산에 재사용
- `ColorGamutClippingPage` 관련 모델: out-of-gamut 설명에 재사용

### 새로 만들 컴포넌트

- `ColorModelTimeline`
  - RGB -> HSL/HSV -> Lab/LCH -> Oklab/OKLCH 흐름 표시
- `ColorModelPurposeMap`
  - 모델별 목적을 한 장에 정리
- `ColorPaletteGrid`
  - 10개 x N행 팔레트 공통 렌더링
- `LightnessComparisonGrid`
  - 같은 숫자 lightness와 지각 밝기 차이 비교
- `HsvColorPickerDemo`
  - Hue bar + Saturation/Value plane
- `GamutClippingDemo`
  - 지각 기반 좌표와 sRGB, Display P3, Rec.2020 색역 경계 비교
- `LabToOklabComparison`
  - Lab의 한계와 Oklab 개선 방향 비교
- `OklchControlDemo`
  - L/C/H 축 조작과 CSS 값 표시
- `OklchUseCaseChips`
  - 2부에서 다룰 팔레트, 상태, 다크모드 문제 표시
- `OklchBrandPaletteGenerator`
  - base color에서 50-900 팔레트 생성
- `StateColorRelationDemo`
  - base, hover, active, disabled 관계 시각화
- `ThemeTokenLightnessMap`
  - light/dark token의 명도 관계 표시
- `GradientInterpolationComparison`
  - 보조 데모에서 RGB, HSL, OKLCH 보간 결과 비교

### 계산 helper 후보

- `createHsvAxisPaletteRows`
- `createHslOklchLightnessRows`
- `createOklchPaletteScale`
- `createStateColorRows`
- `createThemeLightnessRows`

계산 helper는 가능하면 순수 함수로 만들고, `node --experimental-strip-types --test "src/**/*.test.ts"`에서 테스트한다.

## 구현 순서

### Phase 1. 문서와 슬라이드 레지스트리 정리

- 이 문서를 기준으로 slide id를 확정한다.
- `presentation-slides.ts`의 순서를 문서와 일치시킨다.
- 아직 구현하지 않은 슬라이드는 placeholder가 아니라 실제 최소 슬라이드로 만든다.

완료 기준:

- `/presentation/intro`에서 다음/이전으로 전체 흐름을 이동할 수 있다.
- 모든 slide id가 문서와 일치한다.

### Phase 2. 1부 핵심 인터랙션 구현

- RGB slide는 현재 구현을 유지하고 컴포넌트 이름을 문서와 맞춘다.
- HSV picker를 만든다.
- HSL lightness trap 비교를 만든다.
- Lab/LCH/OKLCH 축 도식을 만든다.
- out-of-gamut 데모와 Lab에서 Oklab으로 넘어가는 비교를 만든다.

완료 기준:

- 1부에서 “표시 -> 선택 -> 지각 -> 설계” 흐름이 끊기지 않는다.
- RGB, HSV, OKLCH 중 최소 2개는 직접 조작 가능하다.

### Phase 3. 2부 실무 예시 구현

- OKLCH lightness ramp
- brand palette generator
- state color relation demo
- dark mode token map
- 보조 데모로 gradient comparison을 준비하되 본편 흐름의 필수 조건으로 두지 않는다.

완료 기준:

- OKLCH가 왜 실무에서 유용한지 팔레트와 상태 색상으로 증명된다.
- 단순 주장 슬라이드가 아니라 조작 가능한 예시가 포함된다.

### Phase 4. 발표 QA

- dark 테마에서 전체 슬라이드를 넘기며 확인한다.
- 하단 tools가 모든 슬라이드에서 겹치지 않는지 확인한다.
- 1280x720과 현재 in-app browser 크기에서 텍스트 겹침이 없는지 확인한다.
- 핵심 인터랙션의 입력, 드래그, reset 가능 여부를 확인한다.

완료 기준:

- `CI=true pnpm --filter web-color check`
- `CI=true pnpm --filter web-color build`
- browser dark theme QA

## 구현 시 주의할 점

### Must have

- 하단 발표 도구 유지
- Hyuns UI 컴포넌트 적극 사용
- 색상 예시는 실제 CSS 색상 또는 canvas 기반 시각화로 표시
- 발표자가 말할 내용은 speaker note 성격의 문서에 두고 슬라이드 화면에는 최소 텍스트만 표시
- dark 테마 기준 검증

### Must not have

- 슬라이드마다 별도 `data-theme="dark"` 고정
- Figma screenshot을 배경 이미지로 깔아 UI를 흉내 내기
- 설명 문단을 슬라이드 화면에 과하게 배치
- 한 슬라이드에 두 개 이상의 핵심 주장 배치
- RGB/HSL/OKLCH를 “최신 모델이 이전 모델을 대체한다”는 식으로 설명

## 참고 근거 메모

최종 발표 전에는 아래 근거를 다시 확인한다.

- MDN `<color>`: CSS `<color>`는 named color, hex, `rgb()`, `hsl()`, `lab()`, `lch()`, `oklab()`, `oklch()`, `color()` 등으로 지정할 수 있으며, 실제 보이는 색은 장치와 색 관리에 따라 달라질 수 있다.
  - https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
- MDN `oklch()`: `oklch()`는 Oklab의 원통형 표현이며, `L`은 HSL의 L과 달리 지각 밝기를 뜻한다.
  - https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- CSS Color Module Level 4: CSS는 CIE Lab/LCH와 Oklab/OkLCh를 device-independent color 섹션에서 다룬다.
  - https://www.w3.org/TR/css-color-4/
- CSS Color Module Level 4: Lab/LCH는 HSL보다 지각 차이에 가깝지만, blue 영역의 hue linearity 문제 등 한계가 있다.
  - https://www.w3.org/TR/css-color-4/#lab-colors

## 남은 결정 사항

이 문서는 구현 가능한 기본안을 제시하지만, 실제 제작 전에 아래 결정은 한 번 더 조정할 수 있다.

- 총 발표 시간
- Lab/LCH 파트를 얼마나 깊게 다룰지
- CIE xy, sRGB, Display P3, Rec.2020를 v2에 포함할지 또는 별도 발표로 분리할지
- `color-mix()`와 relative color syntax를 2부에서 어느 정도 코드로 보여줄지
- 최종 결론 슬라이드를 `choose-the-tool` 하나로 끝낼지, 별도 `final-summary`를 추가할지
