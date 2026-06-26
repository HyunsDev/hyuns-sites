import { Badge } from "@hyunsdev/ui/components/badge";
import { Button } from "@hyunsdev/ui/components/button";
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
  if (!image) {
    return (
      <div className="grid h-full min-h-52 place-items-center rounded-md border border-dashed border-border bg-muted/20 p-6 text-center">
        <div className="grid gap-1">
          <p className="text-sm font-medium">No source selected</p>
          <p className="text-xs text-muted-foreground">Choose an icon or upload a file.</p>
        </div>
      </div>
    );
  }

  const maxWidth = mode === "icon" ? "min(58%, 280px)" : "min(88%, 720px)";

  return (
    <div className="image-maker-checkerboard grid h-full min-h-52 place-items-center overflow-hidden rounded-md border border-border p-5">
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
    <section className="flex min-h-[380px] flex-col gap-3 p-4 md:h-full md:min-h-0">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="text-sm font-semibold leading-5">{titleForMode(mode)}</h2>
          <p className="font-mono text-xs text-muted-foreground">
            {image ? `${image.width} x ${image.height}` : "No output"}
          </p>
        </div>
        <Badge variant="normal">{mode.toUpperCase()}</Badge>
      </div>
      <div className="min-h-0 flex-1">
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
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid min-h-0 flex-1 divide-y divide-border md:grid-rows-2">
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
