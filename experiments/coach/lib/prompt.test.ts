import { describe, expect, it } from "vitest";
import { createReport } from "../../../src/lib/report";
import { createCoachFacts } from "./prompt";

describe("frozen Gemini coach input", () => {
  it("uses all seven canonical answers without accepting caller facts", () => {
    const facts = createCoachFacts();
    expect(facts.answers).toEqual(createReport("V01", new Date().toISOString()).answers);
    expect(facts.answers).toHaveLength(7);
    expect(facts.variantId).toBe("V01");
    expect(JSON.stringify(facts)).not.toMatch(/generatedAt|sources|https?:/);
  });
});
