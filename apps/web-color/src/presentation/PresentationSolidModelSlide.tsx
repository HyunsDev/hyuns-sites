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
  showCubeSwitch,
  showGamutSelect,
  showSliceControls,
  solidModelClassName,
  showTargetControls,
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
        showCubeSwitch={showCubeSwitch}
        showGamutSelect={showGamutSelect}
        showSliceControls={showSliceControls}
        solidModelClassName={solidModelClassName}
        showTargetControls={showTargetControls}
        targetControlsPlacement={targetControlsPlacement}
        targetCssColor={targetCssColor}
      />
    </section>
  )
}
