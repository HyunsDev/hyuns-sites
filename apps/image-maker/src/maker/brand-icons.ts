import iconData from "simple-icons/icons.json";

import type { BrandIconEntry } from "./types";

type SimpleIconData = {
  title: string;
  slug: string;
  hex: string;
  aliases?: {
    aka?: string[];
    loc?: Record<string, string>;
  };
};

const rawBrandIconModules = import.meta.glob<string>("/node_modules/simple-icons/icons/*.svg", {
  query: "?raw",
  import: "default"
});

export const brandIconEntries: BrandIconEntry[] = (iconData as SimpleIconData[])
  .map((icon) => ({
    title: icon.title,
    slug: icon.slug,
    hex: `#${icon.hex}`,
    aliases: [
      ...(icon.aliases?.aka ?? []),
      ...Object.values(icon.aliases?.loc ?? {})
    ]
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

export async function loadBrandIconSvg(slug: string) {
  const moduleKey = `/node_modules/simple-icons/icons/${slug}.svg`;
  const loader = rawBrandIconModules[moduleKey];

  if (!loader) {
    throw new Error(`Brand icon not found: ${slug}`);
  }

  return loader();
}
