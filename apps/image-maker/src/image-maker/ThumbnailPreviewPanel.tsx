import { Button } from "@hyunsdev/ui/components/button";
import { CopyIcon, DownloadIcon } from "lucide-react";
import { svgToDataUrl } from "./renderers";
import type { ExportStatus, RenderedImage } from "./types";

type ThumbnailPreviewPanelProps = {
  readonly image: RenderedImage | null;
  readonly status: ExportStatus;
  readonly title: string;
  readonly onCopyPng: (image: RenderedImage) => void;
  readonly onCopySvg: (image: RenderedImage) => void;
  readonly onDownloadPng: (image: RenderedImage) => void;
  readonly onDownloadSvg: (image: RenderedImage) => void;
};

function StatusLine({ status }: { readonly status: ExportStatus }) {
  if (status.kind === "idle") {
    return null;
  }

  const className =
    status.kind === "success" ? "text-[var(--status-success)]" : "text-destructive";

  return <p className={`px-4 pb-3 text-xs ${className}`}>{status.message}</p>;
}

function PreviewStage({
  image,
  title
}: {
  readonly image: RenderedImage | null;
  readonly title: string;
}) {
  if (!image) {
    return (
      <div className="grid min-h-[420px] w-full min-w-0 place-items-center rounded-md border border-dashed border-border bg-muted/20 p-6 text-center">
        <p className="text-sm font-medium">No image selected</p>
      </div>
    );
  }

  return (
    <div className="image-maker-checkerboard grid min-h-[420px] w-full min-w-0 place-items-center overflow-hidden rounded-md border border-border p-5">
      <img
        src={svgToDataUrl(image.svg)}
        alt={`${title} thumbnail preview`}
        className="block h-auto w-auto max-w-full rounded-sm object-contain"
        style={{
          aspectRatio: `${image.width} / ${image.height}`,
          maxHeight: "min(64vh, 620px)",
          maxWidth: "min(100%, 960px)"
        }}
      />
    </div>
  );
}

export function ThumbnailPreviewPanel({
  image,
  status,
  title,
  onCopyPng,
  onCopySvg,
  onDownloadPng,
  onDownloadSvg
}: ThumbnailPreviewPanelProps) {
  const disabled = image === null;

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col">
      <section className="flex w-full min-w-0 flex-1 flex-col gap-3 p-3">
        <PreviewStage image={image} title={title} />
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => {
              if (image) {
                onCopySvg(image);
              }
            }}
          >
            <CopyIcon aria-hidden="true" className="size-3.5" />
            SVG 복사
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => {
              if (image) {
                onCopyPng(image);
              }
            }}
          >
            <CopyIcon aria-hidden="true" className="size-3.5" />
            PNG 복사
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => {
              if (image) {
                onDownloadSvg(image);
              }
            }}
          >
            <DownloadIcon aria-hidden="true" className="size-3.5" />
            SVG 다운로드
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => {
              if (image) {
                onDownloadPng(image);
              }
            }}
          >
            <DownloadIcon aria-hidden="true" className="size-3.5" />
            PNG 다운로드
          </Button>
        </div>
      </section>
      <StatusLine status={status} />
    </div>
  );
}
