import { useMemo, useState } from "react"
import {
  PowerIcon,
  RefreshCwIcon,
  UnplugIcon,
  UsbIcon,
} from "lucide-react"

import { Button } from "@hyunsdev/ui/components/button"
import {
  Readout,
  StatusBadge,
} from "@/arduino-rgb/ArduinoRgbControls"
import { ArduinoRgbSurfaceControls } from "@/arduino-rgb/ArduinoRgbSurfaceControls"
import { connectionLabel } from "@/arduino-rgb/arduino-serial-labels"
import {
  DEFAULT_ARDUINO_RGB,
  formatArduinoRgb,
  getColorModelDefinition,
} from "@/arduino-rgb/arduino-rgb-models"
import type { ArduinoRgb, ColorModelId } from "@/arduino-rgb/arduino-rgb-models"
import {
  getColorModelPlaneById,
  getColorModelPlanes,
  getPreferredColorModelPlane,
} from "@/arduino-rgb/arduino-rgb-plane-models"
import { formatRgbCommand } from "@/arduino-rgb/arduino-rgb-protocol"
import { useArduinoSerial } from "@/arduino-rgb/useArduinoSerial"
import { PlaygroundCenter } from "@/playground/PlaygroundRoute"

const OFF_RGB: ArduinoRgb = { r: 0, g: 0, b: 0 }

export function ArduinoRgbPage() {
  const serial = useArduinoSerial()
  const [modelId, setModelId] = useState<ColorModelId>("rgb")
  const [values, setValues] = useState<readonly number[]>(() =>
    getColorModelDefinition("rgb").fromRgb(DEFAULT_ARDUINO_RGB)
  )
  const [planeId, setPlaneId] = useState(
    () => getPreferredColorModelPlane(getColorModelDefinition("rgb")).id
  )
  const model = useMemo(() => getColorModelDefinition(modelId), [modelId])
  const rgb = useMemo(() => model.toRgb(values), [model, values])
  const planes = useMemo(() => getColorModelPlanes(model), [model])
  const activePlane = useMemo(
    () => getColorModelPlaneById({ model, planeId }),
    [model, planeId]
  )

  const selectModel = (nextModelId: ColorModelId) => {
    const nextModel = getColorModelDefinition(nextModelId)

    setModelId(nextModelId)
    setValues(nextModel.fromRgb(rgb))
    setPlaneId(getPreferredColorModelPlane(nextModel).id)
  }

  const setRgb = (nextRgb: ArduinoRgb) => {
    setValues(model.fromRgb(nextRgb))
  }

  const updateValues = (nextValues: readonly number[]) => {
    const nextRgb = model.toRgb(nextValues)

    setValues(nextValues)
    void serial.sendRgb(nextRgb)
  }

  const connect = async () => {
    const connected = await serial.connect()

    if (connected) {
      await serial.sendRgb(rgb)
    }
  }

  const turnOff = async () => {
    setRgb(OFF_RGB)
    await serial.turnOff(OFF_RGB)
  }

  return (
    <PlaygroundCenter title="Arduino RGB" width="min(calc(100vw - 4rem), 64rem)">
      <div className="mx-auto grid w-full max-w-4xl gap-3 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <section className="grid gap-3 rounded-md border border-border bg-background-primary/90 p-3 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge state={serial.connectionState} />
            <code className="text-[0.68rem] text-text-muted">115200 baud</code>
          </div>
          <div
            className="min-h-52 rounded-md border border-border shadow-inner"
            style={{ backgroundColor: formatArduinoRgb(rgb) }}
            aria-label="Current color preview"
          />
          <Readout label="Preview" value={formatArduinoRgb(rgb)} />
          <Readout
            label="Sent RGB"
            value={
              serial.lastSentRgb ? formatArduinoRgb(serial.lastSentRgb) : "-"
            }
          />
          <Readout
            label="Command"
            value={serial.lastCommand ?? formatRgbCommand(rgb).trim()}
          />
        </section>

        <ArduinoRgbSurfaceControls
          activePlane={activePlane}
          model={model}
          modelId={modelId}
          planes={planes}
          values={values}
          onModelSelect={selectModel}
          onPlaneSelect={setPlaneId}
          onValuesChange={updateValues}
        >
          <div className="grid gap-2 sm:grid-cols-4">
            <Button
              type="button"
              variant="accent"
              disabled={
                serial.connectionState === "connected" ||
                serial.connectionState === "connecting" ||
                serial.connectionState === "unsupported"
              }
              className="justify-center"
              onClick={() => {
                void connect()
              }}
            >
              <UsbIcon />
              Connect
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={serial.connectionState !== "connected"}
              className="justify-center"
              onClick={() => {
                void serial.disconnect()
              }}
            >
              <UnplugIcon />
              Disconnect
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={serial.connectionState !== "connected"}
              className="justify-center"
              onClick={() => {
                void turnOff()
              }}
            >
              <PowerIcon />
              Off
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={serial.connectionState !== "connected"}
              className="justify-center"
              onClick={() => {
                void serial.requestStatus()
              }}
            >
              <RefreshCwIcon />
              Status
            </Button>
          </div>
        </ArduinoRgbSurfaceControls>

        <section className="grid gap-2 rounded-md border border-border bg-background-primary/90 p-3 shadow-sm backdrop-blur lg:col-span-2">
          <div className="grid gap-2 sm:grid-cols-3">
            <Readout
              label="Arduino"
              value={
                serial.lastReceivedRgb
                  ? formatArduinoRgb(serial.lastReceivedRgb)
                  : serial.lastLine ?? "-"
              }
            />
            <Readout label="Model" value={model.label} />
            <Readout
              label="Serial"
              value={serial.errorMessage ?? connectionLabel(serial.connectionState)}
              tone={serial.errorMessage ? "error" : "normal"}
            />
          </div>
        </section>
      </div>
    </PlaygroundCenter>
  )
}
