import { expect, test, type Page, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function prepare(page: Page, label = "General learning") {
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
  await page
    .getByRole("button", { name: "Accept session notice", exact: true })
    .click();
  await page.getByRole("checkbox", { name: /I am 18/ }).check();
}
async function start(page: Page) {
  await prepare(page);
  await page
    .getByRole("button", { name: "Explore the example", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeVisible();
}
async function tabTo(page: Page, target: Locator) {
  for (let i = 0; i < 80; i++) {
    if (await target.evaluate((el) => el === document.activeElement)) return;
    // WebKit follows Safari's macOS convention, Option+Tab includes links.
    await page.keyboard.press(
      test.info().project.name.startsWith("webkit") ? "Alt+Tab" : "Tab",
    );
  }
  throw new Error("Required control was not reachable with Tab");
}

test("AC-02/06/11 clearing an inline safety result starts fresh consent for the next example", async ({
  page,
}) => {
  await prepare(page, "Sudden severe pain");
  await page
    .getByRole("button", { name: "Explore the example", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Seek urgent medical help now.",
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Finish and clear", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: "Start again", exact: true }).click();
  await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
  await page.getByRole("radio", { name: /General learning Authored/ }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("checkbox", { name: /I understand this fictional/ }),
  ).not.toBeChecked();
  await page
    .getByRole("checkbox", { name: /I understand this fictional/ })
    .check();
  await page
    .getByRole("button", { name: "Accept session notice", exact: true })
    .click();
  await expect(
    page.getByRole("checkbox", { name: /I am 18/ }),
  ).not.toBeChecked();
  await page.getByRole("checkbox", { name: /I am 18/ }).check();
  await page
    .getByRole("button", { name: "Explore the example", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeVisible();
});
for (const [label, heading] of [
  ["Sudden severe pain", "Seek urgent medical help now."],
  ["Safety information unknown", "This example needs safety information."],
]) {
  test(`AC-06 ${label} is immediate after adult scope even when the network is offline`, async ({
    page,
    context,
  }) => {
    await prepare(page, label);
    await context.setOffline(true);
    await page
      .getByRole("button", { name: "Explore the example", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: heading, exact: true, level: 1 }),
    ).toBeVisible({ timeout: 2000 });
    await expect(
      page.getByRole("button", { name: "Next section" }),
    ).toHaveCount(0);
  });
}

for (const [id, heading] of [
  ["V08", "Seek urgent medical help now."],
  ["V07", "This example needs safety information."],
] as const) {
  for (const entry of ["assessment", "review", "results"] as const) {
    test(`AC-06 ${id} interrupts locally from ${entry} offline`, async ({
      page,
      context,
    }) => {
      await start(page);
      if (entry !== "assessment") {
        for (let i = 0; i < 3; i++)
          await page
            .getByRole("button", { name: "Next section", exact: true })
            .click();
        await page
          .getByRole("button", { name: "Review answers", exact: true })
          .click();
        if (entry === "results")
          await page
            .getByRole("link", { name: "Get guidance", exact: true })
            .click();
      }
      await expect(
        page.getByRole("heading", {
          name:
            entry === "assessment"
              ? "Immediate concerns"
              : entry === "review"
                ? "The example, in full."
                : "Your next step.",
          exact: true,
        }),
      ).toBeVisible();
      await context.setOffline(true);
      if (entry === "assessment") {
        await page
          .getByRole("button", {
            name:
              id === "V08"
                ? "Yes, load Sudden severe pain"
                : "Unknown, load Safety information unknown",
            exact: true,
          })
          .click();
      } else {
        await page
          .getByRole("combobox", {
            name: "Complete fictional example",
            exact: true,
          })
          .selectOption(id);
        await page
          .getByRole("button", { name: "Replace whole example", exact: true })
          .click();
      }
      await expect(
        page.getByRole("heading", { name: heading, exact: true, level: 1 }),
      ).toBeFocused({ timeout: 2000 });
      await expect(
        page.getByRole("button", { name: "Next section" }),
      ).toHaveCount(0);
    });
  }
}

test("AC-12 complete ordinary journey is operable with the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await tabTo(
    page,
    page.getByRole("link", { name: "Start fictional assessment", exact: true }),
  );
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Explore a fictional situation." }),
  ).toBeFocused();
  await tabTo(page, page.getByRole("radio", { name: /General learning/ }));
  await page.keyboard.press("Space");
  await tabTo(
    page,
    page.getByRole("button", { name: "Continue", exact: true }),
  );
  await page.keyboard.press("Enter");
  await tabTo(
    page,
    page.getByRole("checkbox", { name: /I understand this fictional/ }),
  );
  await page.keyboard.press("Space");
  await tabTo(
    page,
    page.getByRole("button", { name: "Accept session notice", exact: true }),
  );
  await page.keyboard.press("Enter");
  await tabTo(page, page.getByRole("checkbox", { name: /I am 18/ }));
  await page.keyboard.press("Space");
  await tabTo(
    page,
    page.getByRole("button", { name: "Explore the example", exact: true }),
  );
  await page.keyboard.press("Enter");
  for (let i = 0; i < 3; i++) {
    await tabTo(
      page,
      page.getByRole("button", { name: "Next section", exact: true }),
    );
    await page.keyboard.press("Enter");
  }
  await tabTo(
    page,
    page.getByRole("button", { name: "Review answers", exact: true }),
  );
  await page.keyboard.press("Enter");
  await tabTo(
    page,
    page.getByRole("link", { name: "Get guidance", exact: true }),
  );
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeFocused();
  await tabTo(
    page,
    page.getByRole("link", { name: "Preview complete report", exact: true }),
  );
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", {
      name: "Appointment preparation report",
      exact: true,
    }),
  ).toBeFocused();
  await tabTo(
    page,
    page.getByRole("link", {
      name: "Cancel and return to guidance",
      exact: true,
    }),
  );
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Your next step.", exact: true }),
  ).toBeVisible();
});

test("AC-12 all public pages have accessible landmarks and automated A/AA checks", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/start",
    "/consent",
    "/assessment",
    "/assessment/review",
    "/results",
    "/report",
    "/privacy",
    "/sources",
    "/finished",
    "/missing-release-check",
  ]) {
    await page.goto(route);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
      route,
    ).toEqual([]);
  }
});

test("AC-12 layout remains usable across specified viewports and landscape", async ({
  page,
}, info) => {
  await start(page);
  for (const size of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(size);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${size.width}x${size.height}`,
    ).toBe(true);
    await expect(
      page.getByRole("button", { name: "Next section", exact: true }),
    ).toBeVisible();
  }
  await page.screenshot({
    path: `output/playwright/release-layout-${info.project.name}.png`,
    fullPage: true,
  });
});

test("AC-11/14 a second tab cannot read another tab's memory session", async ({
  page,
  context,
}) => {
  await start(page);
  const second = await context.newPage();
  await second.goto("/report");
  await expect(
    second.getByRole("heading", { name: "No assessment is open." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeVisible();
  await second.close();
});

test("AC-11/12 simulated visibility and clock enforce two-minute masking without clearing", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-26T00:00:00Z") });
  await start(page);
  await page.clock.pauseAt(new Date("2026-10-26T00:10:00Z"));
  async function visibility(value: "hidden" | "visible") {
    await page.evaluate((state) => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => state,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    }, value);
  }
  await visibility("hidden");
  await page.clock.fastForward(119999);
  await visibility("visible");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await visibility("hidden");
  await page.clock.fastForward(120000);
  await visibility("visible");
  await expect(
    page.getByRole("dialog", { name: "Take your time." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Immediate concerns", exact: true }),
  ).toBeVisible();
});
