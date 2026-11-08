import { handle } from "../../../../server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handle(request, "feedback");
}
