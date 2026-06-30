import type {
  BaseColorSpaceModelId,
  ColorSpaceModelId,
  HueCubeBaseModelId,
  HueCubeModelId,
} from "@/color-models/color-space-models"

export type SolidHueCubeBaseModelId = Extract<
  HueCubeBaseModelId,
  "hsl" | "hsv" | "lch" | "oklch"
>

const CUBE_MODEL_BY_BASE_ID = {
  hsl: "hsl-cube",
  hsv: "hsv-cube",
  lch: "lch-cube",
  oklch: "oklch-cube",
} as const satisfies Record<SolidHueCubeBaseModelId, HueCubeModelId>

export function isSolidHueCubeBaseModelId(
  modelId: BaseColorSpaceModelId
): modelId is SolidHueCubeBaseModelId {
  return (
    modelId === "hsl" ||
    modelId === "hsv" ||
    modelId === "lch" ||
    modelId === "oklch"
  )
}

export function getSolidHueCubeModelId(
  modelId: BaseColorSpaceModelId
): HueCubeModelId | null {
  return isSolidHueCubeBaseModelId(modelId)
    ? CUBE_MODEL_BY_BASE_ID[modelId]
    : null
}

export function resolveSolidHueCubeModelId(
  modelId: BaseColorSpaceModelId,
  cubeEnabled: boolean
): ColorSpaceModelId {
  const cubeModelId = getSolidHueCubeModelId(modelId)

  return cubeEnabled && cubeModelId ? cubeModelId : modelId
}
