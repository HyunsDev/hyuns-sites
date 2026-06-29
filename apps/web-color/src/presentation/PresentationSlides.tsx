import { CodeBlock } from "@hyunsdev/ui/components/code-block"

import { PresentationSolidModelVisual } from "@/presentation/PresentationSolidModelVisual"

const CSS_COLOR_NOTATION_CODE = `color: #ff0000;
color: rgb(255 0 0);
color: hsl(0 100% 50%);
color: oklch(62.8% 0.2577 29.23);`

export function IntroPresentationSlide() {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label="RGB부터 OKLCH까지"
    >
      <PresentationSolidModelVisual />
      <div className="absolute inset-x-[8%] top-[72%] grid justify-items-center gap-[2cqh] text-center">
        <h1 className="max-w-[34ch] text-[clamp(1.65rem,4.8cqw,3.25rem)] leading-[1.18] font-bold tracking-normal text-balance">
          <span className="block">RGB부터 OKLCH까지</span>
          <span className="block">/ 당신이 OKLCH를 사용해야 하는 이유</span>
        </h1>
        <p className="text-[clamp(0.95rem,1.85cqw,2.25rem)] leading-[1.32] font-semibold tracking-normal">
          Yourssu FE | Hyuns
        </p>
      </div>
    </section>
  )
}

export function CssColorNotationSlide() {
  return (
    <section
      className="@container/slide relative size-full overflow-hidden bg-background-secondary text-text-normal"
      aria-label="CSS의 다양한 색 표기법"
    >
      <h1 className="absolute top-[12%] left-[6.8%] text-[clamp(1.25rem,2.9cqw,2.5rem)] leading-[1.2] font-bold tracking-normal">
        CSS의 다양한 색 표기법
      </h1>
      <div className="absolute top-1/2 left-1/2 w-[min(66cqw,44rem)] -translate-x-1/2 -translate-y-1/2">
        <CodeBlock
          code={CSS_COLOR_NOTATION_CODE}
          lang="css"
          showCopyButton={false}
          wrapLongLines
          className="border-0 bg-transparent shadow-none [&_.shiki]:!bg-transparent [&_.shiki_span]:!text-text-normal [&>div:last-child]:py-0 [&>div:last-child]:text-[clamp(1.1rem,2.5cqw,2rem)]"
        />
      </div>
    </section>
  )
}
