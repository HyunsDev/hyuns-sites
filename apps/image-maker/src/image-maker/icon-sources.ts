import dynamicIconImports from "lucide-react/dynamicIconImports";
import type { IconNode, LucideIcon } from "lucide-react";

type LucideIconModule = {
  readonly default: LucideIcon;
  readonly __iconNode: IconNode;
};

export type LucideIconOption = {
  readonly value: string;
  readonly label: string;
  readonly keywords: readonly string[];
  readonly load: () => Promise<LucideIconModule>;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replaceAll(/[\s_-]/g, "");
}

export const LUCIDE_ICON_OPTIONS: readonly LucideIconOption[] = Object.entries(
  dynamicIconImports
)
  .map(([value, load]) => ({
    value,
    label: titleFromSlug(value),
    keywords: [value, normalizeSearchText(value)],
    load
  }))
  .sort((left, right) => left.label.localeCompare(right.label));

export function findLucideIconOption(value: string) {
  return LUCIDE_ICON_OPTIONS.find((option) => option.value === value) ?? null;
}
