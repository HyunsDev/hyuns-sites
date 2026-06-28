import { readFileAsDataUrl } from "./file-readers";
import {
  createThumbnailColorProfile,
  suggestThumbnailBackgroundColor
} from "./thumbnail-background";
import type {
  ThumbnailColorProfile,
  ThumbnailColorSample
} from "./thumbnail-background";
import type { ThumbnailSourceImage } from "./thumbnail-types";

type ImageMetadata = {
  readonly colorProfile: ThumbnailColorProfile | null;
  readonly height: number;
  readonly width: number;
};

const MAX_SAMPLE_DIMENSION = 48;

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function samplesFromImageData(data: Uint8ClampedArray) {
  const samples: ThumbnailColorSample[] = [];

  for (let index = 0; index < data.length; index += 4) {
    samples.push({
      alpha: data[index + 3] ?? 0,
      blue: data[index + 2] ?? 0,
      green: data[index + 1] ?? 0,
      red: data[index] ?? 0
    });
  }

  return samples;
}

function readImageColorProfile(image: HTMLImageElement) {
  const maxDimension = Math.max(image.naturalWidth, image.naturalHeight);

  if (maxDimension <= 0) {
    return null;
  }

  const scale = Math.min(1, MAX_SAMPLE_DIMENSION / maxDimension);
  const sampleWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const sampleHeight = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");

  canvas.width = sampleWidth;
  canvas.height = sampleHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (context === null) {
    return null;
  }

  try {
    context.drawImage(image, 0, 0, sampleWidth, sampleHeight);

    return createThumbnailColorProfile(
      samplesFromImageData(context.getImageData(0, 0, sampleWidth, sampleHeight).data)
    );
  } catch {
    return null;
  }
}

function readImageMetadata(dataUrl: string) {
  return new Promise<ImageMetadata>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        colorProfile: readImageColorProfile(image),
        height: image.naturalHeight,
        width: image.naturalWidth
      });
    };
    image.onerror = () => reject(new Error("이미지 크기를 읽지 못했습니다."));
    image.src = dataUrl;
  });
}

function suggestedBackgroundColorForProfile(profile: ThumbnailColorProfile | null) {
  if (profile === null) {
    return null;
  }

  return suggestThumbnailBackgroundColor([profile]);
}

export function imageFilesFromList(fileList: FileList | null) {
  if (!fileList) {
    return [];
  }

  return Array.from(fileList).filter(isImageFile);
}

export async function readThumbnailImageFiles(files: readonly File[]) {
  const imageFiles = files.filter(isImageFile);
  const images = await Promise.all(
    imageFiles.map(async (file, index): Promise<ThumbnailSourceImage> => {
      const dataUrl = await readFileAsDataUrl(file);
      const metadata = await readImageMetadata(dataUrl);

      return {
        colorProfile: metadata.colorProfile,
        dataUrl,
        height: metadata.height,
        id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
        suggestedBackgroundColor: suggestedBackgroundColorForProfile(metadata.colorProfile),
        title: file.name,
        width: metadata.width
      };
    })
  );

  return images;
}
