import { handlePublicCoach, publicConfig } from "@/lib/coach/public-service";
export const maxDuration = 30;
export async function POST(request: Request) {
  return handlePublicCoach(request, publicConfig());
}
