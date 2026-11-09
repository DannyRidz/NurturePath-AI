import { handleTester, testerConfig } from "@/lib/rehearsal/tester-service";
export const maxDuration = 30;
export async function POST(request: Request) {
  return handleTester(request, "start", testerConfig());
}
