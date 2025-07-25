import { defineConfig, test as base, Page } from "@playwright/test";
import { createMocks } from "./mocks/createMocks";
import { MOCKS } from "./mocks";
import { log } from "./custom/functions";
import { Mock } from "./mocks/mock.model";


export type MyPage = Page & {
  createMocks: (mocks: Mock[]) => Promise<void>;

}

export type MyOptions = {
  myPage: MyPage;
  baseUrl: string,
  useMocks: boolean,
  logging: boolean,
}

export const test = base.extend<MyOptions>({
  useMocks: async ({ }, use, testInfo) => {
    await use((testInfo.project.use as any).useMocks as boolean);
  },
  logging: async ({ }, use, testInfo) => {
    await use((testInfo.project.use as any).logging as boolean);
  },
  baseUrl: async ({ }, use, testInfo) => {
    await use((testInfo.project.use as any).baseUrl as string);
  },
  myPage: async ({ page }, use, testInfo) => {
    const myPage = page as MyPage;
    const useMocks = (testInfo.project.use as any).useMocks as boolean;
    const logging = (testInfo.project.use as any).logging as boolean;
    const baseUrl = (testInfo.project.use as any).baseUrl as string;

    myPage.createMocks = async (
      mocks: Mock[],
    ) => {
      return createMocks(myPage, mocks, baseUrl);
    }
    if (useMocks) {
      await myPage.createMocks(MOCKS);
      if (logging) {
        log("mocks created");
      }
    }
    await myPage.goto(baseUrl);
    await use(myPage);
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
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        },
        baseUrl: "https://ederlmarkus.github.io/JS_ANGULAR_Performance/",
        useMocks: false,
        logging: false,
        tokenConfig: null,
      } as any,
    },
  ],
});
