import { MOCKS } from "../mocks";
import { MOCKS as globalMocks } from "../mocks/global/global.mocks"
import { Browser, BrowserContextOptions, expect, Page } from "@playwright/test";
import { Mock } from "../mocks/mock.model";
import { createMocks } from "../mocks/createMocks";
import { MyPage } from "../playwright.config";


export const createNewContext = async (params: {
  browser: Browser,
  baseUrl: string,
  email: string,
  useMocks: boolean,
  login?: boolean,
  contextOptions?: BrowserContextOptions
}): Promise<MyPage> => {
  const { browser, baseUrl, email, useMocks, login, contextOptions } = params
  const context = await browser.newContext({ ...contextOptions });
  const portal = await context.newPage() as Portal;
  portal.createMocks = async (mocks: Mock[]) => {
    return createMocks(portal, mocks, baseUrl)
  }
  if (useMocks) await portal.createMocks(MOCKS);
  if (!useMocks) await portal.createMocks(globalMocks); //globalle Mocks immer setzen
  return portal;
};


export const convertHexToRGB = (hex) => {
  hex = hex.replace(/^#/, "");

  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);

  return {
    hex,
    rgbCSSString: `rgb(${red}, ${green}, ${blue})`,
    red: red,
    green: green,
    blue: blue,
  };
};

export const isSamePayload = (requestPayload, payload, partially = false) => {
  const makeSortedString = (obj) =>
    JSON.stringify(
      Object.keys(obj)
        .sort()
        .reduce((result, key) => ((result[key] = obj[key]), result), {})
    );
  const isPartiallyCorrect = (fullObject, partiallyObject) => {
    for (let key in fullObject) {
      if (!partiallyObject[key]) continue;

      // Überprüfung, ob fullObject[key] ein JSON-Objekt ist
      if (typeof fullObject[key] === 'object' && fullObject[key] !== null) {
        // Rekursiver Aufruf der Funktion mit den verschachtelten Objekten
        if (!isPartiallyCorrect(fullObject[key], partiallyObject[key])) {
          return false;
        }
      } else if (fullObject[key] !== partiallyObject[key]) {
        return false;
      }
    }
    return true;
  };

  if (!partially) return makeSortedString(requestPayload) === makeSortedString(payload);
  return isPartiallyCorrect(requestPayload, payload);

};

/**
 * Checks if a given JSON matches the Payload of a Request. Whole JSON can be compared or parts of it. 
 * You need to set a new context after using this, or otherwise Requests with same Method and URL will be intercepted multiple times.
 * @param page Playwright-Page Object
 * @param data Object with needed data for Request-Interception (url, method, payload to compare)
 * @param strict if true payload of request has to be exact the same as given payload. if false, given fields have to be the same as payload of request. defaults to true
 */
export const checkPayload = async (page, data: { url: string, method: string, payload: Object }, strict = true) => {
  const { url, method, payload } = data;

  const expectSamePayload = (requestPayload, payload, strict) => {
    const makeSortedString = (obj) =>
      JSON.stringify(
        Object.keys(obj)
          .sort()
          .reduce((result, key) => ((result[key] = obj[key]), result), {})
      );
    const expectPartiallyCorrect = (fullObject, partiallyObject) => {
      for (let key in fullObject) {
        if (partiallyObject[key] === undefined) continue;

        if (typeof fullObject[key] === 'object' && fullObject[key] !== null) {
          expectPartiallyCorrect(fullObject[key], partiallyObject[key]);
        } else {
          console.log("expect(" + fullObject[key] + ").toBe(" + partiallyObject[key] + ")");
          expect(fullObject[key]).toBe(partiallyObject[key])
        }
      }
      return true;
    };

    if (strict) expect(makeSortedString(requestPayload)).toBe(makeSortedString(payload));
    if (!strict) expectPartiallyCorrect(requestPayload, payload);

  };

  await page.on("request", (request) => {
    const requestUrl = request.url();
    if (requestUrl.includes(url) && request.method() === method) {
      const requestPayload = request.postDataJSON();
      expectSamePayload(requestPayload, payload, strict);
    }
  });

}

