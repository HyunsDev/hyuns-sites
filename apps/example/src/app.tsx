import { Button } from "@hyunsdev/ui";

export function App() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-normal sm:text-6xl">
            hyuns-sites
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            Vite, React, TypeScript, TailwindCSS, Turbo, npm의 @hyunsdev/ui,
            그리고 @workspace/site-ui를 함께 쓰는 기본 개발환경입니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button>Primary action</Button>
            <Button variant="outline">Secondary action</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
