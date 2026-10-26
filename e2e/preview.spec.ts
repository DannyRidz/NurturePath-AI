import { expect, test } from "@playwright/test";

test("PD-05 static QA server preserves HTTP routing and privacy headers", async ({
  request,
}, info) => {
  test.skip(
    process.env.NURTUREPATH_STATIC_PREVIEW !== "1" ||
      info.project.name !== "desktop",
    "This HTTP contract applies once to the local export server, not the Node host or remote access gate.",
  );
  const page = await request.get("/start");
  expect(page.status()).toBe(200);
  expect(await page.text()).toContain("Explore a fictional situation.");
  expect(page.headers()["content-type"]).toContain("text/html");
  expect(page.headers()["cache-control"]).toBe("private, no-store");
  expect(page.headers()["referrer-policy"]).toBe("no-referrer");
  expect(page.headers()["x-content-type-options"]).toBe("nosniff");
  expect(page.headers()["x-robots-tag"]).toBe("noindex, nofollow");

  const head = await request.head("/report");
  expect(head.status()).toBe(200);
  expect((await head.body()).length).toBe(0);
  for (const path of [
    "/missing-preview-resource",
    "/_headers",
    "/.openai/hosting.json",
    "/%2e%2e%2fpackage.json",
  ]) {
    const result = await request.get(path);
    expect(result.status(), path).toBe(404);
    expect(await result.text(), path).toContain("This page is not available.");
    expect(result.headers()["cache-control"], path).toBe("private, no-store");
  }
  const post = await request.post("/start");
  expect(post.status()).toBe(404);
});
