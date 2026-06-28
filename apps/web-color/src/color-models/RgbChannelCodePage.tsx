import { useMemo, useState } from "react"

import { PlaygroundTools } from "@/playground/PlaygroundIndexPage"
import { PlaygroundStage } from "@/playground/PlaygroundRoute"
import {
  createRgbChannelCodeResult,
  parseRgbChannelInput,
} from "./rgb-channel-code-models.ts"
import {
  GamutCodeCard,
  InputPanel,
  IntroPanel,
  InvalidInputPanel,
} from "./RgbChannelCodePanels.tsx"

const DEFAULT_RGB_CHANNEL_INPUT = "255 0 0"

export function RgbChannelCodePage() {
  const [inputValue, setInputValue] = useState(DEFAULT_RGB_CHANNEL_INPUT)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const parsed = useMemo(() => parseRgbChannelInput(inputValue), [inputValue])
  const result = useMemo(
    () =>
      parsed.status === "parsed" ? createRgbChannelCodeResult(parsed) : null,
    [parsed]
  )
  const pickerValue = result?.hex ?? "#000000"

  function handleCopy(key: string, value: string) {
    setCopiedKey(key)

    if (navigator.clipboard) {
      void navigator.clipboard.writeText(value)
    }
  }

  return (
    <PlaygroundStage
      topStart={<IntroPanel parsed={parsed.status === "parsed"} result={result} />}
      topEnd={
        <InputPanel
          inputValue={inputValue}
          parsed={parsed.status === "parsed"}
          pickerValue={pickerValue}
          onInputChange={setInputValue}
        />
      }
      bottomEnd={
        <div className="hidden sm:block">
          <PlaygroundTools />
        </div>
      }
    >
      <div className="flex size-full items-start justify-center overflow-y-auto px-4 pt-[25rem] pb-56 sm:px-8 sm:pt-72 lg:pt-60">
        <div className="grid w-full max-w-5xl gap-3">
          {result ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {result.cards.map((card) => (
                <GamutCodeCard
                  key={card.id}
                  card={card}
                  copiedKey={copiedKey}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          ) : (
            <InvalidInputPanel />
          )}
        </div>
      </div>
    </PlaygroundStage>
  )
}
