import {
  BlendIcon,
  Code2Icon,
  CrosshairIcon,
  CylinderIcon,
  PaletteIcon,
  PanelTopIcon,
  ScissorsIcon,
  UsbIcon,
} from "lucide-react"

import {
  PlaygroundIndexPage,
  PlaygroundRouteColumn,
  PlaygroundRouteFeature,
  PlaygroundRouteGroup,
} from "@/playground/PlaygroundRoute"

export function PlaygroundHomePage() {
  return (
    <PlaygroundIndexPage
      title="Web Color Introduction"
      description="색 공간, 좌표계, 대비, 보간을 직접 보면서 이해하는 playground입니다."
    >
      <PlaygroundRouteColumn>
        <PlaygroundRouteGroup name="Color Models" icon={PaletteIcon}>
          <PlaygroundRouteFeature
            icon={CylinderIcon}
            label="3D Solid Models"
            path="/color-space-solid-models"
          />
          <PlaygroundRouteFeature
            icon={CrosshairIcon}
            label="2D Coordinate Planes"
            path="/color-coordinate-planes"
          />
          <PlaygroundRouteFeature
            icon={PanelTopIcon}
            label="Unwrapped Color Spaces"
            path="/color-space-unwrapped"
          />
          <PlaygroundRouteFeature
            icon={BlendIcon}
            label="Color Interpolation"
            path="/color-interpolation"
          />
          <PlaygroundRouteFeature
            icon={Code2Icon}
            label="CSS Color Notations"
            path="/css-color-notations"
          />
          <PlaygroundRouteFeature
            icon={BlendIcon}
            label="sRGB / P3 Compare"
            path="/srgb-p3-compare"
          />
          <PlaygroundRouteFeature
            icon={Code2Icon}
            label="RGB Channel Codes"
            path="/rgb-channel-gamut-codes"
          />
          <PlaygroundRouteFeature
            icon={ScissorsIcon}
            label="Gamut Clipping"
            path="/color-gamut-clipping"
          />
          <PlaygroundRouteFeature
            icon={UsbIcon}
            label="Arduino RGB"
            path="/arduino-rgb"
          />
        </PlaygroundRouteGroup>
      </PlaygroundRouteColumn>
    </PlaygroundIndexPage>
  )
}
