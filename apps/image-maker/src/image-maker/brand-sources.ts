import { BRAND_ICON_INDEX } from "./generated/brand-icons";

export type SimpleIconGraphic = {
  readonly title: string;
  readonly slug: string;
  readonly hex: string;
  readonly path: string;
};

export type SimpleIconOption = {
  readonly value: string;
  readonly label: string;
  readonly hex: string;
  readonly keywords: readonly string[];
  readonly load: () => Promise<SimpleIconGraphic>;
};

const simpleIconSvgLoaders = import.meta.glob<string>(
  "/node_modules/simple-icons/icons/*.svg",
  {
    query: "?raw",
    import: "default"
  }
);

function normalizeSearchText(value: string) {
  return value.toLowerCase().replaceAll(/[\s_-]/g, "");
}

function parseSimpleIconPath(svgText: string) {
  const document = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const path = document.querySelector("path")?.getAttribute("d");

  if (!path) {
    throw new Error("Unable to parse Simple Icons SVG path.");
  }

  return path;
}

function createSimpleIconLoader(metadata: (typeof BRAND_ICON_INDEX)[number]) {
  const loadSvg = simpleIconSvgLoaders[`/node_modules/simple-icons/icons/${metadata.slug}.svg`];

  return async (): Promise<SimpleIconGraphic> => {
    if (!loadSvg) {
      throw new Error(`Simple Icons asset not found: ${metadata.slug}`);
    }

    const svgText = await loadSvg();

    return {
      title: metadata.title,
      slug: metadata.slug,
      hex: metadata.hex,
      path: parseSimpleIconPath(svgText)
    };
  };
}

export const SIMPLE_ICON_OPTIONS: readonly SimpleIconOption[] = BRAND_ICON_INDEX.map(
  (metadata) => ({
    value: metadata.slug,
    label: metadata.title,
    hex: metadata.hex,
    keywords: [metadata.slug, normalizeSearchText(metadata.title)],
    load: createSimpleIconLoader(metadata)
  })
);

export function findSimpleIconOption(value: string) {
  return SIMPLE_ICON_OPTIONS.find((option) => option.value === value) ?? null;
}
