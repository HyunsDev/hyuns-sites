import { describe, expect, it } from "vitest";
import {
  createThumbnailColorProfile,
  suggestThumbnailBackgroundColor,
  suggestThumbnailBackgroundColorFromSamples
} from "./thumbnail-background";
import type { ThumbnailColorSample, ThumbnailColorProfile } from "./thumbnail-background";

function sample(red: number, green: number, blue: number, alpha = 255): ThumbnailColorSample {
  return { alpha, blue, green, red };
}

function requireColor(color: string | null) {
  if (color === null) {
    throw new Error("Expected a suggested background color.");
  }

  return color;
}

function requireProfile(profile: ThumbnailColorProfile | null) {
  if (profile === null) {
    throw new Error("Expected a thumbnail color profile.");
  }

  return profile;
}

function luminanceFromHex(color: string) {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);

  return (red * 0.299 + green * 0.587 + blue * 0.114) / 255;
}

describe("thumbnail background suggestions", () => {
  it("suggests a light muted background for dark images", () => {
    const background = requireColor(
      suggestThumbnailBackgroundColorFromSamples([
        sample(8, 32, 72),
        sample(12, 44, 96),
        sample(4, 24, 48)
      ])
    );

    expect(background).toMatch(/^#[0-9a-f]{6}$/);
    expect(luminanceFromHex(background)).toBeGreaterThan(0.75);
  });

  it("suggests a dark muted background for bright images", () => {
    const background = requireColor(
      suggestThumbnailBackgroundColorFromSamples([
        sample(244, 246, 248),
        sample(238, 242, 246),
        sample(250, 250, 250)
      ])
    );

    expect(background).toMatch(/^#[0-9a-f]{6}$/);
    expect(luminanceFromHex(background)).toBeLessThan(0.3);
  });

  it("returns null when every sample is transparent", () => {
    expect(suggestThumbnailBackgroundColorFromSamples([sample(255, 0, 0, 0)])).toBeNull();
    expect(suggestThumbnailBackgroundColorFromSamples([])).toBeNull();
  });

  it("merges multiple image profiles deterministically", () => {
    const blueProfile = requireProfile(createThumbnailColorProfile([sample(20, 82, 160)]));
    const orangeProfile = requireProfile(createThumbnailColorProfile([sample(232, 136, 32)]));

    const first = suggestThumbnailBackgroundColor([blueProfile, orangeProfile]);
    const second = suggestThumbnailBackgroundColor([blueProfile, orangeProfile]);

    expect(first).toBe(second);
    expect(requireColor(first)).toMatch(/^#[0-9a-f]{6}$/);
  });
});
