import { Button } from "@hyunsdev/ui/components/button";
import { CopyIcon, DownloadIcon } from "lucide-react";
import { svgToDataUrl } from "./renderers";
import type { ExportStatus, RenderMode, RenderedImage } from "./types";

type PreviewPanelsProps = {
  readonly bannerImage: RenderedImage | null;
  readonly iconImage: RenderedImage | null;
  readonly sourceTitle: string;
  readonly status: ExportStatus;
  readonly onCopyPng: (image: RenderedImage) => void;
  readonly onCopySvg: (image: RenderedImage) => void;
  readonly onDownloadPng: (image: RenderedImage) => void;
  readonly onDownloadSvg: (image: RenderedImage) => void;
};

type PreviewPaneProps = {
  readonly image: RenderedImage | null;
  readonly mode: RenderMode;
  readonly sourceTitle: string;
  readonly onCopyPng: (image: RenderedImage) => void;
  readonly onCopySvg: (image: RenderedImage) => void;
  readonly onDownloadPng: (image: RenderedImage) => void;
  readonly onDownloadSvg: (image: RenderedImage) => void;
};

function titleForMode(mode: RenderMode) {
  return mode === "icon" ? "아이콘 미리보기" : "배너 미리보기";
}

function PreviewStage({
  image,
  mode,
  sourceTitle
}: {
  readonly image: RenderedImage | null;
  readonly mode: RenderMode;
  readonly sourceTitle: string;
}) {
  const stageHeight = mode === "icon" ? "h-[200px]" : "h-[300px]";

  if (!image) {
    return (
      <div
        className={`grid ${stageHeight} w-full min-w-0 place-items-center rounded-md border border-dashed border-border bg-muted/20 p-6 text-center`}
      >
        <p className="text-sm font-medium">No source selected</p>
      </div>
    );
  }

  const maxWidth = mode === "icon" ? "min(42%, 200px)" : "min(88%, 720px)";

  return (
    <div
      className={`image-maker-checkerboard grid ${stageHeight} w-full min-w-0 place-items-center overflow-hidden rounded-md border border-border p-5`}
    >
      <img
        src={svgToDataUrl(image.svg)}
        alt={`${sourceTitle} ${titleForMode(mode)}`}
        className="block max-h-full rounded-sm object-contain"
        style={{
          aspectRatio: `${image.width} / ${image.height}`,
          width: maxWidth
        }}
      />
    </div>
  );
}

function PreviewPane({
  image,
  mode,
  sourceTitle,
  onCopyPng,
  onCopySvg,
  onDownloadPng,
  onDownloadSvg
}: PreviewPaneProps) {
  const disabled = image === null;

  return (
    <section className="flex w-full min-w-0 flex-col gap-3 p-3">
      <div className="w-full min-w-0">
        <PreviewStage image={image} mode={mode} sourceTitle={sourceTitle} />
      </div>
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
  );
}

function StatusLine({ status }: { readonly status: ExportStatus }) {
  if (status.kind === "idle") {
    return null;
  }

  const className =
    status.kind === "success" ? "text-[var(--status-success)]" : "text-destructive";

  return <p className={`px-4 pb-3 text-xs ${className}`}>{status.message}</p>;
}

export function PreviewPanels({
  bannerImage,
  iconImage,
  sourceTitle,
  status,
  onCopyPng,
  onCopySvg,
  onDownloadPng,
  onDownloadSvg
}: PreviewPanelsProps) {
  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col">
      <div className="grid min-h-0 w-full min-w-0 flex-1 divide-y divide-border md:grid-rows-2">
        <PreviewPane
          image={iconImage}
          mode="icon"
          sourceTitle={sourceTitle}
          onCopyPng={onCopyPng}
          onCopySvg={onCopySvg}
          onDownloadPng={onDownloadPng}
          onDownloadSvg={onDownloadSvg}
        />
        <PreviewPane
          image={bannerImage}
          mode="banner"
          sourceTitle={sourceTitle}
          onCopyPng={onCopyPng}
          onCopySvg={onCopySvg}
          onDownloadPng={onDownloadPng}
          onDownloadSvg={onDownloadSvg}
        />
      </div>
      <StatusLine status={status} />
    </div>
  );
}
