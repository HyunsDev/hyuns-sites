import type { SolidColorSpaceMesh } from "@/color-models/color-space-solid-mesh"
import {
  getColorGamutRenderLabel,
  type ColorGamutRendering,
} from "@/color-models/color-gamut"

type SolidColorSpaceStatsOverlayProps = {
  readonly gamutRendering: ColorGamutRendering
  readonly mesh: SolidColorSpaceMesh
  readonly sliceMesh?: SolidColorSpaceMesh | null
}

export function SolidColorSpaceStatsOverlay({
  gamutRendering,
  mesh,
  sliceMesh,
}: SolidColorSpaceStatsOverlayProps) {
  const gamutRenderLabel = getColorGamutRenderLabel(gamutRendering)

  return (
    <div className="pointer-events-none absolute top-3 left-3 hidden max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 lg:flex">
      <span className="rounded-md border border-border bg-background-primary/85 px-2 py-1 font-mono text-[0.65rem] text-text-normal shadow-sm backdrop-blur">
        {mesh.vertexCount.toLocaleString()} vertices
      </span>
      <span className="rounded-md border border-border bg-background-primary/85 px-2 py-1 font-mono text-[0.65rem] text-text-normal shadow-sm backdrop-blur">
        {mesh.triangleCount.toLocaleString()} triangles
      </span>
      <span className="rounded-md border border-border bg-background-primary/85 px-2 py-1 font-mono text-[0.65rem] text-text-muted shadow-sm backdrop-blur">
        {gamutRenderLabel}
      </span>
      {sliceMesh && (
        <span className="rounded-md border border-border bg-background-primary/85 px-2 py-1 font-mono text-[0.65rem] text-text-muted shadow-sm backdrop-blur">
          {sliceMesh.shapeLabel}
        </span>
      )}
    </div>
  )
}
