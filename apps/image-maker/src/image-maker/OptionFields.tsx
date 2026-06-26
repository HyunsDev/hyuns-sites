import { Button } from "@hyunsdev/ui/components/button";
import { ColorPicker } from "@hyunsdev/ui/components/color-picker";
import { Input } from "@hyunsdev/ui/components/input";
import { Label } from "@hyunsdev/ui/components/label";
import { Slider } from "@hyunsdev/ui/components/slider";
import type { ReactNode } from "react";

type NumberFieldProps = {
  readonly id: string;
  readonly label: string;
  readonly max: number;
  readonly min: number;
  readonly step?: number;
  readonly value: number;
  readonly onValueChange: (value: number) => void;
};

type NumberRowFieldItem = Omit<NumberFieldProps, "label"> & {
  readonly ariaLabel: string;
};

type NumberRowFieldProps = {
  readonly fields: readonly [NumberRowFieldItem, NumberRowFieldItem];
  readonly label: string;
};

type ColorFieldProps = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
};

type FieldGroupProps = {
  readonly children: ReactNode;
  readonly title: string;
};

function isColorInputValue(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function readSliderValue(values: readonly number[]) {
  const value = values.at(0);

  return typeof value === "number" ? value : null;
}

function readInputNumber(value: string) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function NumberInput({
  id,
  ariaLabel,
  max,
  min,
  step = 1,
  value,
  onValueChange,
  className = "h-9 w-full text-right font-mono text-xs"
}: Omit<NumberFieldProps, "label"> & {
  readonly ariaLabel?: string;
  readonly className?: string;
}) {
  return (
    <Input
      id={id}
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => {
        const nextValue = readInputNumber(event.currentTarget.value);

        if (nextValue !== null) {
          onValueChange(nextValue);
        }
      }}
      aria-label={ariaLabel}
      className={className}
    />
  );
}

export function FieldGroup({ children, title }: FieldGroupProps) {
  return (
    <section className="grid gap-3">
      <h2 className="text-sm font-semibold leading-5">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

export function NumberField({
  id,
  label,
  max,
  min,
  step = 1,
  value,
  onValueChange
}: NumberFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <NumberInput
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}

export function NumberRowField({ fields, label }: NumberRowFieldProps) {
  const labelId = `${fields[0].id}-group-label`;

  return (
    <div className="grid gap-2" role="group" aria-labelledby={labelId}>
      <div id={labelId} className="text-sm font-medium leading-none">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fields.map((field) => (
          <NumberInput
            key={field.id}
            id={field.id}
            ariaLabel={field.ariaLabel}
            min={field.min}
            max={field.max}
            step={field.step}
            value={field.value}
            onValueChange={field.onValueChange}
          />
        ))}
      </div>
    </div>
  );
}

export function SliderNumberField({
  id,
  label,
  max,
  min,
  step = 1,
  value,
  onValueChange
}: NumberFieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        <NumberInput
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          className="h-8 w-24 text-right font-mono text-xs"
        />
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => {
          const nextValue = readSliderValue(values);

          if (nextValue !== null) {
            onValueChange(nextValue);
          }
        }}
        aria-label={label}
      />
    </div>
  );
}

export function ColorField({ id, label, value, onValueChange }: ColorFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <ColorPicker
        id={id}
        value={isColorInputValue(value) ? value : "#000000"}
        onValueChange={onValueChange}
        aria-label={`${label} picker`}
      />
    </div>
  );
}

export function SwatchButton({
  backgroundColor,
  iconColor,
  label,
  onClick
}: {
  readonly backgroundColor: string;
  readonly iconColor: string;
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <Button type="button" variant="outline" size="sm" className="justify-start" onClick={onClick}>
      <span
        aria-hidden="true"
        className="size-4 rounded border border-border"
        style={{ backgroundColor }}
      />
      <span
        aria-hidden="true"
        className="size-2 rounded-full"
        style={{ backgroundColor: iconColor }}
      />
      <span className="truncate">{label}</span>
    </Button>
  );
}
