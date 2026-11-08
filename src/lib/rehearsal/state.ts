import type { Envelope } from "./contract";
import type { Goal } from "./registry";
export type Question = {
  id: string;
  text: string;
  origin:
    | "User wording"
    | "Written starter"
    | "Simulated suggestion"
    | "Edited by you from a simulated suggestion";
};
export type RehearsalState = {
  goal: Goal;
  revision: number;
  text: string;
  textOrigin: Question["origin"];
  original: string;
  accepted: boolean;
  adult: boolean;
  acknowledged: boolean;
  ticket: string;
  rehearsalId: string;
  configuration: string;
  receipt: string;
  records: Envelope[];
  pending: string | null;
  closed: boolean;
  error: string;
  questions: Question[];
  selected: string[];
  sheet: boolean;
  includeFacts: boolean;
  includeComparison: boolean;
  hidden: boolean;
};
export const initial: RehearsalState = {
  goal: "G01",
  revision: 0,
  text: "",
  textOrigin: "User wording",
  original: "",
  accepted: false,
  adult: false,
  acknowledged: false,
  ticket: "",
  rehearsalId: "",
  configuration: "",
  receipt: "",
  records: [],
  pending: null,
  closed: false,
  error: "",
  questions: [],
  selected: [],
  sheet: false,
  includeFacts: false,
  includeComparison: false,
  hidden: false,
};
export type Action =
  | { type: "reset"; hidden?: boolean; goal?: Goal }
  | { type: "edit"; text: string; origin?: Question["origin"] }
  | { type: "boundary"; message: string }
  | {
      type: "check";
      key:
        | "accepted"
        | "adult"
        | "acknowledged"
        | "includeFacts"
        | "includeComparison";
      value: boolean;
    }
  | {
      type: "session";
      ticket: string;
      rehearsalId: string;
      configuration: string;
      revision: number;
    }
  | { type: "pending"; id: string }
  | { type: "feedback"; value: Envelope }
  | { type: "error"; message: string; closed?: boolean }
  | { type: "add"; question: Question }
  | { type: "select"; id: string }
  | { type: "move"; id: string; direction: -1 | 1 }
  | { type: "editQuestion"; id: string; text: string }
  | { type: "sheet"; value: boolean };
export function reducer(s: RehearsalState, a: Action): RehearsalState {
  switch (a.type) {
    case "reset":
      return {
        ...initial,
        revision: s.revision + 1,
        goal: a.goal ?? s.goal,
        hidden: a.hidden ?? false,
      };
    case "edit":
      return {
        ...s,
        text: a.text,
        textOrigin:
          a.origin ??
          (s.textOrigin.includes("suggestion")
            ? "Edited by you from a simulated suggestion"
            : "User wording"),
        revision: s.revision + 1,
        pending: null,
        sheet: false,
        error: "",
      };
    case "check":
      if (a.key === "accepted" && !a.value)
        return { ...initial, goal: s.goal, revision: s.revision + 1 };
      return { ...s, [a.key]: a.value };
    case "session":
      return a.revision === s.revision
        ? {
            ...s,
            ticket: a.ticket,
            rehearsalId: a.rehearsalId,
            configuration: a.configuration,
          }
        : s;
    case "pending":
      return s.pending ? s : { ...s, pending: a.id, error: "" };
    case "feedback": {
      const v = a.value;
      if (
        s.pending !== v.requestId ||
        v.revision !== s.revision ||
        s.rehearsalId !== v.rehearsalId ||
        s.goal !== v.goalId ||
        s.closed
      )
        return s;
      if (v.feedback.decision === "out_of_scope")
        return {
          ...s,
          pending: null,
          closed: true,
          records: [],
          questions: [],
          selected: [],
          receipt: "",
          error:
            "The simulated service declined this request. Use the written worksheet.",
        };
      const added: Question[] = [
        {
          id: `${v.requestId}-rewrite`,
          text: v.feedback.rewrite,
          origin: "Simulated suggestion",
        },
        ...v.feedback.followUps.map((text, i) => ({
          id: `${v.requestId}-${i}`,
          text,
          origin: "Simulated suggestion" as const,
        })),
      ];
      return {
        ...s,
        pending: null,
        original: s.original || s.text,
        receipt: v.receipt ?? s.receipt,
        records: [...s.records, v],
        questions: [...s.questions, ...added],
        error: "",
      };
    }
    case "boundary":
      return {
        ...s,
        pending: null,
        closed: true,
        records: [],
        questions: [],
        selected: [],
        receipt: "",
        error: a.message,
      };
    case "error":
      return {
        ...s,
        pending: null,
        error: a.message,
        closed: s.closed || !!a.closed,
      };
    case "add":
      return s.questions.some((q) => q.text === a.question.text)
        ? s
        : { ...s, questions: [...s.questions, a.question] };
    case "select":
      return {
        ...s,
        selected: s.selected.includes(a.id)
          ? s.selected.filter((id) => id !== a.id)
          : s.selected.length < 3
            ? [...s.selected, a.id]
            : s.selected,
      };
    case "move": {
      const ids = [...s.selected],
        i = ids.indexOf(a.id),
        j = i + a.direction;
      if (i < 0 || j < 0 || j >= ids.length) return s;
      [ids[i], ids[j]] = [ids[j], ids[i]];
      return { ...s, selected: ids };
    }
    case "editQuestion":
      return {
        ...s,
        sheet: false,
        questions: s.questions.map((q) =>
          q.id === a.id
            ? {
                ...q,
                text: a.text,
                origin: q.origin.includes("suggestion")
                  ? "Edited by you from a simulated suggestion"
                  : q.origin,
              }
            : q,
        ),
      };
    case "sheet":
      return { ...s, sheet: a.value };
  }
}
