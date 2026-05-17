import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./tests/global-setup.ts",
    include: ["tests/**/*.test.ts"],
    testTimeout: 30000,
    hookTimeout: 180000,
    pool: "forks",
    fileParallelism: false,
  },
});
