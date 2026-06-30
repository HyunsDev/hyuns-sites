import {
  PresentationSlideShell,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import { PresentationSolidModelViewer } from "@/presentation/PresentationSolidModelViewer"

type ComparisonModelId = "hsl" | "oklch"

type SolidComparisonModelProps = {
  readonly caption: string
  readonly modelId: ComparisonModelId
  readonly title: string
}

export function HslOklchSolidComparisonSlide() {
  return (
    <PresentationSlideShell ariaLabel="HSL과 OKLCH 3D 모델 비교" title="HSL vs OKLCH">
      <SlideVisualStage className="min-h-0">
        <div className="grid h-full min-h-0 grid-cols-2 items-stretch gap-[3.2cqw]">
          <SolidComparisonModel
            caption="RGB를 원통형으로 다시 배치한 공간"
            modelId="hsl"
            title="HSL"
          />
          <SolidComparisonModel
            caption="지각 명도와 채도를 기준으로 설계하는 공간"
            modelId="oklch"
            title="OKLCH"
          />
        </div>
      </SlideVisualStage>
    </PresentationSlideShell>
  )
}

function SolidComparisonModel({
  caption,
  modelId,
  title,
}: SolidComparisonModelProps) {
  return (
    <section
      aria-label={`${title} 3D solid model`}
      className="relative min-h-0 overflow-hidden"
    >
      <PresentationSolidModelViewer
        baseModelId={modelId}
        showCubeSwitch={false}
        showGamutSelect={false}
        showSliceControls={false}
        solidModelClassName="-translate-y-[9cqh]"
        showTargetControls
        targetControlsPlacement="bottom"
        targetCssColor="oklch(70% 0.18 32)"
      />
      <div className="pointer-events-none absolute bottom-[19cqh] left-1/2 grid w-[min(22rem,82%)] -translate-x-1/2 justify-items-center gap-[0.7cqh] text-center">
        <p className="font-mono text-[clamp(1rem,2.4cqw,2rem)] leading-none font-bold tracking-normal">
          {title}
        </p>
        <p className="max-w-[25ch] text-[clamp(0.64rem,1cqw,0.86rem)] leading-snug font-medium text-text-muted text-balance">
          {caption}
        </p>
      </div>
    </section>
  )
}
