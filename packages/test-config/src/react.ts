import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig, type UserConfig } from "vitest/config";

export function defineReactTestConfig(config: UserConfig = {}) {
  return mergeConfig(
    defineConfig({
      plugins: [react()],
      test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"]
      }
    }),
    config
  );
}
