import { useEffect, useMemo, useState } from "react";
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
import { svgGraphicFromText } from "./graphic-assets";
import { ImageMakerSidebar } from "./ImageMakerSidebar";
import { OptionsPanel, SAMPLE_SVG } from "./OptionsPanel";
import {
  DEFAULT_IMAGE_OPTIONS,
  readUserColorPresets,
  writeUserColorPresets
} from "./presets";
import { PreviewPanels } from "./PreviewPanels";
import { errorMessageFromUnknown } from "./file-readers";
import { getSourceConfig } from "./source-config";
import { renderImageSvg } from "./renderers";
import type {
  ColorPreset,
  ExportStatus,
  GraphicAsset,
  ImageMakerOptions,
  SourceKind
} from "./types";
import { assertNever } from "./types";

type ImageMakerWorkbenchProps = {
  readonly sourceKind: SourceKind;
};

type WorkbenchOrientation = "horizontal" | "vertical";

const OPTION_PANEL_DEFAULT_SIZE = "380px";
const WORKBENCH_PANEL_MIN_SIZE = "220px";
const WORKBENCH_RESIZE_TARGET_MINIMUM_SIZE = {
  coarse: 36,
  fine: 12
} as const;

function getFilename(sourceKind: SourceKind, mode: string, extension: string) {
  return `image-maker-${sourceKind}-${mode}.${extension}`;
}

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

export function ImageMakerWorkbench({ sourceKind }: ImageMakerWorkbenchProps) {
  const [options, setOptions] = useState<ImageMakerOptions>(DEFAULT_IMAGE_OPTIONS);
  const [userPresets, setUserPresets] = useState<readonly ColorPreset[]>(() =>
    readUserColorPresets()
  );
  const [svgText, setSvgText] = useState(SAMPLE_SVG);
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [pngFileName, setPngFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<ExportStatus>({ kind: "idle" });
  const workbenchOrientation = useResponsiveWorkbenchOrientation();
  const sourceConfig = getSourceConfig(sourceKind);

  const activeGraphic = useMemo<GraphicAsset | null>(() => {
    switch (sourceKind) {
      case "png":
        return pngDataUrl
          ? { kind: "png", title: pngFileName ?? "Custom PNG", dataUrl: pngDataUrl }
          : null;
      case "svg":
        return svgGraphicFromText(svgText);
      default:
        return assertNever(sourceKind);
    }
  }, [pngDataUrl, pngFileName, sourceKind, svgText]);

  const iconImage = activeGraphic ? renderImageSvg(activeGraphic, options, "icon") : null;
  const bannerImage = activeGraphic ? renderImageSvg(activeGraphic, options, "banner") : null;
  const sourceTitle = activeGraphic?.title ?? sourceConfig.title;

  async function runExport(
    action: () => Promise<void> | void,
    message: string
  ) {
    try {
      await action();
      setStatus({ kind: "success", message });
    } catch (error) {
      setStatus({ kind: "error", message: errorMessageFromUnknown(error) });
    }
  }

  function resetOptions() {
    setOptions(DEFAULT_IMAGE_OPTIONS);
  }

  return (
    <WorkbenchProvider>
      <Workbench>
        <ImageMakerSidebar activeKind={sourceKind} />
        <WorkbenchContentArea orientation={workbenchOrientation}>
          <ResizablePanelGroup
            orientation={workbenchOrientation}
            resizeTargetMinimumSize={WORKBENCH_RESIZE_TARGET_MINIMUM_SIZE}
            className="relative z-[calc(var(--layer-sidebar)+1)] min-h-0 min-w-0 flex-1 aria-[orientation=vertical]:flex-col"
            style={{ overflow: "visible" }}
          >
            <ResizablePanel
              defaultSize={workbenchOrientation === "horizontal" ? OPTION_PANEL_DEFAULT_SIZE : "50%"}
              groupResizeBehavior={
                workbenchOrientation === "horizontal" ? "preserve-pixel-size" : undefined
              }
              minSize={WORKBENCH_PANEL_MIN_SIZE}
              className="relative min-h-0 min-w-0"
              style={{ overflow: "visible" }}
            >
              <Panel>
                <PanelHeader>
                  <PanelHeaderLeading>
                    <div className="grid gap-1">
                      <h1 className="text-base font-semibold leading-6">{sourceConfig.label}</h1>
                    </div>
                  </PanelHeaderLeading>
                </PanelHeader>
                <PanelBody className="p-0">
                  <OptionsPanel
                    options={options}
                    pngFileName={pngFileName}
                    sourceKind={sourceKind}
                    svgText={svgText}
                    userPresets={userPresets}
                    onFileError={(message) => setStatus({ kind: "error", message })}
                    onOptionsChange={setOptions}
                    onPngDataUrlChange={(dataUrl, fileName) => {
                      setPngDataUrl(dataUrl);
                      setPngFileName(fileName);
                    }}
                    onSvgTextChange={setSvgText}
                    onUserPresetsChange={(presets) => {
                      writeUserColorPresets(presets);
                      setUserPresets(presets);
                    }}
                  />
                </PanelBody>
              </Panel>
            </ResizablePanel>
            <WorkbenchContextAreaRail />
            <ResizablePanel
              minSize={WORKBENCH_PANEL_MIN_SIZE}
              className="relative min-h-0 min-w-0"
              style={{ overflow: "visible" }}
            >
              <Panel className="min-w-0">
                <PanelHeader>
                  <PanelHeaderLeading>
                    <span className="truncate text-sm font-medium">{sourceTitle}</span>
                  </PanelHeaderLeading>
                  <PanelHeaderTrailing>
                    <Button type="button" size="sm" variant="outline" onClick={resetOptions}>
                      <RotateCcwIcon aria-hidden="true" className="size-3.5" />
                      Reset
                    </Button>
                  </PanelHeaderTrailing>
                </PanelHeader>
                <PanelBody className="p-0">
                  <PreviewPanels
                    bannerImage={bannerImage}
                    iconImage={iconImage}
                    sourceTitle={sourceTitle}
                    status={status}
                    onCopySvg={(image) =>
                      void runExport(() => copySvgToClipboard(image), "SVG copied.")
                    }
                    onCopyPng={(image) =>
                      void runExport(() => copyPngToClipboard(image), "PNG copied.")
                    }
                    onDownloadSvg={(image) =>
                      void runExport(
                        () => downloadSvg(image, getFilename(sourceKind, image.mode, "svg")),
                        "SVG downloaded."
                      )
                    }
                    onDownloadPng={(image) =>
                      void runExport(
                        () => downloadPng(image, getFilename(sourceKind, image.mode, "png")),
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
