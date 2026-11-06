import { handleCoach } from "../../../lib/service";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleCoach(request, {
    enabled: process.env.COACH_EXPERIMENT_ENABLED === "1" && process.env.COACH_ADAPTER === "mock",
    token: process.env.COACH_EXPERIMENT_TOKEN,
    ledgerPath: process.env.COACH_LEDGER_PATH,
    experimentId: process.env.COACH_EXPERIMENT_ID,
    hosted: Boolean(process.env.VERCEL || process.env.NURTUREPATH_STATIC_PREVIEW),
  });
}
