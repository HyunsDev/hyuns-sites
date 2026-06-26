import type { IconNode } from "lucide-react";
import { assertNever } from "./types";
import type {
  GraphicAsset,
  ImageMakerOptions,
  RenderMode,
  RenderedImage,
  SanitizedSvg
} from "./types";

const SVG_NS = "http://www.w3.org/2000/svg";

function escapeText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getCanvasSize(options: ImageMakerOptions, mode: RenderMode) {
  if (mode === "icon") {
    return {
      width: options.iconSize,
      height: options.iconSize
    };
  }

  return {
    width: options.bannerWidth,
    height: options.bannerHeight
  };
}

function serializeAttributes(attributes: Record<string, string>) {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeText(value)}"`)
    .join(" ");
}

function renderIconNode(iconNode: IconNode) {
  return iconNode
    .map(([elementName, attributes]) => {
      const serialized = serializeAttributes(attributes);

      return `<${elementName}${serialized ? ` ${serialized}` : ""} />`;
    })
    .join("");
}

function superellipseCorner(
  cx: number,
  cy: number,
  radius: number,
  exponent: number,
  startAngle: number
) {
  const points: string[] = [];
  const steps = 10;

  for (let step = 0; step <= steps; step += 1) {
    const angle = startAngle + (step / steps) * (Math.PI / 2);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = cx + Math.sign(cos) * radius * Math.abs(cos) ** (2 / exponent);
    const y = cy + Math.sign(sin) * radius * Math.abs(sin) ** (2 / exponent);

    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return points;
}

export function createSquirclePath(
  width: number,
  height: number,
  radius: number,
  curvature: number
) {
  const maxRadius = Math.min(width, height) / 2;
  const r = clamp(radius, 0, maxRadius);

  if (r <= 0) {
    return `M0 0H${width}V${height}H0Z`;
  }

  const exponent = clamp(curvature, 2, 8);
  const topRight = superellipseCorner(width - r, r, r, exponent, -Math.PI / 2);
  const bottomRight = superellipseCorner(width - r, height - r, r, exponent, 0);
  const bottomLeft = superellipseCorner(r, height - r, r, exponent, Math.PI / 2);
  const topLeft = superellipseCorner(r, r, r, exponent, Math.PI);
  const points = [
    `${r} 0`,
    `${width - r} 0`,
    ...topRight,
    `${width} ${height - r}`,
    ...bottomRight,
    `${r} ${height}`,
    ...bottomLeft,
    `0 ${r}`,
    ...topLeft
  ];

  return `M${points.join("L")}Z`;
}

function createRoundedRectPath(width: number, height: number, radius: number) {
  const maxRadius = Math.min(width, height) / 2;
  const r = clamp(radius, 0, maxRadius);

  if (r <= 0) {
    return `M0 0H${width}V${height}H0Z`;
  }

  return [
    `M${r} 0`,
    `H${width - r}`,
    `Q${width} 0 ${width} ${r}`,
    `V${height - r}`,
    `Q${width} ${height} ${width - r} ${height}`,
    `H${r}`,
    `Q0 ${height} 0 ${height - r}`,
    `V${r}`,
    `Q0 0 ${r} 0`,
    "Z"
  ].join("");
}

function getGraphicSize(options: ImageMakerOptions, mode: RenderMode, width: number, height: number) {
  const maxGraphicSize = Math.min(width, height);

  if (mode === "banner") {
    return clamp(options.bannerGraphicSize, 1, maxGraphicSize);
  }

  const maxPadding = maxGraphicSize / 2 - 1;
  const padding = clamp(options.padding, 0, maxPadding);

  return Math.max(1, maxGraphicSize - padding * 2);
}

function getBackgroundPath(
  options: ImageMakerOptions,
  mode: RenderMode,
  width: number,
  height: number
) {
  if (mode === "banner") {
    return createRoundedRectPath(width, height, options.borderRadius);
  }

  return createSquirclePath(width, height, options.borderRadius, options.curvature);
}

function renderGraphic(asset: GraphicAsset, color: string) {
  switch (asset.kind) {
    case "brand":
      return `<path fill="${escapeText(color)}" d="${escapeText(asset.path)}" />`;
    case "lucide":
      return `<g fill="none" stroke="${escapeText(color)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${renderIconNode(asset.iconNode)}</g>`;
    case "png":
      return `<image href="${escapeText(asset.dataUrl)}" x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet" />`;
    case "svg":
      return `<g color="${escapeText(color)}"><svg x="0" y="0" width="24" height="24" viewBox="${escapeText(asset.svg.viewBox)}">${asset.svg.body}</svg></g>`;
    default:
      return assertNever(asset);
  }
}

export function renderImageSvg(
  asset: GraphicAsset,
  options: ImageMakerOptions,
  mode: RenderMode
): RenderedImage {
  const { width, height } = getCanvasSize(options, mode);
  const graphicSize = getGraphicSize(options, mode, width, height);
  const graphicX = (width - graphicSize) / 2;
  const graphicY = (height - graphicSize) / 2;
  const backgroundPath = getBackgroundPath(options, mode, width, height);
  const iconColor = options.iconColor;
  const graphic = renderGraphic(asset, iconColor);

  return {
    mode,
    width,
    height,
    svg: `<svg xmlns="${SVG_NS}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeText(asset.title)}"><path d="${backgroundPath}" fill="${escapeText(options.backgroundColor)}" /><g transform="translate(${graphicX.toFixed(2)} ${graphicY.toFixed(2)}) scale(${(graphicSize / 24).toFixed(6)})">${graphic}</g></svg>`
  };
}

function removeUnsafeSvgNodes(svg: SVGSVGElement) {
  svg.querySelectorAll("script, foreignObject").forEach((node) => node.remove());

  svg.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (name.startsWith("on") || (name.endsWith("href") && value.startsWith("javascript:"))) {
        node.removeAttribute(attribute.name);
      }
    });
  });
}

export function sanitizeSvgText(svgText: string): SanitizedSvg | null {
  const parser = new DOMParser();
  const document = parser.parseFromString(svgText, "image/svg+xml");

  if (document.querySelector("parsererror")) {
    return null;
  }

  const svg = document.querySelector("svg");

  if (!svg) {
    return null;
  }

  removeUnsafeSvgNodes(svg);

  const serializer = new XMLSerializer();
  const body = Array.from(svg.childNodes)
    .map((node) => serializer.serializeToString(node))
    .join("");

  return {
    viewBox: svg.getAttribute("viewBox") ?? "0 0 24 24",
    body
  };
}

export function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
