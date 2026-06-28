export type ThumbnailColorSample = {
  readonly alpha: number;
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};

export type ThumbnailColorProfile = {
  readonly hue: number;
  readonly luminance: number;
  readonly saturation: number;
  readonly weight: number;
};

const DEFAULT_HUE = 220;
const MIN_VISIBLE_ALPHA = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHue(hue: number) {
  const normalizedHue = hue % 360;

  return normalizedHue < 0 ? normalizedHue + 360 : normalizedHue;
}

function colorLuminance(sample: ThumbnailColorSample) {
  return (sample.red * 0.299 + sample.green * 0.587 + sample.blue * 0.114) / 255;
}

function rgbToHsl(sample: ThumbnailColorSample) {
  const red = clamp(sample.red, 0, 255) / 255;
  const green = clamp(sample.green, 0, 255) / 255;
  const blue = clamp(sample.blue, 0, 255) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return {
      hue: 0,
      lightness,
      saturation: 0
    };
  }

  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0);
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return {
    hue: hue * 60,
    lightness,
    saturation
  };
}

function hueToRgb(primary: number, secondary: number, hue: number) {
  let normalizedHue = hue;

  if (normalizedHue < 0) {
    normalizedHue += 1;
  }

  if (normalizedHue > 1) {
    normalizedHue -= 1;
  }

  if (normalizedHue < 1 / 6) {
    return primary + (secondary - primary) * 6 * normalizedHue;
  }

  if (normalizedHue < 1 / 2) {
    return secondary;
  }

  if (normalizedHue < 2 / 3) {
    return primary + (secondary - primary) * (2 / 3 - normalizedHue) * 6;
  }

  return primary;
}

function hslToRgb({
  hue,
  lightness,
  saturation
}: {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
}) {
  if (saturation === 0) {
    return {
      blue: lightness,
      green: lightness,
      red: lightness
    };
  }

  const normalizedHue = normalizeHue(hue) / 360;
  const secondary =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const primary = 2 * lightness - secondary;

  return {
    blue: hueToRgb(primary, secondary, normalizedHue - 1 / 3),
    green: hueToRgb(primary, secondary, normalizedHue),
    red: hueToRgb(primary, secondary, normalizedHue + 1 / 3)
  };
}

function channelToHex(channel: number) {
  return Math.round(clamp(channel, 0, 1) * 255)
    .toString(16)
    .padStart(2, "0");
}

function rgbToHex({
  blue,
  green,
  red
}: {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
}) {
  return `#${channelToHex(red)}${channelToHex(green)}${channelToHex(blue)}`;
}

export function createThumbnailColorProfile(
  samples: readonly ThumbnailColorSample[]
): ThumbnailColorProfile | null {
  let hueX = 0;
  let hueY = 0;
  let hueWeightTotal = 0;
  let luminanceTotal = 0;
  let saturationTotal = 0;
  let totalWeight = 0;

  for (const sample of samples) {
    if (sample.alpha < MIN_VISIBLE_ALPHA) {
      continue;
    }

    const hsl = rgbToHsl(sample);
    const alphaWeight = clamp(sample.alpha, 0, 255) / 255;
    const hueWeight = alphaWeight * (0.35 + hsl.saturation);
    const hueRadians = (normalizeHue(hsl.hue) * Math.PI) / 180;

    hueX += Math.cos(hueRadians) * hueWeight;
    hueY += Math.sin(hueRadians) * hueWeight;
    hueWeightTotal += hueWeight;
    luminanceTotal += colorLuminance(sample) * alphaWeight;
    saturationTotal += hsl.saturation * alphaWeight;
    totalWeight += alphaWeight;
  }

  if (totalWeight === 0) {
    return null;
  }

  const saturation = saturationTotal / totalWeight;
  const hueVectorSize = Math.sqrt(hueX * hueX + hueY * hueY);
  const hue =
    saturation < 0.02 || hueWeightTotal === 0 || hueVectorSize < 0.0001
      ? DEFAULT_HUE
      : normalizeHue((Math.atan2(hueY, hueX) * 180) / Math.PI);

  return {
    hue,
    luminance: luminanceTotal / totalWeight,
    saturation,
    weight: totalWeight
  };
}

export function suggestThumbnailBackgroundColor(
  profiles: readonly ThumbnailColorProfile[]
) {
  let hueX = 0;
  let hueY = 0;
  let luminanceTotal = 0;
  let saturationTotal = 0;
  let totalWeight = 0;

  for (const profile of profiles) {
    if (profile.weight <= 0) {
      continue;
    }

    const hueRadians = (normalizeHue(profile.hue) * Math.PI) / 180;
    const hueWeight = profile.weight * (0.35 + profile.saturation);

    hueX += Math.cos(hueRadians) * hueWeight;
    hueY += Math.sin(hueRadians) * hueWeight;
    luminanceTotal += profile.luminance * profile.weight;
    saturationTotal += profile.saturation * profile.weight;
    totalWeight += profile.weight;
  }

  if (totalWeight === 0) {
    return null;
  }

  const luminance = luminanceTotal / totalWeight;
  const saturation = saturationTotal / totalWeight;
  const hueVectorSize = Math.sqrt(hueX * hueX + hueY * hueY);
  const hue =
    saturation < 0.02 || hueVectorSize < 0.0001
      ? DEFAULT_HUE
      : normalizeHue((Math.atan2(hueY, hueX) * 180) / Math.PI);
  const backgroundSaturation = clamp(saturation * 0.35, 0.04, 0.28);
  const lightness = luminance > 0.55 ? 0.12 : 0.92;

  return rgbToHex(
    hslToRgb({
      hue,
      lightness,
      saturation: backgroundSaturation
    })
  );
}

export function suggestThumbnailBackgroundColorFromSamples(
  samples: readonly ThumbnailColorSample[]
) {
  const profile = createThumbnailColorProfile(samples);

  return profile === null ? null : suggestThumbnailBackgroundColor([profile]);
}
