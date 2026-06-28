export type RgbByteChannels = {
  readonly b: number
  readonly g: number
  readonly r: number
}

export type RgbChannelParseResult =
  | {
      readonly channels: RgbByteChannels
      readonly inputType: "hex" | "triplet"
      readonly status: "parsed"
    }
  | {
      readonly status: "invalid"
    }

export type RgbChannelCodeRow = {
  readonly id: string
  readonly label: string
  readonly value: string
}

export type RgbChannelGamutCard = {
  readonly description: string
  readonly id: "display-p3" | "srgb"
  readonly rows: readonly RgbChannelCodeRow[]
  readonly swatchColor: string
  readonly title: string
}

export type RgbChannelCodeResult = {
  readonly cards: readonly RgbChannelGamutCard[]
  readonly channels: RgbByteChannels
  readonly hex: string
  readonly inputType: "hex" | "triplet"
}

export const RGB_CHANNEL_CODE_PRESETS = [
  "255 0 0",
  "0 255 0",
  "0 0 255",
  "255 255 255",
  "#ff5a3d",
] as const

const HEX_COLOR_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i
const RGB_TRIPLET_PATTERN = /^(\d{1,3})(?:[\s,]+)(\d{1,3})(?:[\s,]+)(\d{1,3})$/

export function parseRgbChannelInput(input: string): RgbChannelParseResult {
  const trimmedInput = input.trim()
  const hexMatch = HEX_COLOR_PATTERN.exec(trimmedInput)

  if (hexMatch) {
    const hexValue = hexMatch[1]

    if (hexValue) {
      return {
        channels: parseHexChannels(hexValue),
        inputType: "hex",
        status: "parsed",
      }
    }
  }

  const tripletMatch = RGB_TRIPLET_PATTERN.exec(trimmedInput)

  if (tripletMatch) {
    const channels = parseTripletChannels(tripletMatch)

    if (channels) {
      return { channels, inputType: "triplet", status: "parsed" }
    }
  }

  return { status: "invalid" }
}

export function createRgbChannelCodeResult(
  parsed: Extract<RgbChannelParseResult, { readonly status: "parsed" }>
): RgbChannelCodeResult {
  const { channels } = parsed
  const srgbCss = formatNormalizedColor("srgb", channels)
  const displayP3Css = formatNormalizedColor("display-p3", channels)

  return {
    cards: [
      {
        description: "같은 byte 채널을 sRGB 좌표로 해석한 코드입니다.",
        id: "srgb",
        rows: [
          {
            id: "raw",
            label: "0-255 channel",
            value: formatByteColor("srgb", channels),
          },
          { id: "css", label: "CSS valid", value: srgbCss },
          { id: "hex", label: "Hex", value: formatHexChannels(channels) },
        ],
        swatchColor: srgbCss,
        title: "sRGB",
      },
      {
        description: "같은 byte 채널을 Display P3 좌표로 해석한 코드입니다.",
        id: "display-p3",
        rows: [
          {
            id: "raw",
            label: "0-255 channel",
            value: formatByteColor("p3", channels),
          },
          { id: "css", label: "CSS valid", value: displayP3Css },
          { id: "fallback", label: "sRGB hex fallback", value: formatHexChannels(channels) },
        ],
        swatchColor: displayP3Css,
        title: "Display P3",
      },
    ],
    channels,
    hex: formatHexChannels(channels),
    inputType: parsed.inputType,
  }
}

function parseHexChannels(hexValue: string): RgbByteChannels {
  const normalizedHex =
    hexValue.length === 3
      ? [...hexValue].map((channel) => `${channel}${channel}`).join("")
      : hexValue

  return {
    r: Number.parseInt(normalizedHex.slice(0, 2), 16),
    g: Number.parseInt(normalizedHex.slice(2, 4), 16),
    b: Number.parseInt(normalizedHex.slice(4, 6), 16),
  }
}

function parseTripletChannels(
  match: RegExpExecArray
): RgbByteChannels | null {
  const r = parseByteChannel(match[1])
  const g = parseByteChannel(match[2])
  const b = parseByteChannel(match[3])

  return r === null || g === null || b === null ? null : { r, g, b }
}

function parseByteChannel(value: string | undefined) {
  if (!value) {
    return null
  }

  const channel = Number(value)

  return Number.isInteger(channel) && channel >= 0 && channel <= 255
    ? channel
    : null
}

function formatByteColor(space: "p3" | "srgb", channels: RgbByteChannels) {
  return `color(${space} ${channels.r} ${channels.g} ${channels.b})`
}

function formatNormalizedColor(
  space: "display-p3" | "srgb",
  channels: RgbByteChannels
) {
  return `color(${space} ${formatUnitChannel(channels.r)} ${formatUnitChannel(channels.g)} ${formatUnitChannel(channels.b)})`
}

function formatUnitChannel(value: number) {
  const unitValue = value / 255

  return Number.isInteger(unitValue)
    ? String(unitValue)
    : unitValue.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")
}

function formatHexChannels({ b, g, r }: RgbByteChannels) {
  return `#${formatHexByte(r)}${formatHexByte(g)}${formatHexByte(b)}`
}

function formatHexByte(value: number) {
  return value.toString(16).padStart(2, "0")
}
