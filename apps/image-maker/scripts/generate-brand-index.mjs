import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const iconsJsonPath = require.resolve("simple-icons/icons.json");
const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDir, "../src/image-maker/generated/brand-icons.ts");

const icons = JSON.parse(await readFile(iconsJsonPath, "utf8"));

if (!Array.isArray(icons)) {
  throw new Error("Expected simple-icons/icons.json to contain an array.");
}

const brandIcons = icons
  .map((icon) => ({
    slug: icon.slug,
    title: icon.title,
    hex: icon.hex
  }))
  .filter((icon) => {
    return (
      typeof icon.slug === "string" &&
      typeof icon.title === "string" &&
      typeof icon.hex === "string"
    );
  })
  .sort((left, right) => left.title.localeCompare(right.title));

const source = `export type BrandIconMetadata = {
  readonly slug: string;
  readonly title: string;
  readonly hex: string;
};

export const BRAND_ICON_INDEX: readonly BrandIconMetadata[] = ${JSON.stringify(
  brandIcons,
  null,
  2
)};
`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, source, "utf8");
