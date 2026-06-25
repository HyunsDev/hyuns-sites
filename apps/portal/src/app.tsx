import { useState } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { MainProvider } from "@hyunsdev/ui/components/main-provider";
import { getRouter } from "./router";

type AppProps = {
  router?: ReturnType<typeof getRouter>;
};

export function App({ router }: AppProps) {
  const [defaultRouter] = useState(() => getRouter());

  return (
    <MainProvider>
      <RouterProvider router={router ?? defaultRouter} />
    </MainProvider>
  );
}
