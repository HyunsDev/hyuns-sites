import { Button } from "@hyunsdev/ui/components/button";
import { ImageIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import { assertNever } from "./types";
import type {
  ThumbnailMode,
  ThumbnailOptions
} from "./thumbnail-types";

type ThumbnailModeControlsProps = {
  readonly options: ThumbnailOptions;
  readonly onOptionsChange: (options: ThumbnailOptions) => void;
};

function mergeOptions(options: ThumbnailOptions, patch: Partial<ThumbnailOptions>) {
  return {
    ...options,
    ...patch
  };
}

function IconForMode({ mode }: { readonly mode: ThumbnailMode }) {
  switch (mode) {
    case "desktop":
      return <MonitorIcon aria-hidden="true" className="size-3.5" />;
    case "mobile":
      return <SmartphoneIcon aria-hidden="true" className="size-3.5" />;
    case "image":
      return <ImageIcon aria-hidden="true" className="size-3.5" />;
    default:
      return assertNever(mode);
  }
}

function ModeButton({
  active,
  label,
  mode,
  onClick
}: {
  readonly active: boolean;
  readonly label: string;
  readonly mode: ThumbnailMode;
  readonly onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "accent" : "outline"}
      size="sm"
      className="w-full"
      aria-pressed={active}
      onClick={onClick}
    >
      <IconForMode mode={mode} />
      {label}
    </Button>
  );
}

function AlignmentButton({
  active,
  label,
  onClick
}: {
  readonly active: boolean;
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "accent" : "outline"}
      size="sm"
      className="w-full"
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export function ThumbnailModeControls({
  options,
  onOptionsChange
}: ThumbnailModeControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <ModeButton
        active={options.mode === "desktop"}
        label="Desktop"
        mode="desktop"
        onClick={() => onOptionsChange(mergeOptions(options, { mode: "desktop" }))}
      />
      <ModeButton
        active={options.mode === "mobile"}
        label="Mobile"
        mode="mobile"
        onClick={() => onOptionsChange(mergeOptions(options, { mode: "mobile" }))}
      />
      <ModeButton
        active={options.mode === "image"}
        label="Image"
        mode="image"
        onClick={() => onOptionsChange(mergeOptions(options, { mode: "image" }))}
      />
    </div>
  );
}

export function DesktopAlignmentControls({
  options,
  onOptionsChange
}: ThumbnailModeControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <AlignmentButton
        active={options.desktopAlignment === "bottom"}
        label="Bottom"
        onClick={() => onOptionsChange(mergeOptions(options, { desktopAlignment: "bottom" }))}
      />
      <AlignmentButton
        active={options.desktopAlignment === "center"}
        label="Center"
        onClick={() => onOptionsChange(mergeOptions(options, { desktopAlignment: "center" }))}
      />
    </div>
  );
}
