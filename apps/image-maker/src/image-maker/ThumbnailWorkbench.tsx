import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@hyunsdev/ui/components/button";
import {
  ResizablePanel,
  ResizablePanelGroup
} from "@hyunsdev/ui/components/resizable";
import { RotateCcwIcon } from "lucide-react";
import {
  Panel,
  PanelBody,
  PanelHeader,
  PanelHeaderLeading,
  PanelHeaderTrailing
} from "@hyunsdev/ui/layouts/panel";
import {
  Workbench,
  WorkbenchContentArea,
  WorkbenchContextAreaRail,
  WorkbenchProvider
} from "@hyunsdev/ui/layouts/workbench";
import { copyPngToClipboard, copySvgToClipboard, downloadPng, downloadSvg } from "./exporters";
import { errorMessageFromUnknown } from "./file-readers";
import { ImageMakerSidebar } from "./ImageMakerSidebar";
import { DEFAULT_THUMBNAIL_OPTIONS } from "./presets";
import { ThumbnailOptionsPanel } from "./ThumbnailOptionsPanel";
import { suggestThumbnailBackgroundColor } from "./thumbnail-background";
import { ThumbnailPreviewPanel } from "./ThumbnailPreviewPanel";
import { imageFilesFromList, readThumbnailImageFiles } from "./thumbnail-files";
import { renderThumbnailSvg } from "./thumbnail-renderer";
import type { ThumbnailColorProfile } from "./thumbnail-background";
import type { ThumbnailOptions, ThumbnailSourceImage } from "./thumbnail-types";
import type { ExportStatus, RenderedImage } from "./types";

type WorkbenchOrientation = "horizontal" | "vertical";

const OPTION_PANEL_DEFAULT_SIZE = "380px";
const WORKBENCH_PANEL_MIN_SIZE = "220px";
const WORKBENCH_RESIZE_TARGET_MINIMUM_SIZE = {
  coarse: 36,
  fine: 12
} as const;

function useResponsiveWorkbenchOrientation(): WorkbenchOrientation {
  const [orientation, setOrientation] = useState<WorkbenchOrientation>("horizontal");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const syncOrientation = () => {
      setOrientation(media.matches ? "vertical" : "horizontal");
    };

    syncOrientation();
    media.addEventListener("change", syncOrientation);

    return () => {
      media.removeEventListener("change", syncOrientation);
    };
  }, []);

  return orientation;
}

function getFilename(image: RenderedImage, extension: string) {
  return `image-maker-${image.mode}.${extension}`;
}

function previewTitle(images: readonly ThumbnailSourceImage[]) {
  if (images.length === 0) {
    return "Thumbnail";
  }

  if (images.length === 1) {
    return images[0]?.title ?? "Thumbnail";
  }

  return `${images.length} images`;
}

function thumbnailImagesForAutoBackground(
  images: readonly ThumbnailSourceImage[],
  options: ThumbnailOptions
) {
  if (options.mode === "mobile") {
    return images;
  }

  const firstImage = images.at(0);

  return firstImage ? [firstImage] : [];
}

function autoBackgroundColorFromImages(
  images: readonly ThumbnailSourceImage[],
  options: ThumbnailOptions
) {
  const colorProfiles: ThumbnailColorProfile[] = [];
  const targetImages = thumbnailImagesForAutoBackground(images, options);

  for (const image of targetImages) {
    if (image.colorProfile !== null) {
      colorProfiles.push(image.colorProfile);
    }
  }

  const profileBackgroundColor = suggestThumbnailBackgroundColor(colorProfiles);

  if (profileBackgroundColor !== null) {
    return profileBackgroundColor;
  }

  for (const image of targetImages) {
    if (image.suggestedBackgroundColor !== null) {
      return image.suggestedBackgroundColor;
    }
  }

  return null;
}

export function ThumbnailWorkbench() {
  const [options, setOptions] = useState<ThumbnailOptions>(DEFAULT_THUMBNAIL_OPTIONS);
  const [images, setImages] = useState<readonly ThumbnailSourceImage[]>([]);
  const [status, setStatus] = useState<ExportStatus>({ kind: "idle" });
  const workbenchOrientation = useResponsiveWorkbenchOrientation();

  const renderedImage = useMemo(() => renderThumbnailSvg(images, options), [images, options]);
  const autoBackgroundColor = useMemo(
    () => autoBackgroundColorFromImages(images, options),
    [images, options]
  );
  const title = previewTitle(images);
  const panelOverflow = workbenchOrientation === "horizontal" ? "visible" : "hidden";

  const addImageFiles = useCallback(
    (files: readonly File[]) => {
      void readThumbnailImageFiles(files)
        .then((nextImages) => {
          setImages((currentImages) =>
            options.mode === "mobile" ? [...currentImages, ...nextImages] : nextImages.slice(0, 1)
          );
          setStatus({ kind: "idle" });
        })
        .catch((error: unknown) => setStatus({ kind: "error", message: errorMessageFromUnknown(error) }));
    },
    [options.mode]
  );

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedFiles = imageFilesFromList(event.clipboardData?.files ?? null);

      if (pastedFiles.length === 0) {
        return;
      }

      event.preventDefault();
      addImageFiles(pastedFiles);
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [addImageFiles]);

  async function runExport(action: () => Promise<void> | void, message: string) {
    try {
      await action();
      setStatus({ kind: "success", message });
    } catch (error) {
      setStatus({ kind: "error", message: errorMessageFromUnknown(error) });
    }
  }

  function resetOptions() {
    setOptions(DEFAULT_THUMBNAIL_OPTIONS);
  }

  function applyAutoBackground() {
    if (autoBackgroundColor === null) {
      return;
    }

    setOptions((currentOptions) => ({
      ...currentOptions,
      backgroundColor: autoBackgroundColor
    }));
    setStatus({ kind: "success", message: "Auto background applied." });
  }

  return (
    <WorkbenchProvider>
      <Workbench>
        <ImageMakerSidebar activeKind="thumbnail" />
        <WorkbenchContentArea orientation={workbenchOrientation}>
          <ResizablePanelGroup
            orientation={workbenchOrientation}
            resizeTargetMinimumSize={WORKBENCH_RESIZE_TARGET_MINIMUM_SIZE}
            className="relative z-[calc(var(--layer-sidebar)+1)] min-h-0 min-w-0 flex-1 aria-[orientation=vertical]:flex-col"
            style={{ overflow: panelOverflow }}
          >
            <ResizablePanel
              defaultSize={workbenchOrientation === "horizontal" ? OPTION_PANEL_DEFAULT_SIZE : "50%"}
              groupResizeBehavior={
                workbenchOrientation === "horizontal" ? "preserve-pixel-size" : undefined
              }
              minSize={WORKBENCH_PANEL_MIN_SIZE}
              className="relative min-h-0 min-w-0"
              style={{ overflow: panelOverflow }}
            >
              <Panel>
                <PanelHeader>
                  <PanelHeaderLeading>
                    <div className="grid gap-1">
                      <h1 className="text-base font-semibold leading-6">Thumbnail</h1>
                    </div>
                  </PanelHeaderLeading>
                </PanelHeader>
                <PanelBody className="min-h-0 overflow-auto p-0">
                  <ThumbnailOptionsPanel
                    autoBackgroundColor={autoBackgroundColor}
                    images={images}
                    options={options}
                    onAutoBackground={applyAutoBackground}
                    onClearImages={() => setImages([])}
                    onFilesAdded={addImageFiles}
                    onOptionsChange={setOptions}
                  />
                </PanelBody>
              </Panel>
            </ResizablePanel>
            <WorkbenchContextAreaRail />
            <ResizablePanel
              minSize={WORKBENCH_PANEL_MIN_SIZE}
              className="relative min-h-0 min-w-0"
              style={{ overflow: panelOverflow }}
            >
              <Panel className="min-w-0">
                <PanelHeader>
                  <PanelHeaderLeading>
                    <span className="truncate text-sm font-medium">{title}</span>
                  </PanelHeaderLeading>
                  <PanelHeaderTrailing>
                    <Button type="button" size="sm" variant="outline" onClick={resetOptions}>
                      <RotateCcwIcon aria-hidden="true" className="size-3.5" />
                      Reset
                    </Button>
                  </PanelHeaderTrailing>
                </PanelHeader>
                <PanelBody className="min-h-0 overflow-auto p-0">
                  <ThumbnailPreviewPanel
                    image={renderedImage}
                    status={status}
                    title={title}
                    onCopySvg={(image) =>
                      void runExport(() => copySvgToClipboard(image), "SVG copied.")
                    }
                    onCopyPng={(image) =>
                      void runExport(() => copyPngToClipboard(image), "PNG copied.")
                    }
                    onDownloadSvg={(image) =>
                      void runExport(
                        () => downloadSvg(image, getFilename(image, "svg")),
                        "SVG downloaded."
                      )
                    }
                    onDownloadPng={(image) =>
                      void runExport(
                        () => downloadPng(image, getFilename(image, "png")),
                        "PNG downloaded."
                      )
                    }
                  />
                </PanelBody>
              </Panel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </WorkbenchContentArea>
      </Workbench>
    </WorkbenchProvider>
  );
}
