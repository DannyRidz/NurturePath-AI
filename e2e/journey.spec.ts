import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function consent(page: Page) {
  await page.goto("/");
  await page.getByRole("link", { name: "Start fictional assessment" }).click();
  await page.getByRole("radio", { name: /General learning/ }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("checkbox", { name: /I understand this fictional/ })
    .check();
  await page.getByRole("button", { name: "Accept session notice" }).click();
  await page.getByRole("checkbox", { name: /I am 18 or older/ }).check();
  await page
    .getByRole("button", { name: "Explore the example", exact: true })
    .click();
}

async function reachReview(page: Page) {
  await consent(page);
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Next section" }).click();
  await page
    .getByRole("button", { name: "Review answers", exact: true })
    .click();
}

test("AC-01/02/03/07/09/11 complete fictional journey and clear survive Back", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await reachReview(page);
  await expect(
    page.getByRole("heading", { name: "The example, in full." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The example, in full." }),
  ).toBeFocused();
  await expect(
    page.getByText("Not applicable to this general learning example"),
  ).toBeVisible();
  await page.getByRole("link", { name: "Get guidance" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step." }),
  ).toBeFocused();
  await expect(
    page.getByText("Unvalidated simulation. Not reviewed by a clinician."),
  ).toBeVisible();
  await expect(
    page.getByText(/These example answers cannot confirm reproductive health/),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "World Health Organization: Infertility" }),
  ).toHaveAttribute(
    "href",
    "https://www.who.int/news-room/fact-sheets/detail/infertility",
  );
  await page.screenshot({
    path: `output/playwright/results-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Finish and clear", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Your session has been cleared." }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "No assessment is open." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The example, in full." }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("AC-02 adult collection follows unchecked session consent and decline is usable", async ({
  page,
}) => {
  await page.goto("/start");
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
  await page.getByRole("radio").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: /I am 18/ })).toHaveCount(0);
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await expect(
    page.getByRole("button", { name: "Accept session notice" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Decline and view sources" }).click();
  await expect(
    page.getByRole("heading", { name: "Sources and limitations." }),
  ).toBeVisible();
  await page.goto("/results");
  await expect(
    page.getByRole("heading", { name: "No assessment is open." }),
  ).toBeVisible();
});

test("AC-03 Back and inspect preserve the complete fixed example", async ({
  page,
}) => {
  await reachReview(page);
  await page.getByRole("button", { name: "Inspect the example" }).click();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Next section" }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("definition")).toContainText("No");
});

test("AC-11/14 refresh and direct protected URLs cannot restore a session", async ({
  page,
}) => {
  await consent(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "No assessment is open." }),
  ).toBeVisible();
  for (const route of ["/results", "/assessment/review", "/consent"]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: "No assessment is open." }),
    ).toBeVisible();
  }
});

test("AC-12 Hide masks content, traps focus and Resume returns focus", async ({
  page,
}) => {
  await consent(page);
  await page.getByRole("button", { name: "Hide screen" }).click();
  await expect(
    page.getByRole("dialog", { name: "Take your time." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Resume" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Finish and clear" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Resume" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Hide screen" })).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeVisible();
});

test("AC-08/14 journey makes no AI, analytics or external requests and stores no session", async ({
  page,
  context,
}) => {
  const unexpected: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.hostname !== "127.0.0.1" || url.pathname.startsWith("/api/"))
      unexpected.push(request.url());
  });
  await reachReview(page);
  await page.getByRole("link", { name: "Get guidance" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step." }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  expect(await context.cookies()).toEqual([]);
  expect(new URL(page.url()).search).toBe("");
  expect(unexpected).toEqual([]);
});

test("AC-12 critical pages have no automated WCAG A or AA violations", async ({
  page,
}) => {
  await page.goto("/");
  await page.screenshot({
    path: `output/playwright/home-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await reachReview(page);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("link", { name: "Get guidance" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("AC-12 no horizontal overflow at 320px or equivalent 400 percent desktop layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await reachReview(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Get guidance" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
