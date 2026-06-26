import type { SourceKind } from "./types";

export type SourceConfig = {
  readonly kind: SourceKind;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly path: "/png" | "/svg";
};

export const SOURCE_CONFIGS: readonly SourceConfig[] = [
  {
    kind: "svg",
    label: "Svg 아이콘/배너",
    title: "SVG",
    description: "Paste or upload SVG source",
    path: "/svg"
  },
  {
    kind: "png",
    label: "PNG 아이콘/배너",
    title: "PNG",
    description: "Upload custom PNG source",
    path: "/png"
  }
] as const;

export const REPOSITORY_LINK = {
  href: "https://github.com/HyunsDev/hyuns-sites",
  label: "Developed By HyunsDev"
} as const;

export function getSourceConfig(kind: SourceKind) {
  const config = SOURCE_CONFIGS.find((sourceConfig) => sourceConfig.kind === kind);

  if (config) {
    return config;
  }

  throw new Error(`Unknown source kind: ${kind}`);
}
