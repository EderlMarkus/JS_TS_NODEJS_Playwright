import { defineConfig, test as base } from "@playwright/test";
import { config } from "./config.local";
import { createMocks } from "./mocks/createMocks";
import { MOCKS } from "./mocks";
import { log } from "./custom/functions";

export const localConfig = config;

export const test = base.extend({
  page: async ({ page }, use) => {
    if (config.useMocks) {
      await createMocks(page, MOCKS);
    }
    log("mocks created");
    await page.goto(`${localConfig.baseUrl}`);
    await use(page);
  },
});

export default defineConfig({
  fullyParallel: true,
  workers: 3,
  timeout: 5 * 60 * 1000,
  retries: 2,
  reporter: [["html", { outputFolder: "reports" }]],
  projects: [
    {
      name: "chrome",
      use: {
        headless: true,
        launchOptions: {
          executablePath:
            "C:/Entwicklung/playwright/chromium-win64/chrome-win/chrome.exe",
        },
      },
    },
  ],
});
