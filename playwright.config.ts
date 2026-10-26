import { defineConfig, devices } from "@playwright/test";
const staticPreview = process.env.NURTUREPATH_STATIC_PREVIEW === "1";
const baseURL = staticPreview
  ? "http://127.0.0.1:3001"
  : "http://127.0.0.1:3000";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"]],
  outputDir: "output/playwright/results",
  use: {
    baseURL,
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
    command: staticPreview
      ? "npm run serve:preview"
      : "npm run start -- --hostname 127.0.0.1",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
