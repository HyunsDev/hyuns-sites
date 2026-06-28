import { useState } from "react";
import { Button } from "@hyunsdev/ui/components/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadInput,
  FileUploadList,
  type FileUploadItem
} from "@hyunsdev/ui/components/file-upload";
import { Input } from "@hyunsdev/ui/components/input";
import { Trash2Icon } from "lucide-react";
import { imageFilesFromList } from "./thumbnail-files";
import type { ThumbnailMode, ThumbnailSourceImage } from "./thumbnail-types";

type ThumbnailSourceControlsProps = {
  readonly images: readonly ThumbnailSourceImage[];
  readonly mode: ThumbnailMode;
  readonly onClearImages: () => void;
  readonly onFilesAdded: (files: readonly File[]) => void;
};

function sourceSummary(images: readonly ThumbnailSourceImage[], mode: ThumbnailMode) {
  if (images.length === 0) {
    return "No image selected";
  }

  if (mode === "mobile") {
    return `${images.length} image${images.length === 1 ? "" : "s"} selected`;
  }

  return images[0]?.title ?? "Image selected";
}

export function ThumbnailSourceControls({
  images,
  mode,
  onClearImages,
  onFilesAdded
}: ThumbnailSourceControlsProps) {
  const [uploadItems, setUploadItems] = useState<FileUploadItem[]>([]);
  const maxFiles = mode === "mobile" ? 12 : 1;

  return (
    <div className="grid gap-2">
      <FileUpload
        accept="image/*"
        value={uploadItems}
        maxFiles={maxFiles}
        onValueChange={setUploadItems}
      >
        <FileUploadInput
          aria-label="Thumbnail image files"
          multiple={mode === "mobile"}
          onChange={(event) => {
            const files = imageFilesFromList(event.currentTarget.files);

            if (files.length > 0) {
              onFilesAdded(files);
            }
          }}
        />
        <FileUploadDropzone
          className="min-h-16 p-2"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const files = imageFilesFromList(event.dataTransfer.files);

            if (files.length > 0) {
              onFilesAdded(files);
            }
          }}
        >
          <div className="grid text-center">
            <span className="text-sm font-medium">Thumbnail images</span>
          </div>
        </FileUploadDropzone>
        <FileUploadList />
      </FileUpload>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <Input id="thumbnail-source-summary" value={sourceSummary(images, mode)} readOnly />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={images.length === 0}
          onClick={() => {
            setUploadItems([]);
            onClearImages();
          }}
        >
          <Trash2Icon aria-hidden="true" className="size-3.5" />
          Clear
        </Button>
      </div>
    </div>
  );
}
