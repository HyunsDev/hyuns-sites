export const SOURCE_KINDS = ["svg", "png"] as const;

export type SourceKind = (typeof SOURCE_KINDS)[number];

export type RenderMode = "icon" | "banner";

export type ImageMakerOptions = {
  readonly iconSize: number;
  readonly bannerWidth: number;
  readonly bannerHeight: number;
  readonly bannerGraphicSize: number;
  readonly backgroundColor: string;
  readonly iconColor: string;
  readonly borderRadius: number;
  readonly curvature: number;
  readonly padding: number;
};

export type ColorPreset = {
  readonly id: string;
  readonly name: string;
  readonly backgroundColor: string;
  readonly iconColor: string;
};

export type SanitizedSvg = {
  readonly viewBox: string;
  readonly body: string;
};

export type GraphicAsset =
  | {
      readonly kind: "png";
      readonly title: string;
      readonly dataUrl: string;
    }
  | {
      readonly kind: "svg";
      readonly title: string;
      readonly svg: SanitizedSvg;
    };

export type RenderedImage = {
  readonly height: number;
  readonly mode: RenderMode;
  readonly svg: string;
  readonly width: number;
};

export type ExportStatus =
  | {
      readonly kind: "error";
      readonly message: string;
    }
  | {
      readonly kind: "idle";
    }
  | {
      readonly kind: "success";
      readonly message: string;
    };

export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${String(value)}`);
}
