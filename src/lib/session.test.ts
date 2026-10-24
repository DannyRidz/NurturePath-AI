import { describe, expect, it } from "vitest";
import { emptySession, hasActiveSession, sessionReducer } from "./session";

describe("consent and session lifecycle", () => {
  const time = "2026-10-24T06:00:00.000Z";
  const selected = sessionReducer(emptySession, { type: "select" });
  const consented = sessionReducer(selected, {
    type: "consent",
    acceptedAt: time,
  });
  const active = sessionReducer(consented, { type: "adult" });

  it("AC-02 cannot accept adult scope before session consent", () => {
    expect(hasActiveSession(sessionReducer(selected, { type: "adult" }))).toBe(
      false,
    );
  });
  it("AC-02 requires an example and both consent stages", () => {
    expect(
      sessionReducer(emptySession, { type: "consent", acceptedAt: time }),
    ).toEqual(emptySession);
    expect(hasActiveSession(consented)).toBe(false);
    expect(hasActiveSession(active)).toBe(true);
    expect(active.consent?.acceptedAt).toBe(time);
  });
  it("AC-03 refuses unsupported progress values", () => {
    for (const section of [-1, 4, 1.5, Number.NaN])
      expect(sessionReducer(active, { type: "section", section })).toEqual(
        active,
      );
  });
  it("AC-11 clear removes consent, selected example and progress", () => {
    const cleared = sessionReducer(
      { ...active, section: 3 },
      { type: "clear" },
    );
    expect(cleared).toEqual({
      variantId: null,
      consent: null,
      section: 0,
      cleared: true,
    });
    expect(hasActiveSession(cleared)).toBe(false);
    expect(sessionReducer(cleared, { type: "section", section: 2 })).toEqual(
      cleared,
    );
    expect(sessionReducer(cleared, { type: "adult" })).toEqual(cleared);
  });
  it("AC-02 starting another example requires fresh consent", () => {
    expect(sessionReducer(active, { type: "select" })).toEqual(selected);
  });
});
