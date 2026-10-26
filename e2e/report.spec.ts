import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  catalog,
  questions,
  answerLabel,
  steps,
  getResult,
} from "../src/lib/scenario";

async function openResult(page: Page, label = "General learning") {
  await page.goto("/start");
  await page
    .getByRole("radio", {
      name: `${label} Authored fictional example. Not a description of your health.`,
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("checkbox", { name: /I understand this fictional/ })
    .check();
  await page.getByRole("button", { name: "Accept session notice" }).click();
  await page.getByRole("checkbox", { name: /I am 18/ }).check();
  await page
    .getByRole("button", { name: "Explore the example", exact: true })
    .click();
  if (
    label !== "Sudden severe pain" &&
    label !== "Safety information unknown"
  ) {
    for (let i = 0; i < 3; i++)
      await page.getByRole("button", { name: "Next section" }).click();
    await page
      .getByRole("button", { name: "Review answers", exact: true })
      .click();
    await page.getByRole("link", { name: "Get guidance", exact: true }).click();
  }
  await expect(
    page.getByRole("link", { name: "Preview complete report", exact: true }),
  ).toBeVisible();
}
async function openReport(page: Page, label?: string) {
  await openResult(page, label);
  await page
    .getByRole("link", { name: "Preview complete report", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Appointment preparation report",
      exact: true,
    }),
  ).toBeVisible();
}

for (const example of catalog) {
  test(`AC-10 ${example.variantId} preview includes all facts and the unchanged next step`, async ({
    page,
  }, info) => {
    await openReport(page, example.label);
    const report = page.getByRole("region", {
      name: "Complete fictional report",
      exact: true,
    });
    await expect(report.getByRole("definition")).toHaveText(
      questions.map((q) => answerLabel(q.id, example.canonicalAnswers)),
    );
    await expect(report).toContainText(steps[getResult(example).nextStepId]);
    await expect(report).toContainText(
      "Unvalidated simulation. Not reviewed by a clinician.",
    );
    await expect(
      report.getByRole("link").filter({ hasText: /^https:/ }),
    ).toHaveCount(2);
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    expect(new URL(page.url()).pathname).toBe("/report");
    expect(new URL(page.url()).search).toBe("");
    expect(new URL(page.url()).hash).toBe("");
    await expect(page).toHaveTitle("nurturepath-summary");
    if (info.project.name === "desktop")
      await page.pdf({
        path: `output/pdf/variant-${example.variantId}.pdf`,
        format: "A4",
        preferCSSPageSize: true,
        printBackground: true,
        displayHeaderFooter: false,
      });
  });
}

test("AC-10 Cancel returns to unchanged guidance without printing or downloading", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.assign(window, { printCalls: 0 });
    window.print = () => {
      (window as unknown as { printCalls: number }).printCalls++;
    };
  });
  let downloads = 0;
  page.on("download", () => downloads++);
  await openReport(page, "Current concern and relevant history");
  await expect(
    page.getByText(
      "This report includes every displayed example answer and reason. Review the full preview before saving or sharing.",
    ),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Cancel and return to guidance", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByText("A current concern is recorded in this fictional example.")
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page
      .getByText(
        "Relevant clinician diagnosed history or treatment is recorded in this fictional example.",
      )
      .filter({ visible: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as unknown as { printCalls: number }).printCalls,
    ),
  ).toBe(0);
  expect(downloads).toBe(0);
});

test("AC-10 print is explicit and a cancelled dialog leaves the preview usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.assign(window, { printCalls: 0 });
    window.print = () => {
      (window as unknown as { printCalls: number }).printCalls++;
      window.dispatchEvent(new Event("afterprint"));
    };
  });
  await openReport(page);
  await page
    .getByRole("button", { name: "Print / Save as PDF", exact: true })
    .click();
  expect(
    await page.evaluate(
      () => (window as unknown as { printCalls: number }).printCalls,
    ),
  ).toBe(1);
  await expect(
    page.getByRole("heading", {
      name: "Appointment preparation report",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to guidance", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
});

test("AC-10 print failure keeps the accessible complete preview", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.print = () => {
      throw new Error("synthetic print failure");
    };
  });
  await openReport(page);
  await page
    .getByRole("button", { name: "Print / Save as PDF", exact: true })
    .click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Printing could not be opened." }),
  ).toContainText("Printing could not be opened.");
  await expect(
    page
      .getByRole("region", { name: "Complete fictional report" })
      .getByRole("definition"),
  ).toHaveCount(7);
});

test("AC-11 report cannot survive clear, Back, refresh or direct navigation", async ({
  page,
}) => {
  await page.goto("/report");
  await expect(
    page.getByRole("heading", { name: "No assessment is open." }),
  ).toBeVisible();
  await openReport(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "No assessment is open." }),
  ).toBeVisible();
  await openReport(page);
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
    page.getByRole("region", { name: "Complete fictional report" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Print / Save as PDF", exact: true }),
  ).toHaveCount(0);
});

test("AC-10/12 print CSS exports the complete preview with neutral title and no controls", async ({
  page,
  browserName,
}, info) => {
  test.skip(
    browserName !== "chromium",
    "PDF export API is Chromium-only; native Safari print is checked manually.",
  );
  await openReport(page, "Current concern and relevant history");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: `output/playwright/report-${info.project.name}.png`,
    fullPage: true,
  });
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("button", { name: "Print / Save as PDF" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "Appointment preparation report",
      exact: true,
    }),
  ).toBeVisible();
  const pdf = await page.pdf({
    path: `output/pdf/nurturepath-summary-${info.project.name}.pdf`,
    format: "A4",
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
  });
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  await page.emulateMedia({ media: "screen" });
  await page
    .getByRole("link", { name: "Back to guidance", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Complete fictional example", exact: true })
    .selectOption("V10");
  await page
    .getByRole("button", { name: "Replace whole example", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Preview complete report", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Complete fictional report" })
      .getByRole("definition"),
  ).toHaveText([
    "No",
    "Unsure",
    "Unknown",
    "Declined",
    "Unknown",
    "No",
    "Not applicable to this purpose",
  ]);
});

test("AC-11/14 privacy mask cannot print concealed report facts", async ({
  page,
  browserName,
}, info) => {
  test.skip(
    browserName !== "chromium",
    "PDF export API is Chromium-only; this is not a WebKit/Firefox PDF pass.",
  );
  await openReport(page, "Testosterone or steroid topic");
  await page.getByRole("button", { name: "Hide screen", exact: true }).click();
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("region", { name: "Complete fictional report" }),
  ).toHaveCount(0);
  await page.pdf({
    path: `output/pdf/hidden-${info.project.name}.pdf`,
    format: "A4",
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
});

test("AC-11/12 report reflows at 320px and persisted restoration clears it synchronously", async ({
  page,
}) => {
  await openReport(page, "Uncertain and declined information");
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const remaining = await page.evaluate(() => {
    window.dispatchEvent(
      new PageTransitionEvent("pageshow", { persisted: true }),
    );
    return document.querySelector(".report-document")?.textContent ?? "";
  });
  expect(remaining).toBe("");
  await expect(
    page.getByRole("region", { name: "Complete fictional report" }),
  ).toHaveCount(0);
});
