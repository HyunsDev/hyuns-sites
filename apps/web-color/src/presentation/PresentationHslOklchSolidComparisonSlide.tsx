import {
  PresentationSlideShell,
  SlideVisualStage,
} from "@/presentation/PresentationSlideLayout"
import { PresentationSolidModelViewer } from "@/presentation/PresentationSolidModelViewer"

type ComparisonModelId = "hsl" | "oklch"

type SolidComparisonModelProps = {
  readonly modelId: ComparisonModelId
  readonly title: string
}

export function HslOklchSolidComparisonSlide() {
  return (
    <PresentationSlideShell ariaLabel="HSL과 OKLCH 3D 모델 비교" title="HSL vs OKLCH">
      <SlideVisualStage className="min-h-0">
        <div className="grid h-full min-h-0 grid-cols-2 items-stretch gap-[3.2cqw]">
          <SolidComparisonModel modelId="hsl" title="HSL" />
          <SolidComparisonModel modelId="oklch" title="OKLCH" />
        </div>
      </SlideVisualStage>
    </PresentationSlideShell>
  )
}

function SolidComparisonModel({
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
        cubeDefaultEnabled={modelId === "oklch"}
        showCubeSwitch={false}
        showGamutSelect={false}
        showSliceControls={false}
        solidModelClassName="-translate-y-[9cqh]"
        targetDefaultEnabled
        showTargetControls
        showTargetSwitch={false}
        targetControlsPlacement="bottom"
        targetCssColor="oklch(70% 0.18 32)"
      />
      <div className="pointer-events-none absolute bottom-[19cqh] left-1/2 grid w-[min(22rem,82%)] -translate-x-1/2 justify-items-center gap-[0.7cqh] text-center">
        <p className="font-mono text-[clamp(1rem,2.4cqw,2rem)] leading-none font-bold tracking-normal">
          {title}
        </p>
      </div>
    </section>
  )
}
