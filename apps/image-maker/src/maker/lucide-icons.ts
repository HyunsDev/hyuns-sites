import * as LucideIcons from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import type { LucideIconEntry } from "./types";

const iconNamePattern = /^[A-Z][A-Za-z0-9]+Icon$/;

function formatIconTitle(name: string) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
}

export const lucideIconEntries: LucideIconEntry[] = Object.entries(LucideIcons)
  .filter(([name, value]) => iconNamePattern.test(name) && typeof value === "object")
  .map(([name, value]) => ({
    id: name,
    title: formatIconTitle(name),
    Icon: value as ComponentType<SVGProps<SVGSVGElement>>
  }))
  .sort((a, b) => a.title.localeCompare(b.title));
