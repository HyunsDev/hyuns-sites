import { useMemo, useState } from "react"

import { PlaygroundTools } from "@/playground/PlaygroundIndexPage"
import { PlaygroundStage } from "@/playground/PlaygroundRoute"
import {
  createSrgbP3CompareResult,
  parseSrgbP3CompareInput,
} from "./srgb-p3-compare-models.ts"
import {
  CodeCard,
  InputPanel,
  IntroPanel,
  InvalidColorPanel,
  SwatchComparison,
} from "./SrgbP3ComparePanels.tsx"

const DEFAULT_COMPARE_INPUT = "color(display-p3 1 0 0)"

export function SrgbP3ComparePage() {
  const [inputValue, setInputValue] = useState(DEFAULT_COMPARE_INPUT)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const parsed = useMemo(
    () => parseSrgbP3CompareInput(inputValue),
    [inputValue]
  )
  const result = useMemo(
    () =>
      parsed.status === "parsed"
        ? createSrgbP3CompareResult(parsed.color)
        : null,
    [parsed]
  )
  const pickerValue = result?.srgbPreviewHex ?? "#000000"

  function handleCopy(key: string, value: string) {
    setCopiedKey(key)

    if (navigator.clipboard) {
      void navigator.clipboard.writeText(value)
    }
  }

  return (
    <PlaygroundStage
      topStart={
        <IntroPanel
          parsed={parsed.status === "parsed"}
          result={result}
        />
      }
      topEnd={
        <InputPanel
          inputValue={inputValue}
          pickerValue={pickerValue}
          parsed={parsed.status === "parsed"}
          onInputChange={setInputValue}
        />
      }
      bottomEnd={
        <div className="hidden sm:block">
          <PlaygroundTools />
        </div>
      }
    >
      <div className="flex size-full items-start justify-center overflow-y-auto px-4 pt-[26rem] pb-56 sm:px-8 sm:pt-80 lg:pt-64">
        <div className="grid w-full max-w-5xl gap-3">
          {result ? (
            <>
              <div className="grid gap-3 lg:grid-cols-2">
                <CodeCard
                  title="sRGB"
                  description="일반 웹 fallback으로 사용할 수 있는 sRGB 코드입니다."
                  rows={result.srgbRows}
                  copiedKey={copiedKey}
                  copyPrefix="srgb"
                  onCopy={handleCopy}
                />
                <CodeCard
                  title="Display P3"
                  description="wide-gamut 디스플레이에서 유지할 수 있는 P3 코드입니다."
                  rows={result.displayP3Rows}
                  copiedKey={copiedKey}
                  copyPrefix="p3"
                  onCopy={handleCopy}
                />
              </div>
              <SwatchComparison swatches={result.swatches} />
            </>
          ) : (
            <InvalidColorPanel />
          )}
        </div>
      </div>
    </PlaygroundStage>
  )
}
