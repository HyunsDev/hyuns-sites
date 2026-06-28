import type { RefObject } from "react"

export type ArduinoSerial = {
  readonly requestPort: () => Promise<ArduinoSerialPort>
}

export type ArduinoSerialPort = {
  readonly readable: ReadableStream<Uint8Array> | null
  readonly writable: WritableStream<Uint8Array> | null
  readonly close: () => Promise<void>
  readonly open: (options: ArduinoSerialOpenOptions) => Promise<void>
}

type ArduinoSerialOpenOptions = {
  readonly baudRate: number
}

declare global {
  interface Navigator {
    readonly serial?: ArduinoSerial
  }
}

export class ArduinoSerialError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ArduinoSerialError"
  }
}

export type SerialLineReaderOptions = {
  readonly buffer: string
  readonly decoder: TextDecoder
  readonly onBufferChange: (buffer: string) => void
  readonly onLine: (line: string) => void
  readonly onReadError: (error: unknown) => void
  readonly onRelease: () => void
  readonly reader: ReadableStreamDefaultReader<Uint8Array>
}

export async function readSerialLines({
  buffer,
  decoder,
  onBufferChange,
  onLine,
  onReadError,
  onRelease,
  reader,
}: SerialLineReaderOptions): Promise<void> {
  let nextBuffer = buffer

  try {
    let shouldRead = true

    while (shouldRead) {
      const result = await reader.read()

      if (result.done) {
        shouldRead = false
      } else if (result.value) {
        nextBuffer = emitSerialLines({
          buffer: nextBuffer,
          chunk: decoder.decode(result.value, { stream: true }),
          onLine,
        })
        onBufferChange(nextBuffer)
      }
    }
  } catch (error) {
    onReadError(error)
  } finally {
    reader.releaseLock()
    onRelease()
  }
}

export async function releaseReader(
  readerRef: RefObject<ReadableStreamDefaultReader<Uint8Array> | null>
): Promise<void> {
  const reader = readerRef.current

  if (!reader) {
    return
  }

  readerRef.current = null

  try {
    await reader.cancel()
  } catch (error) {
    if (error instanceof Error && error.name !== "TypeError") {
      throw error
    }
  }
}

export function releaseWriter(
  writerRef: RefObject<WritableStreamDefaultWriter<Uint8Array> | null>
): void {
  const writer = writerRef.current

  if (writer) {
    writerRef.current = null
    writer.releaseLock()
  }
}

export async function closePort(
  portRef: RefObject<ArduinoSerialPort | null>
): Promise<void> {
  const port = portRef.current

  if (port) {
    portRef.current = null
    await port.close()
  }
}

export function getInitialConnectionState(): "disconnected" | "unsupported" {
  return isSerialSupported() ? "disconnected" : "unsupported"
}

export function isSerialSupported(): boolean {
  return typeof navigator !== "undefined" && navigator.serial !== undefined
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "Unknown serial error."
}

function emitSerialLines({
  buffer,
  chunk,
  onLine,
}: {
  readonly buffer: string
  readonly chunk: string
  readonly onLine: (line: string) => void
}): string {
  const lines = `${buffer}${chunk}`.split(/\r?\n/)
  const nextBuffer = lines.pop() ?? ""

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed) {
      onLine(trimmed)
    }
  }

  return nextBuffer
}
