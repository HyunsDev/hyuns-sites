import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import type { MakerOptions, PngSource, VectorSource } from "./types";

function getInnerSvg(svg: string) {
  const document = new DOMParser().parseFromString(svg, "image/svg+xml");
  const root = document.documentElement;
  const viewBox = root.getAttribute("viewBox") ?? "0 0 24 24";

  return {
    viewBox,
    inner: root.innerHTML
  };
}

function getLucideMarkup(source: Extract<VectorSource, { kind: "lucide" }>, color: string) {
  const markup = renderToStaticMarkup(
    createElement(source.Icon, {
      color,
      size: 24,
      strokeWidth: 2,
      absoluteStrokeWidth: true
    } as React.SVGProps<SVGSVGElement>)
  );

  return getInnerSvg(markup);
}

function buildVectorInner(source: VectorSource, color: string) {
  if (source.kind === "lucide") {
    return getLucideMarkup(source, color);
  }

  const parsed = getInnerSvg(source.svg);

  if (source.kind === "brand") {
    return {
      viewBox: parsed.viewBox,
      inner: `<g fill="${color}">${parsed.inner}</g>`
    };
  }

  return parsed;
}

export function buildVectorSvg(source: VectorSource, options: MakerOptions) {
  const { width, height, backgroundColor, iconColor, paddingPercent, radiusPercent } = options;
  const padding = Math.min(width, height) * (paddingPercent / 100);
  const boxWidth = Math.max(0, width - padding * 2);
  const boxHeight = Math.max(0, height - padding * 2);
  const radius = Math.min(width, height) * (radiusPercent / 100);
  const icon = buildVectorInner(source, source.kind === "brand" ? iconColor : iconColor);
  const ariaTitle = `${source.title} ${width} by ${height}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${ariaTitle}">
  <rect width="${width}" height="${height}" rx="${radius}" fill="${backgroundColor}" />
  <svg x="${padding}" y="${padding}" width="${boxWidth}" height="${boxHeight}" viewBox="${icon.viewBox}" preserveAspectRatio="xMidYMid meet">
    ${icon.inner}
  </svg>
</svg>`;
}

export function buildPngPreviewStyle(source: PngSource, options: MakerOptions) {
  const radius = Math.min(options.width, options.height) * (options.radiusPercent / 100);

  return {
    width: options.width,
    height: options.height,
    borderRadius: radius,
    backgroundColor: options.backgroundColor,
    backgroundImage: `url(${source.dataUrl})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: `${100 - options.paddingPercent * 2}% auto`
  };
}

export async function svgToPngBlob(svg: string, options: MakerOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;

  const contextAttributes =
    options.colorSpace === "display-p3"
      ? ({ colorSpace: "display-p3" } as CanvasRenderingContext2DSettings)
      : undefined;
  const context = canvas.getContext("2d", contextAttributes);

  if (!context) {
    throw new Error("Canvas 2D context를 만들 수 없습니다.");
  }

  const image = new Image();
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("SVG 이미지를 PNG로 렌더링할 수 없습니다."));
      image.src = svgUrl;
    });

    context.drawImage(image, 0, 0, options.width, options.height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("PNG Blob을 만들 수 없습니다."));
          return;
        }

        resolve(blob);
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function roundedRect(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  radius: number
) {
  const clampedRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(clampedRadius, 0);
  context.lineTo(width - clampedRadius, 0);
  context.quadraticCurveTo(width, 0, width, clampedRadius);
  context.lineTo(width, height - clampedRadius);
  context.quadraticCurveTo(width, height, width - clampedRadius, height);
  context.lineTo(clampedRadius, height);
  context.quadraticCurveTo(0, height, 0, height - clampedRadius);
  context.lineTo(0, clampedRadius);
  context.quadraticCurveTo(0, 0, clampedRadius, 0);
  context.closePath();
}

export async function pngSourceToPngBlob(source: PngSource, options: MakerOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context를 만들 수 없습니다.");
  }

  const image = new Image();

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("PNG 이미지를 렌더링할 수 없습니다."));
    image.src = source.dataUrl;
  });

  const radius = Math.min(options.width, options.height) * (options.radiusPercent / 100);
  const padding = Math.min(options.width, options.height) * (options.paddingPercent / 100);
  const targetWidth = Math.max(1, options.width - padding * 2);
  const targetHeight = Math.max(1, options.height - padding * 2);
  const imageRatio = image.width / image.height;
  const targetRatio = targetWidth / targetHeight;
  const drawWidth = imageRatio > targetRatio ? targetWidth : targetHeight * imageRatio;
  const drawHeight = imageRatio > targetRatio ? targetWidth / imageRatio : targetHeight;
  const drawX = (options.width - drawWidth) / 2;
  const drawY = (options.height - drawHeight) / 2;

  roundedRect(context, options.width, options.height, radius);
  context.fillStyle = options.backgroundColor;
  context.fill();
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("PNG Blob을 만들 수 없습니다."));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function downloadText(text: string, filename: string, type: string) {
  downloadBlob(new Blob([text], { type }), filename);
}
