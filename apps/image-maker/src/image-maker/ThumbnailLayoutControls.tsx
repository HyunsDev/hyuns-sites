import { Button } from "@hyunsdev/ui/components/button";
import {
  ColorField,
  NumberRowField,
  SliderNumberField
} from "./OptionFields";
import type {
  ThumbnailOptions,
  ThumbnailShadowOptions
} from "./thumbnail-types";

type ThumbnailControlsProps = {
  readonly options: ThumbnailOptions;
  readonly onOptionsChange: (options: ThumbnailOptions) => void;
};

type ThumbnailCanvasControlsProps = ThumbnailControlsProps & {
  readonly autoBackgroundColor: string | null;
  readonly onAutoBackground: () => void;
};

function mergeOptions(options: ThumbnailOptions, patch: Partial<ThumbnailOptions>) {
  return {
    ...options,
    ...patch
  };
}

function mergeShadow(
  options: ThumbnailOptions,
  patch: Partial<ThumbnailShadowOptions>
): ThumbnailOptions {
  return {
    ...options,
    shadow: {
      ...options.shadow,
      ...patch
    }
  };
}

export function ThumbnailCanvasControls({
  autoBackgroundColor,
  options,
  onAutoBackground,
  onOptionsChange
}: ThumbnailCanvasControlsProps) {
  return (
    <>
      <NumberRowField
        label="Canvas size"
        fields={[
          {
            id: "thumbnail-canvas-width",
            ariaLabel: "Thumbnail width",
            min: 320,
            max: 7680,
            step: 16,
            value: options.canvasWidth,
            onValueChange: (canvasWidth) =>
              onOptionsChange(mergeOptions(options, { canvasWidth }))
          },
          {
            id: "thumbnail-canvas-height",
            ariaLabel: "Thumbnail height",
            min: 180,
            max: 4320,
            step: 16,
            value: options.canvasHeight,
            onValueChange: (canvasHeight) =>
              onOptionsChange(mergeOptions(options, { canvasHeight }))
          }
        ]}
      />
      <ColorField
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Auto background"
            disabled={autoBackgroundColor === null}
            onClick={onAutoBackground}
          >
            Auto
          </Button>
        }
        id="thumbnail-background-color"
        label="Background"
        value={options.backgroundColor}
        onValueChange={(backgroundColor) =>
          onOptionsChange(mergeOptions(options, { backgroundColor }))
        }
      />
    </>
  );
}

export function ThumbnailPaddingControls({
  options,
  onOptionsChange
}: ThumbnailControlsProps) {
  const usesVerticalPadding = options.mode !== "desktop" || options.desktopAlignment === "center";

  return (
    <>
      <SliderNumberField
        id="thumbnail-horizontal-padding"
        label="Horizontal padding"
        min={0}
        max={960}
        step={4}
        value={options.horizontalPadding}
        onValueChange={(horizontalPadding) =>
          onOptionsChange(mergeOptions(options, { horizontalPadding }))
        }
      />
      <SliderNumberField
        id={usesVerticalPadding ? "thumbnail-vertical-padding" : "thumbnail-top-padding"}
        label={usesVerticalPadding ? "Vertical padding" : "Top padding"}
        min={0}
        max={usesVerticalPadding ? 540 : 1080}
        step={4}
        value={options.verticalPadding}
        onValueChange={(verticalPadding) =>
          onOptionsChange(mergeOptions(options, { verticalPadding }))
        }
      />
      {options.mode === "mobile" ? (
        <SliderNumberField
          id="thumbnail-mobile-gap"
          label="Gap"
          min={0}
          max={240}
          step={4}
          value={options.mobileGap}
          onValueChange={(mobileGap) => onOptionsChange(mergeOptions(options, { mobileGap }))}
        />
      ) : null}
    </>
  );
}

export function ThumbnailImageShapeControls({
  options,
  onOptionsChange
}: ThumbnailControlsProps) {
  return (
    <SliderNumberField
      id="thumbnail-image-border-radius"
      label="Image radius"
      min={0}
      max={240}
      step={1}
      value={options.imageBorderRadius}
      onValueChange={(imageBorderRadius) =>
        onOptionsChange(mergeOptions(options, { imageBorderRadius }))
      }
    />
  );
}

export function ThumbnailShadowControls({
  options,
  onOptionsChange
}: ThumbnailControlsProps) {
  return (
    <>
      <ColorField
        id="thumbnail-shadow-color"
        label="Shadow"
        value={options.shadow.color}
        onValueChange={(color) => onOptionsChange(mergeShadow(options, { color }))}
      />
      <SliderNumberField
        id="thumbnail-shadow-opacity"
        label="Opacity"
        min={0}
        max={1}
        step={0.05}
        value={options.shadow.opacity}
        onValueChange={(opacity) => onOptionsChange(mergeShadow(options, { opacity }))}
      />
      <div className="grid grid-cols-2 gap-2">
        <SliderNumberField
          id="thumbnail-shadow-blur"
          label="Blur"
          min={0}
          max={160}
          step={1}
          value={options.shadow.blur}
          onValueChange={(blur) => onOptionsChange(mergeShadow(options, { blur }))}
        />
        <SliderNumberField
          id="thumbnail-shadow-spread"
          label="Spread"
          min={0}
          max={80}
          step={1}
          value={options.shadow.spread}
          onValueChange={(spread) => onOptionsChange(mergeShadow(options, { spread }))}
        />
      </div>
      <NumberRowField
        label="Shadow offset"
        fields={[
          {
            id: "thumbnail-shadow-x",
            ariaLabel: "Shadow x offset",
            min: -240,
            max: 240,
            step: 1,
            value: options.shadow.offsetX,
            onValueChange: (offsetX) => onOptionsChange(mergeShadow(options, { offsetX }))
          },
          {
            id: "thumbnail-shadow-y",
            ariaLabel: "Shadow y offset",
            min: -240,
            max: 240,
            step: 1,
            value: options.shadow.offsetY,
            onValueChange: (offsetY) => onOptionsChange(mergeShadow(options, { offsetY }))
          }
        ]}
      />
    </>
  );
}
