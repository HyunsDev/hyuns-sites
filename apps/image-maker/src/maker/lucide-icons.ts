import type { ComponentType, SVGProps } from "react";

import type { LucideIconEntry } from "./types";

type LucideModule = {
  default: ComponentType<SVGProps<SVGSVGElement>>;
};

const lucideIconModules = import.meta.glob<LucideModule>(
  "/node_modules/lucide-react/dist/esm/icons/*.mjs"
);

function formatIconTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

export const lucideIconEntries: LucideIconEntry[] = Object.keys(lucideIconModules)
  .map((moduleKey) => {
    const id = moduleKey.split("/").at(-1)?.replace(/\.mjs$/, "") ?? moduleKey;

    return {
      id,
      title: formatIconTitle(id),
      moduleKey
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export async function loadLucideIcon(entry: LucideIconEntry) {
  const loader = lucideIconModules[entry.moduleKey];

  if (!loader) {
    throw new Error(`Lucide icon not found: ${entry.id}`);
  }

  const module = await loader();

  return module.default;
}
