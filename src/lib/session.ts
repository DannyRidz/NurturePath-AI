export type Session = {
  variantId: "V01" | null;
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
  consent: null,
  section: 0,
  cleared: false,
};
export type SessionAction =
  | { type: "select" }
  | { type: "consent"; acceptedAt: string }
  | { type: "adult" }
  | { type: "section"; section: number }
  | { type: "clear" };

export function sessionReducer(state: Session, action: SessionAction): Session {
  switch (action.type) {
    case "select":
      return { ...emptySession, variantId: "V01" };
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
      return { ...emptySession, cleared: true };
  }
}

export function hasActiveSession(state: Session) {
  return state.variantId === "V01" && state.consent?.adultScope === true;
}
