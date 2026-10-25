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
      viewRevision: active.viewRevision + 1,
      announcement: "",
    });
    expect(hasActiveSession(cleared)).toBe(false);
    expect(sessionReducer(cleared, { type: "section", section: 2 })).toEqual(
      cleared,
    );
    expect(sessionReducer(cleared, { type: "adult" })).toEqual(cleared);
  });
  it("AC-03 whole case replacement preserves consent and invalidates prior view", () => {
    const switched = sessionReducer(
      { ...active, section: 3 },
      { type: "switch", variantId: "V09" },
    );
    expect(switched.variantId).toBe("V09");
    expect(switched.consent).toEqual(active.consent);
    expect(switched.section).toBe(0);
    expect(switched.viewRevision).toBe(active.viewRevision + 1);
    expect(switched.announcement).toContain("whole fictional example");
    expect(
      sessionReducer(emptySession, { type: "switch", variantId: "V08" }),
    ).toEqual(emptySession);
  });
  it("AC-02 starting another example requires fresh consent", () => {
    expect(sessionReducer(active, { type: "select" })).toEqual({
      ...selected,
      viewRevision: active.viewRevision + 1,
    });
  });
});
