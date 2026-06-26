import {
  BadgeIcon,
  ImageIcon,
  ShapesIcon,
  SparklesIcon,
  type LucideIcon
} from "lucide-react";
import type { SourceKind } from "./types";

export type SourceConfig = {
  readonly kind: SourceKind;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly path: "/brand" | "/lucide" | "/png" | "/svg";
  readonly Icon: LucideIcon;
};

export const SOURCE_CONFIGS: readonly SourceConfig[] = [
  {
    kind: "lucide",
    label: "Lucide 아이콘/배너",
    title: "Lucide",
    description: "Lucide stroke icons",
    path: "/lucide",
    Icon: SparklesIcon
  },
  {
    kind: "brand",
    label: "Brand 아이콘/배너",
    title: "Brand",
    description: "Simple Icons brand marks",
    path: "/brand",
    Icon: BadgeIcon
  },
  {
    kind: "svg",
    label: "Svg 아이콘/배너",
    title: "SVG",
    description: "Custom SVG source",
    path: "/svg",
    Icon: ShapesIcon
  },
  {
    kind: "png",
    label: "PNG 아이콘/배너",
    title: "PNG",
    description: "Custom PNG source",
    path: "/png",
    Icon: ImageIcon
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
