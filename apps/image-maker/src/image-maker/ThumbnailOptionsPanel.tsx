import {
  ThumbnailCanvasControls,
  ThumbnailImageShapeControls,
  ThumbnailPaddingControls,
  ThumbnailShadowControls
} from "./ThumbnailLayoutControls";
import {
  DesktopAlignmentControls,
  ThumbnailModeControls
} from "./ThumbnailModeControls";
import { FieldGroup } from "./OptionFields";
import { ThumbnailSourceControls } from "./ThumbnailSourceControls";
import type {
  ThumbnailOptions,
  ThumbnailSourceImage
} from "./thumbnail-types";

type ThumbnailOptionsPanelProps = {
  readonly autoBackgroundColor: string | null;
  readonly images: readonly ThumbnailSourceImage[];
  readonly options: ThumbnailOptions;
  readonly onAutoBackground: () => void;
  readonly onClearImages: () => void;
  readonly onFilesAdded: (files: readonly File[]) => void;
  readonly onOptionsChange: (options: ThumbnailOptions) => void;
};

export function ThumbnailOptionsPanel({
  autoBackgroundColor,
  images,
  options,
  onAutoBackground,
  onClearImages,
  onFilesAdded,
  onOptionsChange
}: ThumbnailOptionsPanelProps) {
  return (
    <div className="grid h-full w-full min-w-0 content-start gap-2.5 overflow-hidden p-2.5">
      <FieldGroup title="Source">
        <ThumbnailSourceControls
          images={images}
          mode={options.mode}
          onClearImages={onClearImages}
          onFilesAdded={onFilesAdded}
        />
      </FieldGroup>

      <FieldGroup title="Mode">
        <ThumbnailModeControls options={options} onOptionsChange={onOptionsChange} />
      </FieldGroup>

      <FieldGroup title="Canvas">
        <ThumbnailCanvasControls
          autoBackgroundColor={autoBackgroundColor}
          options={options}
          onAutoBackground={onAutoBackground}
          onOptionsChange={onOptionsChange}
        />
      </FieldGroup>

      {options.mode === "desktop" ? (
        <FieldGroup title="Desktop alignment">
          <DesktopAlignmentControls options={options} onOptionsChange={onOptionsChange} />
        </FieldGroup>
      ) : null}

      <FieldGroup title="Padding">
        <ThumbnailPaddingControls options={options} onOptionsChange={onOptionsChange} />
      </FieldGroup>

      {options.mode !== "image" ? (
        <FieldGroup title="Image shape">
          <ThumbnailImageShapeControls options={options} onOptionsChange={onOptionsChange} />
        </FieldGroup>
      ) : null}

      {options.mode !== "image" ? (
        <FieldGroup title="Shadow">
          <ThumbnailShadowControls options={options} onOptionsChange={onOptionsChange} />
        </FieldGroup>
      ) : null}
    </div>
  );
}
