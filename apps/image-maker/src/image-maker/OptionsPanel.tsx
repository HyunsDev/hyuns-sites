import { Button } from "@hyunsdev/ui/components/button";
import { Separator } from "@hyunsdev/ui/components/separator";
import { ScrollArea } from "@hyunsdev/ui/components/scroll-area";
import { DEFAULT_COLOR_PRESETS, createUserColorPreset } from "./presets";
import {
  ColorField,
  FieldGroup,
  NumberField,
  NumberRowField,
  SliderNumberField,
  SwatchButton
} from "./OptionFields";
import { ResetSvgButton, SourceControls } from "./SourceControls";
import type { ColorPreset, ImageMakerOptions, SourceKind } from "./types";

const SAMPLE_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" d="M12 2 21 7v10l-9 5-9-5V7l9-5Zm0 3.2L5.8 8.6v6.8L12 18.8l6.2-3.4V8.6L12 5.2Z"/>
</svg>`;

type OptionsPanelProps = {
  readonly brandValue: string;
  readonly lucideValue: string;
  readonly options: ImageMakerOptions;
  readonly pngFileName: string | null;
  readonly sourceKind: SourceKind;
  readonly svgText: string;
  readonly userPresets: readonly ColorPreset[];
  readonly onBrandValueChange: (value: string) => void;
  readonly onFileError: (message: string) => void;
  readonly onLucideValueChange: (value: string) => void;
  readonly onOptionsChange: (options: ImageMakerOptions) => void;
  readonly onPngDataUrlChange: (dataUrl: string, fileName: string) => void;
  readonly onSvgTextChange: (value: string) => void;
  readonly onUserPresetsChange: (presets: readonly ColorPreset[]) => void;
};

function mergeOptions(options: ImageMakerOptions, patch: Partial<ImageMakerOptions>) {
  return {
    ...options,
    ...patch
  };
}

export function OptionsPanel({
  brandValue,
  lucideValue,
  options,
  pngFileName,
  sourceKind,
  svgText,
  userPresets,
  onBrandValueChange,
  onFileError,
  onLucideValueChange,
  onOptionsChange,
  onPngDataUrlChange,
  onSvgTextChange,
  onUserPresetsChange
}: OptionsPanelProps) {
  const presets = [...DEFAULT_COLOR_PRESETS, ...userPresets];
  const canEditIconColor = sourceKind !== "png";

  return (
    <ScrollArea className="h-full">
      <div className="grid gap-5 p-4">
        <FieldGroup title="Source">
          <SourceControls
            brandValue={brandValue}
            lucideValue={lucideValue}
            pngFileName={pngFileName}
            sourceKind={sourceKind}
            svgText={svgText}
            onBrandValueChange={onBrandValueChange}
            onFileError={onFileError}
            onLucideValueChange={onLucideValueChange}
            onPngDataUrlChange={onPngDataUrlChange}
            onSvgTextChange={onSvgTextChange}
          />
          {sourceKind === "svg" ? <ResetSvgButton onClick={() => onSvgTextChange(SAMPLE_SVG)} /> : null}
        </FieldGroup>

        <Separator />

        <FieldGroup title="Size">
          <NumberField
            id="icon-size"
            label="Icon image"
            min={128}
            max={2048}
            step={8}
            value={options.iconSize}
            onValueChange={(iconSize) => onOptionsChange(mergeOptions(options, { iconSize }))}
          />
          <NumberRowField
            label="Banner image"
            fields={[
              {
                id: "banner-width",
                ariaLabel: "Banner width",
                min: 640,
                max: 4096,
                step: 16,
                value: options.bannerWidth,
                onValueChange: (bannerWidth) =>
                  onOptionsChange(mergeOptions(options, { bannerWidth }))
              },
              {
                id: "banner-height",
                ariaLabel: "Banner height",
                min: 360,
                max: 2160,
                step: 16,
                value: options.bannerHeight,
                onValueChange: (bannerHeight) =>
                  onOptionsChange(mergeOptions(options, { bannerHeight }))
              }
            ]}
          />
          <NumberField
            id="banner-graphic-size"
            label="Banner icon"
            min={64}
            max={2048}
            step={8}
            value={options.bannerGraphicSize}
            onValueChange={(bannerGraphicSize) =>
              onOptionsChange(mergeOptions(options, { bannerGraphicSize }))
            }
          />
        </FieldGroup>

        <Separator />

        <FieldGroup title="Color">
          <ColorField
            id="background-color"
            label="Background"
            value={options.backgroundColor}
            onValueChange={(backgroundColor) =>
              onOptionsChange(mergeOptions(options, { backgroundColor }))
            }
          />
          {canEditIconColor ? (
            <ColorField
              id="icon-color"
              label="Icon"
              value={options.iconColor}
              onValueChange={(iconColor) => onOptionsChange(mergeOptions(options, { iconColor }))}
            />
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <SwatchButton
                key={preset.id}
                backgroundColor={preset.backgroundColor}
                iconColor={preset.iconColor}
                label={preset.name}
                onClick={() =>
                  onOptionsChange(
                    mergeOptions(options, {
                      backgroundColor: preset.backgroundColor,
                      iconColor: preset.iconColor
                    })
                  )
                }
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const nextPresets = [...userPresets, createUserColorPreset(options)];
                onUserPresetsChange(nextPresets);
              }}
            >
              Save preset
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={userPresets.length === 0}
              onClick={() => {
                const nextPresets = userPresets.slice(0, -1);
                onUserPresetsChange(nextPresets);
              }}
            >
              Delete last
            </Button>
          </div>
        </FieldGroup>

        <Separator />

        <FieldGroup title="Shape">
          <SliderNumberField
            id="border-radius"
            label="Border radius"
            min={0}
            max={1024}
            step={1}
            value={options.borderRadius}
            onValueChange={(borderRadius) =>
              onOptionsChange(mergeOptions(options, { borderRadius }))
            }
          />
          <SliderNumberField
            id="curvature"
            label="Curvature"
            min={2}
            max={8}
            step={0.1}
            value={options.curvature}
            onValueChange={(curvature) => onOptionsChange(mergeOptions(options, { curvature }))}
          />
          <SliderNumberField
            id="padding"
            label="Margin"
            min={0}
            max={512}
            step={4}
            value={options.padding}
            onValueChange={(padding) => onOptionsChange(mergeOptions(options, { padding }))}
          />
        </FieldGroup>
      </div>
    </ScrollArea>
  );
}

export { SAMPLE_SVG };
