import {
  PresentationSolidModelViewer,
  type PresentationSolidModelViewerProps,
} from "@/presentation/PresentationSolidModelViewer"

type PresentationSolidModelSlideProps = PresentationSolidModelViewerProps & {
  readonly ariaLabel: string
  readonly title: string
}

export function PresentationSolidModelSlide({
  ariaLabel,
  baseModelId,
  cubeDefaultEnabled,
  showCubeSwitch,
  showGamutSelect,
  showSliceControls,
  solidModelClassName,
  targetDefaultEnabled,
  showTargetControls,
  showTargetSwitch,
  targetControlsPlacement,
  targetCssColor,
  title,
}: PresentationSolidModelSlideProps) {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label={ariaLabel}
    >
      <h1 className="pointer-events-none absolute top-[7.2cqh] left-[6.8cqw] z-10 max-w-[24ch] text-[clamp(1.35rem,3cqw,2.65rem)] leading-[1.12] font-bold tracking-normal text-balance max-md:top-[10%] max-md:left-[5cqw] max-md:max-w-[20ch] max-md:text-[0.82rem]">
        {title}
      </h1>
      <PresentationSolidModelViewer
        baseModelId={baseModelId}
        cubeDefaultEnabled={cubeDefaultEnabled}
        showCubeSwitch={showCubeSwitch}
        showGamutSelect={showGamutSelect}
        showSliceControls={showSliceControls}
        solidModelClassName={solidModelClassName}
        targetDefaultEnabled={targetDefaultEnabled}
        showTargetControls={showTargetControls}
        showTargetSwitch={showTargetSwitch}
        targetControlsPlacement={targetControlsPlacement}
        targetCssColor={targetCssColor}
      />
    </section>
  )
}
