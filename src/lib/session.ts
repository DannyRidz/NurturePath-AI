import { getScenario, variantIds, type VariantId } from "./scenario";

export type Session = {
  variantId: VariantId | null;
  viewRevision: number;
  announcement: string;
  consent: {
    noticeVersion: "notice-1";
    acceptedAt: string;
    adultScope: boolean;
  } | null;
  section: number;
  cleared: boolean;
};

export const emptySession: Session = {
  variantId: null,
  viewRevision: 0,
  announcement: "",
  consent: null,
  section: 0,
  cleared: false,
};
export type SessionAction =
  | { type: "select"; variantId?: VariantId }
  | { type: "switch"; variantId: VariantId }
  | { type: "consent"; acceptedAt: string }
  | { type: "adult" }
  | { type: "section"; section: number }
  | { type: "clear" };

export function sessionReducer(state: Session, action: SessionAction): Session {
  const nextRevision =
    state.viewRevision < 2147483647 ? state.viewRevision + 1 : 1;
  if (action.type === "switch" && state.viewRevision >= 2147483647)
    return { ...emptySession, cleared: true, viewRevision: 1 };
  switch (action.type) {
    case "select":
      return variantIds.includes(action.variantId ?? "V01")
        ? {
            ...emptySession,
            variantId: action.variantId ?? "V01",
            viewRevision: nextRevision,
          }
        : state;
    case "switch":
      return hasActiveSession(state) && variantIds.includes(action.variantId)
        ? {
            ...state,
            variantId: action.variantId,
            viewRevision: nextRevision,
            section: 0,
            announcement: `The whole fictional example has been replaced with ${getScenario(action.variantId).label}. All answers now belong to this example.`,
          }
        : state;
    case "consent":
      return state.variantId
        ? {
            ...state,
            consent: {
              noticeVersion: "notice-1",
              acceptedAt: action.acceptedAt,
              adultScope: false,
            },
          }
        : state;
    case "adult":
      return state.consent
        ? { ...state, consent: { ...state.consent, adultScope: true } }
        : state;
    case "section":
      return hasActiveSession(state) &&
        Number.isInteger(action.section) &&
        action.section >= 0 &&
        action.section < 4
        ? { ...state, section: action.section }
        : state;
    case "clear":
      return { ...emptySession, cleared: true, viewRevision: nextRevision };
  }
}

export function hasActiveSession(state: Session) {
  return (
    state.variantId !== null &&
    variantIds.includes(state.variantId) &&
    state.consent?.adultScope === true
  );
}
