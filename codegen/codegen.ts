import { MOCKS } from "../mocks/index.js";
import { createMocks } from "../mocks/createMocks.ts";
import { chromium } from "@playwright/test";
import { localConfig } from "../playwright.config.ts";
import { config } from "../config.local.ts";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  if (config.useMocks) await createMocks(page, MOCKS);
  await page.goto(`${localConfig.baseUrl}`);
  await page.pause();
})();
