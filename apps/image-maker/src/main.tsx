import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { MainProvider } from "@hyunsdev/ui/components/main-provider";
import { getRouter } from "./router";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing #root element for Image Maker.");
}

const router = getRouter();

createRoot(rootElement).render(
  <StrictMode>
    <MainProvider>
      <RouterProvider router={router} />
    </MainProvider>
  </StrictMode>
);

