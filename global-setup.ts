import { test as setup, chromium } from "@playwright/test";
import { createMocks } from "./mocks/createMocks";
import { MOCKS as globalMocks } from "./mocks/global/global.mocks";
import { MOCKS as auftraegeMocks } from "./mocks/auftraege/auftraege.mocks";
import { MOCKS as kontoMocks } from "./mocks/konto/konto.mocks";
import { log } from "./playwright.config";

setup("create Mocks", async ({ page }) => {
  await createMocks(page, [...globalMocks, ...auftraegeMocks, ...kontoMocks]);
  log("mocks created");
});
