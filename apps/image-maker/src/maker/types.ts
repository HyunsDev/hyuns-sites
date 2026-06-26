import type { ComponentType, SVGProps } from "react";

export type SourceKind = "lucide" | "brand" | "svg" | "png";
export type AssetKind = "icon" | "banner";
export type ColorSpace = "srgb" | "display-p3";

export type MakerMode = {
  source: SourceKind;
  asset: AssetKind;
};

export type MakerOptions = {
  width: number;
  height: number;
  backgroundColor: string;
  iconColor: string;
  paddingPercent: number;
  radiusPercent: number;
  colorSpace: ColorSpace;
};

export type LucideIconEntry = {
  id: string;
  title: string;
  moduleKey: string;
};

export type BrandIconEntry = {
  title: string;
  slug: string;
  hex: string;
  aliases: string[];
};

export type VectorSource =
  | {
      kind: "lucide";
      title: string;
      Icon: ComponentType<SVGProps<SVGSVGElement>>;
    }
  | {
      kind: "brand";
      title: string;
      slug: string;
      hex: string;
      svg: string;
    }
  | {
      kind: "svg";
      title: string;
      svg: string;
    };

export type PngSource = {
  kind: "png";
  title: string;
  dataUrl: string;
};

export type CopyStatus = "idle" | "copied" | "downloaded" | "error";
