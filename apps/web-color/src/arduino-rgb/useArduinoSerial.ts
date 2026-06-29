import { useCallback, useRef, useState } from "react"

import type { ArduinoRgb } from "@/arduino-rgb/arduino-rgb-models"
import {
  ArduinoSerialError,
  closePort,
  getInitialConnectionState,
  isSerialSupported,
  readSerialLines,
  releaseReader,
  releaseWriter,
  toErrorMessage,
} from "@/arduino-rgb/arduino-serial-runtime"
import type { ArduinoSerialPort } from "@/arduino-rgb/arduino-serial-runtime"
import {
  ARDUINO_RGB_BAUD_RATE,
  formatRgbCommand,
  parseArduinoRgbResponse,
} from "@/arduino-rgb/arduino-rgb-protocol"

export type SerialConnectionState =
  | "connected"
  | "connecting"
  | "disconnected"
  | "unsupported"

export type ArduinoSerialState = {
  readonly connectionState: SerialConnectionState
  readonly errorMessage: string | null
  readonly lastCommand: string | null
  readonly lastLine: string | null
  readonly lastReceivedRgb: ArduinoRgb | null
  readonly lastSentRgb: ArduinoRgb | null
}

const encoder = new TextEncoder()

export function useArduinoSerial() {
  const [serialState, setSerialState] = useState<ArduinoSerialState>(() => ({
    connectionState: getInitialConnectionState(),
    errorMessage: null,
    lastCommand: null,
    lastLine: null,
    lastReceivedRgb: null,
    lastSentRgb: null,
  }))
  const portRef = useRef<ArduinoSerialPort | null>(null)
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null)
  const connectionStateRef = useRef<SerialConnectionState>(
    serialState.connectionState
  )
  const writeChainRef = useRef<Promise<void>>(Promise.resolve())

  const setConnectionState = useCallback((state: SerialConnectionState) => {
    connectionStateRef.current = state
    setSerialState((current) => ({ ...current, connectionState: state }))
  }, [])

  const disconnect = useCallback(async () => {
    setConnectionState(isSerialSupported() ? "disconnected" : "unsupported")

    await releaseReader(readerRef)
    releaseWriter(writerRef)
    await closePort(portRef)
  }, [setConnectionState])

  const startReadLoop = useCallback(() => {
    const port = portRef.current
    const readable = port?.readable

    if (!readable) {
      return
    }

    const reader = readable.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    readerRef.current = reader

    void readSerialLines({
      buffer,
      decoder,
      reader,
      onBufferChange: (nextBuffer) => {
        buffer = nextBuffer
      },
      onLine: (line) => {
        const response = parseArduinoRgbResponse(line)
        setSerialState((current) => ({
          ...current,
          lastLine: line,
          lastReceivedRgb:
            response.kind === "ok" || response.kind === "status"
              ? response.rgb
              : current.lastReceivedRgb,
          errorMessage:
            response.kind === "error" ? response.message : current.errorMessage,
        }))
      },
      onReadError: (error) => {
        if (connectionStateRef.current === "connected") {
          setSerialState((current) => ({
            ...current,
            errorMessage: toErrorMessage(error),
          }))
        }
      },
      onRelease: () => {
        if (readerRef.current === reader) {
          readerRef.current = null
        }
      },
    })
  }, [])

  const connect = useCallback(async (): Promise<boolean> => {
    const serial = navigator.serial

    if (!serial) {
      setConnectionState("unsupported")
      return false
    }

    setConnectionState("connecting")
    setSerialState((current) => ({ ...current, errorMessage: null }))

    try {
      const port = await serial.requestPort()
      await port.open({ baudRate: ARDUINO_RGB_BAUD_RATE })

      if (!port.writable) {
        throw new ArduinoSerialError("Serial port is not writable.")
      }

      portRef.current = port
      writerRef.current = port.writable.getWriter()
      setConnectionState("connected")
      startReadLoop()

      return true
    } catch (error) {
      await disconnect()
      setSerialState((current) => ({
        ...current,
        errorMessage: toErrorMessage(error),
      }))

      return false
    }
  }, [disconnect, setConnectionState, startReadLoop])

  const writeLine = useCallback(
    async (line: string, sentRgb: ArduinoRgb | null): Promise<boolean> => {
      const writer = writerRef.current

      if (connectionStateRef.current !== "connected" || !writer) {
        return false
      }

      const command = line.trim()
      let didWrite = true
      const writeTask = writeChainRef.current
        .then(async () => {
          await writer.write(encoder.encode(line))
          setSerialState((current) => ({
            ...current,
            errorMessage: null,
            lastCommand: command,
            lastSentRgb: sentRgb ?? current.lastSentRgb,
          }))
        })
        .catch((error: unknown) => {
          didWrite = false
          setSerialState((current) => ({
            ...current,
            errorMessage: toErrorMessage(error),
          }))
        })

      writeChainRef.current = writeTask
      await writeTask

      return didWrite
    },
    []
  )

  const sendRgb = useCallback(
    (rgb: ArduinoRgb) => writeLine(formatRgbCommand(rgb), rgb),
    [writeLine]
  )
  const requestStatus = useCallback(() => writeLine("STATUS\n", null), [
    writeLine,
  ])
  const turnOff = useCallback(
    (rgb: ArduinoRgb) => writeLine("OFF\n", rgb),
    [writeLine]
  )

  return {
    ...serialState,
    connect,
    disconnect,
    requestStatus,
    sendRgb,
    turnOff,
  }
}
