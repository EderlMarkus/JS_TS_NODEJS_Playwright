import { expect } from "@playwright/test";
import { test } from "../playwright.config";
import { Mock } from "../mocks/mock.model";
import { MOCKS } from "../mocks";
import { createMocks } from "../mocks/createMocks";
import { Viewport } from "../custom/const";

test.describe("Tests", () => {
  test("navigates to Product Table and shows correct Product", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("menuitem", { name: "Table" }).click();
    await expect(
      page.getByText("Essence Mascara Lash Princess", { exact: true })
    ).toBeVisible();
  });

  test("navigates to Product Table and shows correct Product with mocked Data", async ({
    page,
  }) => {
    await createMocks(page, MOCKS);
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("menuitem", { name: "Table" }).click();
    await expect(
      page.getByText("Essence Mascara Lash Princess Gemockt", { exact: true })
    ).toBeVisible();
  });

  test("navigates to Product Table and shows correct Product with mocked Data in Test", async ({
    page,
  }) => {
    let mock: Mock = {
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

  test("navigates to Product Table and shows correct Product with mocked Data in Test and rewritten Mock during runtime", async ({
    page,
  }) => {
    await test.step("Mocks Request and shows Product with Add-on 'Gemockt im Test' ", async () => {
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

    await test.step("Mocks Request and shows Product with Add-on 'Gemockt im Test 2' ", async () => {
      const mock = {
        url: "https://dummyjson.com/products",
        response: {
          products: [
            {
              ...MOCKS[0]?.response?.products[0],
              title: "Essence Mascara Lash Princess Gemockt im Test 2",
            },
          ],
          total: 1,
          skip: 0,
          limit: 30,
        },
      };

      await createMocks(page, [mock]);
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("menuitem", { name: "Home" }).click();
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("menuitem", { name: "Table" }).click();
      await expect(
        page.getByText("Essence Mascara Lash Princess Gemockt im Test 2", {
          exact: true,
        })
      ).toBeVisible();
    });
  });

  test("navigates to Product Table and takes Screenshot", async ({ page }) => {
    await createMocks(page, MOCKS);
    await test.step("takes Full-Page-Screenshot of Menu", async () => {
      await page.getByRole("button", { name: "Menu" }).click();
      await page.screenshot({ path: "screenshots/1.png" });
    });

    await test.step("takes Full-Page-Screenshot of Table", async () => {
      await page.getByRole("menuitem", { name: "Table" }).click();
      await page.screenshot({ path: "screenshots/2.png" });
    });

    await test.step("takes Screenshot of specific Element in Table", async () => {
      await expect(
        page.getByText("Essence Mascara Lash Princess Gemockt", { exact: true })
      ).toBeVisible();
      await page
        .getByText("Essence Mascara Lash Princess Gemockt", { exact: true })
        .screenshot({ path: "screenshots/tableElement.png" });
    });
  });

  test("navigates to Add and sends Data correctly", async ({ page }) => {
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("menuitem", { name: "Add" }).click();
    await page.getByLabel("Textarea").click();
    await page.getByLabel("Textarea").fill("Hallo Welt");
    await page.on("request", (request) => {
      const url = "https://dummyjson.com/comments/add";
      const requestUrl = request.url();
      if (requestUrl.includes(url)) {
        const payload = request.postDataJSON();
        expect(payload.body).toBe("Hallo Welt");
      }
    });
    await page.getByRole("button", { name: "Speichern" }).click();

    await expect(page.getByText("Gespeichert")).toBeVisible();
  });

  test("catches Error correctly and informs User", async ({
    page,
  }, testinfo) => {
    await createMocks(page, MOCKS);
    await test.step("shows 'Gespeichert'-Message to User when Call was successfull", async () => {
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("menuitem", { name: "Add" }).click();
      await page.getByLabel("Textarea").click();
      await page.getByLabel("Textarea").fill("success");
      await page.getByRole("button", { name: "Speichern" }).click();
      await expect(page.getByText("Gespeichert")).toBeVisible();
      const screenshot = await page.screenshot();
      testinfo.attach("Successfull Call", {
        body: screenshot,
        contentType: "image/png",
      });
    });

    await test.step("shows 'Fehler'-Message to User when Call was not successfull", async () => {
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("menuitem", { name: "Add" }).click();
      await page.getByLabel("Textarea").click();
      await page.getByLabel("Textarea").fill("failure");
      await page.getByRole("button", { name: "Speichern" }).click();
      await expect(page.getByText("Fehler")).toBeVisible();
      const screenshot = await page.screenshot();
      testinfo.attach("Failed Call", {
        body: screenshot,
        contentType: "image/png",
      });
    });
  });

  test("has correct Size on Mobile ", async ({ page }) => {
    page.setViewportSize(Viewport.MOBILE);
    const box = await page.locator("mat-card").boundingBox();
    expect(box?.width).toBe(750);
  });

  test("selects current Date from Datepicker ", async ({ page }) => {
    const expectToBeFebruary = expect(
      page.getByLabel("Choose month and year")
    ).toContainText("FEB 2024");

    const expectToBeDayOfMonth = (dayOfMonth) =>
      expect(page.locator(".mat-calendar-body-today")).toHaveText(
        ` ${dayOfMonth} `
      );

    await test.step("Set Browser to February 2nd and check if Datepicker shows correct Date", async () => {
      await page.clock.setFixedTime(new Date("2024-02-02T10:00:00"));
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("menuitem", { name: "Datepicker" }).click();
      await page.getByLabel("Open calendar").click();
      await expectToBeFebruary;
      await expectToBeDayOfMonth(2);
      await page.getByLabel("February 2,").click();
    });

    await test.step("Set Browser to February 3rd and check if Datepicker shows correct Date", async () => {
      await page.clock.setFixedTime(new Date("2024-02-03T10:00:00"));
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("menuitem", { name: "Add" }).click();
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("menuitem", { name: "Datepicker" }).click();
      await page.getByLabel("Open calendar").click();
      await expectToBeFebruary;
      await expectToBeDayOfMonth(3);
      await page.getByLabel("February 3,").click();
    });
  });
});
