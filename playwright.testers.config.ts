import { defineConfig, devices } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";
process.env.REHEARSAL_TEST_TOKEN ??= randomBytes(32).toString("hex");
export default defineConfig({
  testDir: "./tests/testers",
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "output/playwright/tester-results",
  use: {
    baseURL: "http://127.0.0.1:3003",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    {
      name: "webkit-mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "webkit" },
    },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
  webServer: {
    cwd: resolve("."),
    command: "npm run start -- --hostname 127.0.0.1 --port 3003",
    url: "http://127.0.0.1:3003",
    reuseExistingServer: false,
    timeout: 60000,
    env: { REHEARSAL_TESTERS_ENABLED: "1" },
  },
});
