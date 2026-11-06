import { defineConfig } from "vitest/config";
export default defineConfig({test:{include:["experiments/coach/lib/*.test.ts"],environment:"node"}});
