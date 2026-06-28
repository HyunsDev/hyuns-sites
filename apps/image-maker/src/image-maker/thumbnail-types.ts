import type { ThumbnailColorProfile } from "./thumbnail-background";

export const THUMBNAIL_MODES = ["desktop", "mobile", "image"] as const;

export type ThumbnailMode = (typeof THUMBNAIL_MODES)[number];

export const DESKTOP_THUMBNAIL_ALIGNMENTS = ["bottom", "center"] as const;

export type DesktopThumbnailAlignment = (typeof DESKTOP_THUMBNAIL_ALIGNMENTS)[number];

export type ThumbnailSourceImage = {
  readonly colorProfile: ThumbnailColorProfile | null;
  readonly dataUrl: string;
  readonly height: number;
  readonly id: string;
  readonly suggestedBackgroundColor: string | null;
  readonly title: string;
  readonly width: number;
};

export type ThumbnailShadowOptions = {
  readonly blur: number;
  readonly color: string;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly opacity: number;
  readonly spread: number;
};

export type ThumbnailOptions = {
  readonly backgroundColor: string;
  readonly canvasHeight: number;
  readonly canvasWidth: number;
  readonly desktopAlignment: DesktopThumbnailAlignment;
  readonly horizontalPadding: number;
  readonly imageBorderRadius: number;
  readonly mobileGap: number;
  readonly mode: ThumbnailMode;
  readonly shadow: ThumbnailShadowOptions;
  readonly verticalPadding: number;
};
