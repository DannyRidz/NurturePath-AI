import { test, expect, type Page } from "@playwright/test";
import { liveVersions, liveHash, model } from "../../src/lib/rehearsal/gemini";
async function results(page: Page) {
  await page.goto("/start");
  await page.getByRole("radio", { name: /General learning/ }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
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
  await page
    .getByRole("link", { name: "Practise with Gemini", exact: true })
    .click();
}
async function agree(page: Page) {
  await page
    .getByRole("checkbox", { name: /I am an adult practising/ })
    .check();
  await page
    .getByRole("checkbox", { name: /I understand this exercise/ })
    .check();
  await page.getByRole("checkbox", { name: /I agree to send/ }).check();
}
test("complete live-labelled two-round journey, truthful preview, selected sheet and clear", async ({
  page,
}) => {
  const id = crypto.randomUUID();
  let calls = 0;
  let original = "";
  await page.route("**/api/tester-rehearsal/start", (route) =>
    route.fulfill({
      json: {
        rehearsalId: id,
        ticket: "test-ticket",
        configuration: liveHash,
        expires: Date.now() + 1800000,
      },
    }),
  );
  await page.route("**/api/tester-rehearsal/feedback", async (route) => {
    const body = route.request().postDataJSON();
    calls++;
    if (calls === 1) original = body.current;
    else expect(body.original).toBe(original);
    await route.fulfill({
      json: {
        requestId: body.requestId,
        rehearsalId: id,
        caseId: "V01",
        goalId: body.goalId,
        round: body.round,
        revision: body.revision,
        versions: JSON.stringify(liveVersions),
        configuration: liveHash,
        provider: "google-gemini",
        model,
        generatedAt: new Date().toISOString(),
        usage: {
          inputTokens: 100,
          outputTokens: 100,
          thinkingTokens: 0,
          totalTokens: 200,
          durationMs: 20,
          estimatedUsd: 0.0002,
        },
        feedback: {
          decision: "coach",
          notes: [
            {
              criterion: "clarity",
              type: "suggestion",
              comment: "Name the information you want to ask about.",
              factIds: [],
            },
          ],
          rewrite: "What information is missing from this fictional example?",
          followUps: ["What are the limits of this example?"],
        },
        ...(calls === 1 ? { receipt: "test-receipt" } : {}),
      },
    });
  });
  await open(page);
  await page
    .getByLabel("Practice question", { exact: true })
    .fill("How could I ask a clearer question?");
  await agree(page);
  await page.getByText("Exact AI request preview", { exact: true }).click();
  await expect(page.locator(".request-preview")).toContainText(
    "How could I ask a clearer question?",
  );
  await expect(page.locator(".request-preview")).not.toContainText(
    "testosterone",
  );
  await page
    .getByRole("button", { name: "Request AI feedback", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "AI round 1", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Practice question", { exact: true })
    .fill("What information is missing from this fictional example?");
  await page
    .getByRole("button", { name: "Request second AI feedback", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "AI round 2", exact: true }),
  ).toBeVisible();
  expect(calls).toBe(2);
  await expect(
    page.getByRole("checkbox", { name: "Include question 1", exact: true }),
  ).not.toBeChecked();
  await page
    .getByRole("checkbox", { name: "Include question 1", exact: true })
    .check();
  await page
    .getByRole("button", { name: "Preview preparation sheet", exact: true })
    .click();
  await expect(page.locator(".preparation-sheet")).toContainText(
    "AI suggestion",
  );
  await expect(page.locator(".preparation-sheet")).toContainText(
    "Model: Google Gemini 3.1 Flash-Lite.",
  );
  await expect(page.locator(".preparation-sheet")).not.toContainText(
    "authored-fixture-1",
  );
  await page.evaluate(() => {
    window.print = () => {};
  });
  await page
    .getByRole("button", { name: "Print preparation sheet", exact: true })
    .click();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".preparation-sheet")).toBeVisible();
  await expect(page.locator(".site-header")).not.toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(page.locator("body")).not.toHaveAttribute(
    "data-rehearsal-print",
    "1",
  );
  await page
    .getByRole("button", { name: "Clear rehearsal", exact: true })
    .click();
  await expect(
    page.getByLabel("Practice question", { exact: true }),
  ).toHaveValue("");
  await page
    .getByRole("link", { name: "Back to written result", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Preview complete report", exact: true })
    .click();
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("region", { name: "Complete fictional report" }),
  ).toBeVisible();
  await page.emulateMedia({ media: "screen" });
});
test("route reload has no previous session or wording", async ({ page }) => {
  await open(page);
  await page
    .getByLabel("Practice question", { exact: true })
    .fill("Which detail is missing?");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Start with the fictional journey" }),
  ).toBeVisible();
  await expect(
    page.getByText("Which detail is missing?", { exact: true }),
  ).toHaveCount(0);
});

test("production Hide invalidates a pending response and clears the wording", async ({
  page,
}) => {
  let release: () => void = () => {};
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  let started = false;
  await page.route("**/api/tester-rehearsal/start", (route) =>
    route.fulfill({
      json: {
        rehearsalId: crypto.randomUUID(),
        ticket: "test-ticket",
        configuration: liveHash,
      },
    }),
  );
  await page.route("**/api/tester-rehearsal/feedback", async (route) => {
    started = true;
    await waiting;
    try {
      await route.fulfill({ status: 503, json: { error: "disabled" } });
    } catch {}
  });
  await open(page);
  await page
    .getByLabel("Practice question", { exact: true })
    .fill("How could I ask this question clearly?");
  await agree(page);
  await page
    .getByRole("button", { name: "Request AI feedback", exact: true })
    .click();
  await expect.poll(() => started).toBe(true);
  await page.getByRole("button", { name: "Hide screen", exact: true }).click();
  release();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Practice cleared" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start a fresh rehearsal" }).click();
  await expect(
    page.getByLabel("Practice question", { exact: true }),
  ).toHaveValue("");
});
