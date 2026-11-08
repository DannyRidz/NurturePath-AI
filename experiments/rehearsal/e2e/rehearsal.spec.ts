import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function results(page: Page) {
  await page.goto("/start");
  await page.getByRole("button", { name: "Choose V01", exact: true }).click();
  await page
    .getByRole("checkbox", { name: /I understand this is a fictional example/ })
    .check();
  await page.getByRole("button", { name: "Agree and continue" }).click();
  await page.getByRole("checkbox", { name: /I am 18 or older/ }).check();
  await page
    .getByRole("button", { name: "Explore the example", exact: true })
    .click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Next section" }).click();
  await page
    .getByRole("button", { name: "Review answers", exact: true })
    .click();
  await page.getByRole("link", { name: "Get guidance" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
}
async function open(page: Page) {
  await results(page);
  await page.getByRole("link", { name: "Start local rehearsal" }).click();
}
async function agree(page: Page) {
  await page
    .getByRole("checkbox", { name: /I am an adult practising/ })
    .check();
  await page
    .getByRole("checkbox", { name: /I understand this exercise/ })
    .check();
  await page.getByRole("checkbox", { name: /I agree to send/ }).check();
  await page
    .getByLabel("Local operator access token")
    .fill(process.env.REHEARSAL_TEST_TOKEN!);
}
const sheet = (page: Page) => page.locator(".preparation-sheet");
test("complete two round local journey, ordered selected sheet, keyboard, clear and report isolation", async ({
  page,
}) => {
  const outbound: string[] = [];
  const errors: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:3002")) outbound.push(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  await expect(
    page.getByRole("checkbox", { name: /I agree to send/ }),
  ).not.toBeChecked();
  await page
    .getByLabel("Practice question", { exact: true })
    .fill("What should I ask?");
  await agree(page);
  await page
    .getByText("Exact simulated request preview", { exact: true })
    .click();
  await expect(page.getByText("Current text:", { exact: false })).toContainText(
    "What should I ask?",
  );
  await page
    .getByRole("button", { name: "Request simulated feedback", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Simulated round 1" }),
  ).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Include question 1", exact: true }),
  ).not.toBeChecked();
  await page
    .getByLabel("Practice question", { exact: true })
    .fill("What information is still missing from this example?");
  await page
    .getByRole("button", { name: "Request second simulated feedback" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Simulated round 2" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Request second simulated feedback" }),
  ).toHaveCount(0);
  await page
    .getByRole("checkbox", { name: "Include question 1", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "Include question 2", exact: true })
    .check();
  await page
    .getByRole("button", { name: "Move question 2 up", exact: true })
    .click();
  await page.getByRole("button", { name: "Preview preparation sheet" }).focus();
  await page.keyboard.press("Enter");
  await expect(sheet(page).getByRole("listitem").first()).toContainText(
    "Which parts",
  );
  await expect(sheet(page)).not.toContainText("What should I ask?");
  await expect(sheet(page)).toContainText("Simulated suggestion");
  await page.screenshot({
    path: `output/playwright/rehearsal-sheet-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  if (
    test.info().project.name === "desktop" ||
    test.info().project.name === "mobile"
  ) {
    await page.emulateMedia({ media: "print" });
    await expect(sheet(page)).not.toBeVisible();
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => {
      window.print = () => {};
    });
    await page.getByRole("button", { name: "Print preparation sheet" }).click();
    await page.emulateMedia({ media: "print" });
    await expect(sheet(page)).toBeVisible();
    await page.pdf({
      path: `output/playwright/rehearsal-${test.info().project.name}.pdf`,
    });
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    expect(
      await page.locator("body").getAttribute("data-rehearsal-print"),
    ).toBeNull();
  }
  await page.getByRole("button", { name: "Cancel preview" }).click();
  await expect(
    page.getByLabel("Practice question", { exact: true }),
  ).toHaveValue("What information is still missing from this example?");
  await page
    .getByRole("button", { name: "Clear rehearsal", exact: true })
    .click();
  await expect(
    page.getByLabel("Practice question", { exact: true }),
  ).toHaveValue("");
  await expect(page.getByLabel("Local operator access token")).toHaveValue("");
  await expect(
    page.getByRole("checkbox", { name: /I agree to send/ }),
  ).not.toBeChecked();
  await page
    .getByRole("link", { name: "Back to written result", exact: true })
    .click();
  await page.getByRole("link", { name: /Preview complete report/ }).click();
  await expect(
    page.getByRole("heading", { name: "Every fictional answer" }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Simulated round");
  await expect(page.locator("body")).not.toContainText("What should I ask?");
  expect(outbound).toEqual([]);
  expect(errors).toEqual([]);
});
test("declined simulation keeps local worksheet useful, responsive and transient", async ({
  page,
}) => {
  await open(page);
  await page.setViewportSize({ width: 320, height: 740 });
  await page
    .getByLabel("Practice question", { exact: true })
    .fill("What information is missing?");
  await page
    .getByRole("button", { name: "Add my wording to the question choices" })
    .click();
  await page
    .getByRole("checkbox", { name: "Include question 1", exact: true })
    .check();
  await page.getByRole("button", { name: "Preview preparation sheet" }).click();
  await expect(sheet(page)).toContainText("User wording");
  await expect(sheet(page)).not.toContainText("What is the");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Hide screen", exact: true }).click();
  await expect(sheet(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(
    page.getByLabel("Practice question", { exact: true }),
  ).toHaveValue("");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Start with the fictional journey" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookies: document.cookie,
    })),
  ).toEqual({ local: 0, session: 0, cookies: "" });
});
for (const action of [
  "clear",
  "hide",
  "withdraw",
  "goal",
  "navigate",
  "visibility",
  "edit",
] as const) {
  test(`pending response never returns after ${action}`, async ({ page }) => {
    await open(page);
    await agree(page);
    await page
      .getByLabel("Practice question", { exact: true })
      .fill("What should I ask?");
    let release!: () => void, seen!: () => void, finished!: () => void;
    const gate = new Promise<void>((r) => (release = r)),
      arrived = new Promise<void>((r) => (seen = r)),
      drained = new Promise<void>((r) => (finished = r));
    // Browser race injection only. No server HTTP bypass, provider call or reservation.
    const rehearsalId = "00000000-0000-4000-8000-000000000001",
      configuration = "a".repeat(64);
    await page.route("**/api/rehearsal/start", (r) =>
      r.fulfill({
        json: { ticket: "synthetic-ticket", rehearsalId, configuration },
      }),
    );
    await page.route("**/api/rehearsal/feedback", async (route) => {
      const req = route.request().postDataJSON();
      seen();
      await gate;
      try {
        await route.fulfill({
          json: {
            requestId: req.requestId,
            rehearsalId,
            caseId: "V01",
            goalId: req.goalId,
            round: 1,
            revision: req.revision,
            versions: JSON.stringify({
              catalog: "sim-1",
              rules: "sim-1",
              content: "sim-1",
              notice: "rehearsal-notice-1",
              goals: "rehearsal-goals-1",
              rubric: "rehearsal-rubric-1",
              prompt: "rehearsal-prompt-1",
            }),
            configuration,
            provider: "simulation",
            model: "authored-fixture-1",
            generatedAt: new Date().toISOString(),
            usage: { input: 0, output: 0 },
            feedback: {
              decision: "coach",
              notes: [],
              rewrite: "A late question?",
              followUps: [],
            },
            receipt: "synthetic-receipt",
          },
        });
      } catch {
        /* Aborted request */
      } finally {
        finished();
      }
    });
    await page
      .getByRole("button", { name: "Request simulated feedback", exact: true })
      .click();
    await arrived;
    if (action === "clear")
      await page
        .getByRole("button", { name: "Clear rehearsal", exact: true })
        .click();
    if (action === "hide")
      await page.getByRole("button", { name: "Hide screen" }).click();
    if (action === "withdraw")
      await page.getByRole("checkbox", { name: /I agree to send/ }).uncheck();
    if (action === "goal")
      await page
        .getByRole("radio", { name: "Help me ask a clearer question." })
        .check();
    if (action === "navigate")
      await page
        .getByRole("link", { name: "Back to written result", exact: true })
        .click();
    if (action === "visibility")
      await page.evaluate(() => {
        Object.defineProperty(document, "visibilityState", {
          configurable: true,
          get: () => "hidden",
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
    if (action === "edit")
      await page
        .getByLabel("Practice question", { exact: true })
        .fill("An edited question?");
    release();
    await drained;
    await expect(
      page.getByRole("heading", { name: "Simulated round 1" }),
    ).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("A late question?");
  });
}
test("ineligible canonical cases bypass rehearsal; local endpoint rejects missing access", async ({
  page,
  request,
}) => {
  const denied = await request.post("/api/rehearsal/start", {
    headers: { Origin: "http://127.0.0.1:3002" },
    data: {},
  });
  expect(denied.status()).toBe(403);
  await results(page);
  for (const id of ["V07", "V08"]) {
    if (id === "V08") await results(page);
    await page.getByLabel("Complete fictional example").selectOption(id);
    await page.getByRole("button", { name: "Replace whole example" }).click();
    await expect(
      page.getByRole("link", { name: "Start local rehearsal" }),
    ).toHaveCount(0);
  }
});

test("route exit and Back never restore a selected worksheet or credentials", async ({
  page,
}) => {
  await open(page);
  await page
    .getByLabel("Practice question", { exact: true })
    .fill("Which information is missing?");
  await page
    .getByRole("button", { name: "Add my wording to the question choices" })
    .click();
  await page
    .getByRole("checkbox", { name: "Include question 1", exact: true })
    .check();
  await page
    .getByRole("link", { name: "Back to written result", exact: true })
    .click();
  await expect(page).toHaveURL(/\/results$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/rehearsal$/);
  await expect(
    page.getByLabel("Practice question", { exact: true }),
  ).toHaveValue("");
  await expect(
    page.getByRole("checkbox", { name: "Include question 1", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Local operator access token")).toHaveValue("");
});
