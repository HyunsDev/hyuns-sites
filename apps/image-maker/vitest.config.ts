import path from "node:path";
import { defineReactTestConfig } from "@workspace/test-config/react";

export default defineReactTestConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src")
    }
  }
});
