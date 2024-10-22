import { expect } from "@playwright/test";
import { test } from "../playwright.config";
import { Mock } from "../mocks/mock.model";
import { MOCKS } from "../mocks/global/global.mocks";
import { createMocks } from "../mocks/createMocks";

test.describe("Tests", () => {
  test("navigates to Product Table and shows correct Product", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("menuitem", { name: "Table" }).click();
    await expect(
      page.getByText("Essence Mascara Lash Princess Gemockt", { exact: true })
    ).toBeVisible();
  });

  test("navigates to Product Table and shows correct Product with mocked Data in Test", async ({
    page,
  }) => {
    const mock: Mock = {
      url: "https://dummyjson.com/products",
      response: {
        products: [
          {
            ...MOCKS[0]?.response?.products[0],
            title: "Essence Mascara Lash Princess Gemockt im Test",
          },
        ],
        total: 1,
        skip: 0,
        limit: 30,
      },
    };
    await createMocks(page, [mock]);
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("menuitem", { name: "Table" }).click();
    await expect(
      page.getByText("Essence Mascara Lash Princess Gemockt im Test", {
        exact: true,
      })
    ).toBeVisible();
  });
});
