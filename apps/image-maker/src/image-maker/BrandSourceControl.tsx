import { Combobox } from "@hyunsdev/ui/components/combobox";
import { Label } from "@hyunsdev/ui/components/label";
import { SIMPLE_ICON_OPTIONS } from "./brand-sources";

type BrandSourceControlProps = {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
};

export function BrandSourceControl({ value, onValueChange }: BrandSourceControlProps) {
  return (
    <div className="grid gap-2">
      <Label>Brand icon</Label>
      <Combobox
        options={SIMPLE_ICON_OPTIONS}
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onValueChange(nextValue);
          }
        }}
        placeholder="Search brand"
        emptyMessage="No brand icon"
      />
    </div>
  );
}
