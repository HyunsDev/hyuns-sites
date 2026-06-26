import { useEffect, useState } from "react";
import { findLucideIconOption } from "./icon-sources";
import { errorMessageFromUnknown } from "./file-readers";
import { sanitizeSvgText } from "./renderers";
import type { Dispatch, SetStateAction } from "react";
import type { ExportStatus, GraphicAsset, ImageMakerOptions, SourceKind } from "./types";

export type BrandGraphicAsset = Extract<GraphicAsset, { readonly kind: "brand" }>;

export function svgGraphicFromText(svgText: string): GraphicAsset | null {
  const svg = sanitizeSvgText(svgText);

  if (!svg) {
    return null;
  }

  return {
    kind: "svg",
    title: "Custom SVG",
    svg
  };
}

export function useLucideGraphic(
  lucideValue: string,
  setStatus: Dispatch<SetStateAction<ExportStatus>>
) {
  const [lucideGraphic, setLucideGraphic] = useState<GraphicAsset | null>(null);

  useEffect(() => {
    const option = findLucideIconOption(lucideValue);
    let isActive = true;

    if (!option) {
      setLucideGraphic(null);
      return () => {
        isActive = false;
      };
    }

    void option
      .load()
      .then((module) => {
        if (!isActive) {
          return;
        }

        setLucideGraphic({
          kind: "lucide",
          title: option.label,
          iconNode: module.__iconNode
        });
      })
      .catch((error: unknown) => {
        if (isActive) {
          setStatus({ kind: "error", message: errorMessageFromUnknown(error) });
        }
      });

    return () => {
      isActive = false;
    };
  }, [lucideValue, setStatus]);

  return lucideGraphic;
}

export function useBrandGraphic(
  brandValue: string,
  sourceKind: SourceKind,
  setOptions: Dispatch<SetStateAction<ImageMakerOptions>>,
  setStatus: Dispatch<SetStateAction<ExportStatus>>
) {
  const [brandGraphic, setBrandGraphic] = useState<BrandGraphicAsset | null>(null);

  useEffect(() => {
    if (sourceKind !== "brand") {
      return undefined;
    }

    let isActive = true;

    void import("./brand-sources")
      .then(async ({ findSimpleIconOption }) => {
        const option = findSimpleIconOption(brandValue);

        if (!option) {
          setBrandGraphic(null);
          return;
        }

        setOptions((currentOptions) => ({
          ...currentOptions,
          iconColor: `#${option.hex}`
        }));

        const icon = await option.load();

        if (!isActive) {
          return;
        }

        setBrandGraphic({
          kind: "brand",
          title: icon.title,
          path: icon.path,
          color: `#${icon.hex}`
        });
      })
      .catch((error: unknown) => {
        if (isActive) {
          setStatus({ kind: "error", message: errorMessageFromUnknown(error) });
        }
      });

    return () => {
      isActive = false;
    };
  }, [brandValue, setOptions, setStatus, sourceKind]);

  return brandGraphic;
}
