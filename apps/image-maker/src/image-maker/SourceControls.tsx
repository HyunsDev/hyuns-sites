import { lazy, Suspense, useState } from "react";
import { Button } from "@hyunsdev/ui/components/button";
import { Combobox } from "@hyunsdev/ui/components/combobox";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadInput,
  FileUploadList,
  type FileUploadItem
} from "@hyunsdev/ui/components/file-upload";
import { Label } from "@hyunsdev/ui/components/label";
import { Textarea } from "@hyunsdev/ui/components/textarea";
import { Input } from "@hyunsdev/ui/components/input";
import { LUCIDE_ICON_OPTIONS } from "./icon-sources";
import { errorMessageFromUnknown, readFileAsDataUrl, readFileAsText } from "./file-readers";
import type { SourceKind } from "./types";

const LazyBrandSourceControl = lazy(() =>
  import("./BrandSourceControl").then((module) => ({
    default: module.BrandSourceControl
  }))
);

type SourceControlsProps = {
  readonly brandValue: string;
  readonly lucideValue: string;
  readonly pngFileName: string | null;
  readonly sourceKind: SourceKind;
  readonly svgText: string;
  readonly onBrandValueChange: (value: string) => void;
  readonly onFileError: (message: string) => void;
  readonly onLucideValueChange: (value: string) => void;
  readonly onPngDataUrlChange: (dataUrl: string, fileName: string) => void;
  readonly onSvgTextChange: (value: string) => void;
};

function FileDropzoneLabel({ label }: { readonly label: string }) {
  return (
    <div className="grid gap-1 text-center">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">Drop file or click</span>
    </div>
  );
}

export function SourceControls({
  brandValue,
  lucideValue,
  pngFileName,
  sourceKind,
  svgText,
  onBrandValueChange,
  onFileError,
  onLucideValueChange,
  onPngDataUrlChange,
  onSvgTextChange
}: SourceControlsProps) {
  const [svgFiles, setSvgFiles] = useState<FileUploadItem[]>([]);
  const [pngFiles, setPngFiles] = useState<FileUploadItem[]>([]);

  switch (sourceKind) {
    case "lucide":
      return (
        <div className="grid gap-2">
          <Label>Lucide icon</Label>
          <Combobox
            options={LUCIDE_ICON_OPTIONS}
            value={lucideValue}
            onValueChange={(value) => {
              if (value) {
                onLucideValueChange(value);
              }
            }}
            placeholder="Search Lucide"
            emptyMessage="No Lucide icon"
          />
        </div>
      );
    case "brand":
      return (
        <Suspense fallback={<BrandSourceFallback />}>
          <LazyBrandSourceControl value={brandValue} onValueChange={onBrandValueChange} />
        </Suspense>
      );
    case "svg":
      return (
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="svg-source">SVG source</Label>
            <Textarea
              id="svg-source"
              value={svgText}
              onChange={(event) => onSvgTextChange(event.currentTarget.value)}
              className="min-h-32 font-mono text-xs"
            />
          </div>
          <FileUpload
            accept="image/svg+xml,.svg"
            value={svgFiles}
            maxFiles={1}
            onValueChange={setSvgFiles}
            onFilesAdded={(files) => {
              const file = files.at(0);

              if (!file) {
                return;
              }

              void readFileAsText(file)
                .then(onSvgTextChange)
                .catch((error: unknown) => onFileError(errorMessageFromUnknown(error)));
            }}
          >
            <FileUploadInput aria-label="SVG file" />
            <FileUploadDropzone>
              <FileDropzoneLabel label="SVG file" />
            </FileUploadDropzone>
            <FileUploadList />
          </FileUpload>
        </div>
      );
    case "png":
      return (
        <div className="grid gap-3">
          <FileUpload
            accept="image/png,.png"
            value={pngFiles}
            maxFiles={1}
            onValueChange={setPngFiles}
            onFilesAdded={(files) => {
              const file = files.at(0);

              if (!file) {
                return;
              }

              void readFileAsDataUrl(file)
                .then((dataUrl) => onPngDataUrlChange(dataUrl, file.name))
                .catch((error: unknown) => onFileError(errorMessageFromUnknown(error)));
            }}
          >
            <FileUploadInput aria-label="PNG file" />
            <FileUploadDropzone>
              <FileDropzoneLabel label="PNG file" />
            </FileUploadDropzone>
            <FileUploadList />
          </FileUpload>
          <div className="grid gap-2">
            <Label htmlFor="png-file-name">Selected file</Label>
            <Input id="png-file-name" value={pngFileName ?? "No PNG selected"} readOnly />
          </div>
        </div>
      );
    default:
      return null;
  }
}

function BrandSourceFallback() {
  return (
    <div className="grid gap-2">
      <Label>Brand icon</Label>
      <Input value="Loading brands..." readOnly />
    </div>
  );
}

export function ResetSvgButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      Reset SVG
    </Button>
  );
}
