// vitest.integration.config.ts
import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"

export default defineConfig({
  test: {
    include: ["src/**/*.integration.test.ts"],
    fileParallelism: false, // comparten BD
    globalSetup: ["./tests/integration/global-setup.ts"],
    env: loadEnv("test", process.cwd(), ""), // carga .env.test
    testTimeout: 15000,
  },
})