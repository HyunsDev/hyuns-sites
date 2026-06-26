import type { RenderedImage } from "./types";

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
}

function imageFromSvg(svg: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG 이미지를 PNG로 변환하지 못했습니다."));
    };
    image.src = url;
  });
}

export async function renderedImageToPngBlob(rendered: RenderedImage) {
  const image = await imageFromSvg(rendered.svg);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("브라우저가 Canvas 2D 컨텍스트를 제공하지 않습니다.");
  }

  canvas.width = rendered.width;
  canvas.height = rendered.height;
  context.drawImage(image, 0, 0, rendered.width, rendered.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("PNG Blob을 생성하지 못했습니다."));
    }, "image/png");
  });
}

export async function copySvgToClipboard(rendered: RenderedImage) {
  await navigator.clipboard.writeText(rendered.svg);
}

export async function copyPngToClipboard(rendered: RenderedImage) {
  const blob = await renderedImageToPngBlob(rendered);

  if (typeof ClipboardItem === "undefined") {
    throw new Error("이 브라우저는 PNG 클립보드 복사를 지원하지 않습니다.");
  }

  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

export function downloadSvg(rendered: RenderedImage, filename: string) {
  const blob = new Blob([rendered.svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

export async function downloadPng(rendered: RenderedImage, filename: string) {
  const blob = await renderedImageToPngBlob(rendered);
  const url = URL.createObjectURL(blob);

  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}
