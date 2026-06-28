import { assertNever } from "./types";
import type { ThumbnailOptions, ThumbnailSourceImage } from "./thumbnail-types";
import type { RenderedImage } from "./types";

type ContentBox = {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
};

type RenderImageInput = {
  readonly box: ContentBox;
  readonly clipId: string;
  readonly image: ThumbnailSourceImage;
  readonly radius: number;
  readonly shadow: boolean;
};

const SVG_NS = "http://www.w3.org/2000/svg";
const SHADOW_FILTER_ID = "thumbnail-image-shadow";
const CLIP_ID_PREFIX = "thumbnail-image-clip";

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

function getContentBox(options: ThumbnailOptions): ContentBox {
  const horizontalPadding = clamp(options.horizontalPadding, 0, (options.canvasWidth - 1) / 2);
  const verticalPadding = clamp(options.verticalPadding, 0, (options.canvasHeight - 1) / 2);

  return {
    height: Math.max(1, options.canvasHeight - verticalPadding * 2),
    width: Math.max(1, options.canvasWidth - horizontalPadding * 2),
    x: horizontalPadding,
    y: verticalPadding
  };
}

function shouldApplyShadow(options: ThumbnailOptions) {
  return options.mode !== "image" && options.shadow.opacity > 0;
}

function getImageRadius(options: ThumbnailOptions) {
  if (options.mode === "image") {
    return 0;
  }

  return clamp(options.imageBorderRadius, 0, Math.min(options.canvasWidth, options.canvasHeight) / 2);
}

function renderShadowFilter(options: ThumbnailOptions) {
  if (!shouldApplyShadow(options)) {
    return "";
  }

  const blur = clamp(options.shadow.blur, 0, 256);
  const opacity = clamp(options.shadow.opacity, 0, 1);
  const spread = clamp(options.shadow.spread, 0, 128);

  return `<defs><filter id="${SHADOW_FILTER_ID}" x="${-options.canvasWidth}" y="${-options.canvasHeight}" width="${options.canvasWidth * 3}" height="${options.canvasHeight * 3}" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse"><feMorphology in="SourceAlpha" operator="dilate" radius="${spread}" result="spread"/><feGaussianBlur in="spread" stdDeviation="${blur}" result="blur"/><feOffset dx="${options.shadow.offsetX}" dy="${options.shadow.offsetY}" result="offset"/><feFlood flood-color="${escapeText(options.shadow.color)}" flood-opacity="${opacity}" result="color"/><feComposite in="color" in2="offset" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
}

function renderImageElement({ box, clipId, image, radius, shadow }: RenderImageInput) {
  const filter = shadow ? ` filter="url(#${SHADOW_FILTER_ID})"` : "";
  const imageElement = `<image href="${escapeText(image.dataUrl)}" x="${box.x.toFixed(2)}" y="${box.y.toFixed(2)}" width="${box.width.toFixed(2)}" height="${box.height.toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>`;

  if (radius <= 0) {
    return `<g${filter}>${imageElement}</g>`;
  }

  return `<defs><clipPath id="${clipId}"><rect x="${box.x.toFixed(2)}" y="${box.y.toFixed(2)}" width="${box.width.toFixed(2)}" height="${box.height.toFixed(2)}" rx="${radius}" ry="${radius}"/></clipPath></defs><g${filter}><g clip-path="url(#${clipId})">${imageElement}</g></g>`;
}

function renderDesktopImage(images: readonly ThumbnailSourceImage[], options: ThumbnailOptions) {
  const image = images.at(0);

  if (!image) {
    return "";
  }

  if (options.desktopAlignment === "center") {
    return renderImageElement({
      box: getContentBox(options),
      clipId: `${CLIP_ID_PREFIX}-0`,
      image,
      radius: getImageRadius(options),
      shadow: shouldApplyShadow(options)
    });
  }

  const horizontalPadding = clamp(options.horizontalPadding, 0, (options.canvasWidth - 1) / 2);
  const renderedWidth = Math.max(1, options.canvasWidth - horizontalPadding * 2);
  const renderedHeight = renderedWidth * (image.height / image.width);
  const box = {
    height: renderedHeight,
    width: renderedWidth,
    x: horizontalPadding,
    y: clamp(options.verticalPadding, 0, options.canvasHeight - 1)
  };

  return renderImageElement({
    box,
    clipId: `${CLIP_ID_PREFIX}-0`,
    image,
    radius: getImageRadius(options),
    shadow: shouldApplyShadow(options)
  });
}

function renderMobileImages(images: readonly ThumbnailSourceImage[], options: ThumbnailOptions) {
  const box = getContentBox(options);
  const maxGap = images.length > 1 ? Math.max(0, (box.width - images.length) / (images.length - 1)) : 0;
  const gap = images.length > 1 ? clamp(options.mobileGap, 0, maxGap) : 0;
  const totalGap = gap * Math.max(0, images.length - 1);
  const totalBaseWidth = images.reduce(
    (totalWidth, image) => totalWidth + box.height * (image.width / image.height),
    0
  );
  const availableImageWidth = Math.max(1, box.width - totalGap);
  const scale = totalBaseWidth > availableImageWidth ? availableImageWidth / totalBaseWidth : 1;
  const imageHeight = Math.max(1, box.height * scale);
  const imageY = box.y + (box.height - imageHeight) / 2;
  const renderedImages = images.map((image) => ({
    image,
    width: Math.max(1, box.height * (image.width / image.height) * scale)
  }));
  const groupWidth = renderedImages.reduce((totalWidth, image) => totalWidth + image.width, totalGap);
  let imageX = box.x + Math.max(0, (box.width - groupWidth) / 2);

  return renderedImages
    .map(({ image, width }, index) => {
      const renderedImage = renderImageElement({
        clipId: `${CLIP_ID_PREFIX}-${index}`,
        image,
        box: {
          height: imageHeight,
          width,
          x: imageX,
          y: imageY
        },
        radius: getImageRadius(options),
        shadow: shouldApplyShadow(options)
      });
      imageX += width + gap;

      return renderedImage;
    })
    .join("");
}

function renderThumbnailImages(images: readonly ThumbnailSourceImage[], options: ThumbnailOptions) {
  switch (options.mode) {
    case "desktop":
      return renderDesktopImage(images, options);
    case "mobile":
      return renderMobileImages(images, options);
    case "image": {
      const image = images.at(0);

      return image
        ? renderImageElement({
            box: getContentBox(options),
            clipId: `${CLIP_ID_PREFIX}-0`,
            image,
            radius: 0,
            shadow: false
          })
        : "";
    }
    default:
      return assertNever(options.mode);
  }
}

export function renderThumbnailSvg(
  images: readonly ThumbnailSourceImage[],
  options: ThumbnailOptions
): RenderedImage | null {
  if (images.length === 0) {
    return null;
  }

  const body = renderThumbnailImages(images, options);

  return {
    height: options.canvasHeight,
    mode: "thumbnail",
    width: options.canvasWidth,
    svg: `<svg xmlns="${SVG_NS}" width="${options.canvasWidth}" height="${options.canvasHeight}" viewBox="0 0 ${options.canvasWidth} ${options.canvasHeight}" role="img" aria-label="Thumbnail"><rect width="${options.canvasWidth}" height="${options.canvasHeight}" fill="${escapeText(options.backgroundColor)}"/>${renderShadowFilter(options)}${body}</svg>`
  };
}
