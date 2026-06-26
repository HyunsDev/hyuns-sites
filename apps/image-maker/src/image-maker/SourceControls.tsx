import { useState } from "react";
import { Button } from "@hyunsdev/ui/components/button";
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
import { errorMessageFromUnknown, readFileAsDataUrl, readFileAsText } from "./file-readers";
import type { SourceKind } from "./types";

type SourceControlsProps = {
  readonly pngFileName: string | null;
  readonly sourceKind: SourceKind;
  readonly svgText: string;
  readonly onFileError: (message: string) => void;
  readonly onPngDataUrlChange: (dataUrl: string, fileName: string) => void;
  readonly onSvgTextChange: (value: string) => void;
};

function FileDropzoneLabel({ label }: { readonly label: string }) {
  return (
    <div className="grid text-center">
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function SourceControls({
  pngFileName,
  sourceKind,
  svgText,
  onFileError,
  onPngDataUrlChange,
  onSvgTextChange
}: SourceControlsProps) {
  const [svgFiles, setSvgFiles] = useState<FileUploadItem[]>([]);
  const [pngFiles, setPngFiles] = useState<FileUploadItem[]>([]);

  switch (sourceKind) {
    case "svg":
      return (
        <div className="grid gap-2">
          <div className="grid gap-1.5">
            <Label htmlFor="svg-source">SVG source</Label>
            <Textarea
              id="svg-source"
              value={svgText}
              onChange={(event) => onSvgTextChange(event.currentTarget.value)}
              className="min-h-14 font-mono text-xs"
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
            <FileUploadDropzone className="min-h-12 p-2">
              <FileDropzoneLabel label="SVG file" />
            </FileUploadDropzone>
            <FileUploadList />
          </FileUpload>
        </div>
      );
    case "png":
      return (
        <div className="grid gap-2">
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
            <FileUploadDropzone className="min-h-16 p-2">
              <FileDropzoneLabel label="PNG file" />
            </FileUploadDropzone>
            <FileUploadList />
          </FileUpload>
          <Input
            id="png-file-name"
            aria-label="Selected PNG file"
            value={pngFileName ?? "No PNG selected"}
            readOnly
          />
        </div>
      );
    default:
      return null;
  }
}

export function ResetSvgButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      Reset SVG
    </Button>
  );
}
