import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainProvider } from "@hyunsdev/ui/components/main-provider";

import { App } from "@/app";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <MainProvider>
      <App />
    </MainProvider>
  </StrictMode>
);
