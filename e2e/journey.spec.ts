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
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your next step." }),
  ).toBeFocused();
  await expect(
    page
      .getByText("Unvalidated simulation. Not reviewed by a clinician.")
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/^Read the relevant information and consider/),
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
  await page.getByRole("radio", { name: /General learning/ }).check();
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

test("AC-08/14 journey uses only expected read requests and stores no session", async ({
  page,
  context,
  baseURL,
}) => {
  const unexpected: string[] = [];
  const allowedPages = new Set([
    "/",
    "/start",
    "/consent",
    "/assessment",
    "/assessment/review",
    "/results",
    "/report",
    "/finished",
    "/privacy",
    "/sources",
  ]);
  const allowedPayloads = new Set(
    [...allowedPages].flatMap((path) => {
      const prefix = path === "/" ? "" : path;
      const segment = path.slice(1).replaceAll("/", ".");
      return [
        path === "/" ? "/index.txt" : `${path}.txt`,
        `${prefix}/__next._tree.txt`,
        `${prefix}/__next._full.txt`,
        `${prefix}/__next.${segment ? `${segment}.` : ""}__PAGE__.txt`,
      ];
    }),
  );
  page.on("request", (request) => {
    const url = new URL(request.url());
    const expectedPath =
      allowedPages.has(url.pathname) ||
      (process.env.NURTUREPATH_STATIC_PREVIEW === "1" &&
        allowedPayloads.has(url.pathname)) ||
      url.pathname.startsWith("/_next/static/");
    const expectedQuery = [...url.searchParams.keys()].every(
      (key) => key === "_rsc",
    );
    if (
      url.origin !== new URL(baseURL!).origin ||
      !(
        request.method() === "GET" ||
        (process.env.NURTUREPATH_STATIC_PREVIEW === "1" &&
          request.method() === "HEAD")
      ) ||
      !expectedPath ||
      !expectedQuery
    )
      unexpected.push(`${request.method()} ${request.url()}`);
  });
  await reachReview(page);
  await page.getByRole("link", { name: "Get guidance" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
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
  const resultUrl = new URL(page.url());
  expect(resultUrl.pathname).toBe("/results");
  expect(resultUrl.search).toBe("");
  expect(resultUrl.hash).toBe("");
  await page
    .getByRole("link", { name: "Preview complete report", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Appointment preparation report",
      exact: true,
    }),
  ).toBeVisible();
  const reportUrl = new URL(page.url());
  expect(reportUrl.pathname).toBe("/report");
  expect(reportUrl.search).toBe("");
  expect(reportUrl.hash).toBe("");
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  expect(await context.cookies()).toEqual([]);
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
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
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
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("AC-11 restored pages clear before the native event returns", async ({
  page,
}) => {
  await reachReview(page);
  await page.getByRole("link", { name: "Get guidance" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your next step." }),
  ).toBeVisible();
  const immediatelyVisible = await page.evaluate(() => {
    window.dispatchEvent(
      new PageTransitionEvent("pageshow", { persisted: true }),
    );
    return [...document.querySelectorAll("main h1")]
      .filter((heading) => heading.getClientRects().length > 0)
      .map((heading) => heading.textContent);
  });
  expect(immediatelyVisible).toEqual(["No assessment is open."]);
  await expect(
    page.getByRole("heading", { name: "No assessment is open." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your next step." }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Start a fictional example" }).click();
  await expect(
    page.getByRole("heading", { name: "Explore a fictional situation." }),
  ).toBeVisible();

  // A restored masked page keeps the barrier with a truthful cleared message.
  await reachReview(page);
  await page.getByRole("button", { name: "Hide screen" }).click();
  const maskedMessage = await page.evaluate(() => {
    window.dispatchEvent(
      new PageTransitionEvent("pageshow", { persisted: true }),
    );
    return document.querySelector('[role="dialog"]')?.textContent;
  });
  expect(maskedMessage).toContain("Your session has been cleared.");
  expect(maskedMessage).not.toContain("Your session is still open");
  await expect(
    page.getByRole("dialog", { name: "Take your time." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resume" }).click();
  await expect(
    page.getByRole("heading", { name: "The example, in full." }),
  ).toHaveCount(0);
});

test("AC-03/04 whole example replacement resets all answers and preserves consent", async ({
  page,
}) => {
  await reachReview(page);
  await page
    .getByRole("combobox", { name: "Complete fictional example", exact: true })
    .selectOption("V09");
  await page.getByRole("button", { name: "Replace whole example" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Current concern and relevant history",
  );
  await expect(page.getByRole("definition")).toHaveText([
    "No",
    "Preparing for a discussion",
    "Yes",
    "Yes",
    "No",
    "No",
    "Not applicable to this purpose",
  ]);
  await page.getByRole("link", { name: "Get guidance" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("A current concern is recorded in this fictional example."),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Relevant clinician diagnosed history or treatment is recorded in this fictional example.",
    ),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Review the fictional answers" })
    .click();
  await page.getByRole("button", { name: "Inspect the example" }).click();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next section" }).click();
  await page.getByRole("button", { name: "Next section" }).click();
  await page
    .getByRole("button", { name: "No, load General learning", exact: true })
    .first()
    .click();
  await expect(page.getByRole("status")).toContainText("General learning");
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeVisible();
});

for (const [id, heading] of [
  ["V08", "Seek urgent medical help now."],
  ["V07", "This example needs safety information."],
] as const) {
  test(`AC-06 ${id} interrupts immediately at safety and cannot resume lower questions`, async ({
    page,
  }) => {
    await consent(page);
    await page
      .getByRole("button", {
        name:
          id === "V08"
            ? "Yes, load Sudden severe pain"
            : "Unknown, load Safety information unknown",
        exact: true,
      })
      .click();
    await expect(
      page.getByRole("heading", { name: heading, exact: true, level: 1 }),
    ).toBeFocused();
    await expect(
      page.getByRole("button", { name: "Next section" }),
    ).toHaveCount(0);
    await page.goBack();
    await expect(
      page.getByRole("button", { name: "Next section" }),
    ).toHaveCount(0);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}

test("AC-06 catalog safety selection stops after consent without requiring intake", async ({
  page,
}) => {
  await page.goto("/start");
  await page.getByRole("radio", { name: /Sudden severe pain/ }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("checkbox", { name: /I understand this fictional/ })
    .check();
  await page.getByRole("button", { name: "Accept session notice" }).click();
  await page.getByRole("checkbox", { name: /I am 18/ }).check();
  await page
    .getByRole("button", { name: "Explore the example", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Seek urgent medical help now.",
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Next section" })).toHaveCount(
    0,
  );
  await page
    .getByRole("combobox", { name: "Complete fictional example", exact: true })
    .selectOption("V10");
  await page.getByRole("button", { name: "Replace whole example" }).click();
  await expect(
    page.getByText("This information is not treated as no."),
  ).toBeVisible();
});

for (const [id, text] of [
  ["V01", "Read, then prepare your questions"],
  ["V02", "This example requests general lifestyle information."],
  ["V03", "This example includes the testosterone or steroid topic."],
  ["V04", "A current concern is recorded"],
  ["V05", "Relevant clinician diagnosed history"],
  ["V06", "Difficulty conceiving is recorded"],
  ["V07", "This example needs safety information."],
  ["V08", "Seek urgent medical help now."],
  ["V09", "Relevant clinician diagnosed history"],
  ["V10", "Unknown or declined information"],
  ["V11", "Difficulty conceiving is recorded"],
  ["V12", "Unknown or declined information"],
]) {
  test(`AC-04/05 ${id} renders its authored outcome`, async ({ page }) => {
    await reachReview(page);
    await page.getByRole("link", { name: "Get guidance" }).click();
    await expect(
      page.getByRole("heading", { name: "Your next step.", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("combobox", {
        name: "Complete fictional example",
        exact: true,
      })
      .selectOption(id);
    await page.getByRole("button", { name: "Replace whole example" }).click();
    await expect(page.getByRole("status")).toContainText(
      "The whole fictional example has been replaced",
    );
    await expect(
      page.getByText(text, { exact: false }).filter({ visible: true }).first(),
    ).toBeVisible();
    await expect(
      page
        .getByText("Unvalidated simulation. Not reviewed by a clinician.")
        .filter({ visible: true }),
    ).toBeVisible();
    if (["V07", "V10", "V12"].includes(id)) {
      const unknown = page.getByRole("region", {
        name: "Unknown or declined information",
        exact: true,
      });
      await expect(unknown.getByRole("term")).toHaveCount(id === "V10" ? 3 : 1);
      await expect(unknown).not.toContainText(/Q0[1-7]/);
      await expect(unknown).toContainText(
        "This information is not treated as no.",
      );
      if (id === "V07")
        await expect(unknown).toContainText(
          "Does this fictional person have sudden, severe pain in a testicle now?",
        );
      if (id === "V10")
        await expect(unknown.getByRole("definition")).toHaveText([
          "Unknown",
          "Declined",
          "Unknown",
        ]);
      if (id === "V12")
        await expect(unknown).toContainText("what duration is provided?");
    }
    if (id === "V07" || id === "V08")
      await expect(
        page.getByRole("heading", { name: text, exact: true, level: 1 }),
      ).toBeFocused();
    if (id === "V08" || id === "V09")
      await page.screenshot({
        path: `output/playwright/${id}-${test.info().project.name}.png`,
        fullPage: true,
      });
  });
}
