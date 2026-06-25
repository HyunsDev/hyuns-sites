import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@hyunsdev/ui/components/select";
import { useTheme } from "@hyunsdev/ui/components/theme-provider";
import { ACCENT_PRESETS, isAccentPreset } from "@hyunsdev/ui/lib/theme";
import type { AccentPreset } from "@hyunsdev/ui/lib/theme";

const ACCENT_PRESET_LABELS: Record<AccentPreset, string> = {
  default: "Default",
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
  pink: "Pink",
  orange: "Orange",
  purple: "Purple"
};

function getAccentSwatchColor(preset: AccentPreset) {
  return `var(--accent-${preset})`;
}

function AccentPresetOption({ preset }: { preset: AccentPreset }) {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="border-border inline-flex size-2.5 rounded-full border"
        style={{ backgroundColor: getAccentSwatchColor(preset) }}
      />
      <span>{ACCENT_PRESET_LABELS[preset]}</span>
    </span>
  );
}

export function AccentSelector() {
  const { accentPreset, setAccentPreset } = useTheme();
  const handleValueChange = (value: string) => {
    if (isAccentPreset(value)) {
      setAccentPreset(value);
    }
  };

  return (
    <Select value={accentPreset} onValueChange={handleValueChange}>
      <SelectTrigger size="sm" className="min-w-36">
        <SelectValue aria-label={ACCENT_PRESET_LABELS[accentPreset]}>
          <AccentPresetOption preset={accentPreset} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper">
        {ACCENT_PRESETS.map((preset) => (
          <SelectItem key={preset} value={preset}>
            <AccentPresetOption preset={preset} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
