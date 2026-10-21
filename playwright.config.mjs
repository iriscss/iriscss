import { defineConfig, devices } from "@playwright/test";

// WebKit needs system libraries (`sudo npx playwright install-deps webkit`),
// so it runs in CI and wherever IRIS_WEBKIT is set
const webkit = process.env.CI || process.env.IRIS_WEBKIT;

export default defineConfig({
  testDir: "tests",
  reporter: process.env.CI ? "github" : "list",
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    ...(webkit
      ? [{ name: "webkit", use: { ...devices["Desktop Safari"] } }]
      : []),
  ],
});
