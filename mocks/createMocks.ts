import { log } from "../custom/functions";
import { localConfig } from "../playwright.config";
import { MOCKS as globalMocks } from "./global/global.mocks";
import { Mock } from "./mock.model";

export async function createMocks(page, mocks: Mock[] = globalMocks) {
  mocks.map(async (element) => {
    if (element.response || element.responses?.length) {
      const url = element.url.startsWith("http")
        ? element.url
        : `${localConfig.baseUrl}/${element.url}`;
      const responses = element.responses;
      const isCorrectMethod = (method) => method === "POST" || method === "PUT";
      const isSamePostData = (requestBody, postData) => {
        const makeSortedString = (obj) =>
          JSON.stringify(
            Object.keys(obj)
              .sort()
              .reduce((result, key) => ((result[key] = obj[key]), result), {})
          );
        return makeSortedString(requestBody) === makeSortedString(postData);
      };

      if (responses?.length) {
        await page.route(url, async (route) => {
          const postData = JSON.parse(route.request().postData());
          const matchingElement = responses?.find(
            (response) =>
              isSamePostData(response.request?.payload, postData) &&
              isCorrectMethod(response.request?.method)
          );
          log("url", url);
          log("matchingElement", matchingElement);
          if (matchingElement) {
            log(url + ": fulfills with matchingElement.response");
            await route.fulfill({
              status: matchingElement.status ?? 200,
              json: matchingElement.response,
            });
          } else if (element.response) {
            log(url + ": fulfills with default response 1");
            await route.fulfill({
              status: element.status ?? 200,
              json: element.response,
            });
          } else {
            await route.continue();
          }
        });
        return;
      }

      if (element.response && !element.responses?.length) {
        log(url + ": fulfills with default response 2");
        await page.route(
          url,
          async (route) =>
            await route.fulfill({
              status: element.status ?? 200,
              json: element.response,
            })
        );
        return;
      }
      if (!element.response && !element.responses?.length) {
        log(url + ": route continues");
        await page.route(url, async (route) => await route.continue());
      }
    }
  });
}
