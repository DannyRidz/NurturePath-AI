import { defineConfig, devices } from "@playwright/test";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
// A synthetic test access token, valid only for this spawned local test server.
const token=process.env.COACH_TEST_TOKEN || randomBytes(32).toString("hex");
process.env.COACH_TEST_TOKEN=token;
const directory=resolve(".local",`coach-e2e-${randomUUID()}`);
mkdirSync(directory,{recursive:true});
writeFileSync(`${directory}/ledger.json`,JSON.stringify({experimentId:"browser",attempts:0,reservedCents:0}),{mode:0o600});
export default defineConfig({
 testDir:"./e2e", workers:1, fullyParallel:false, retries:0, reporter:"list", outputDir:"../../output/playwright/coach-results",
 use:{baseURL:"http://127.0.0.1:3000",trace:"retain-on-failure",screenshot:"only-on-failure"},
 projects:[{name:"desktop",use:{...devices["Desktop Chrome"]}},{name:"mobile",use:{...devices["iPhone 13"],defaultBrowserType:"chromium"}},{name:"webkit",use:{...devices["Desktop Safari"]}},{name:"webkit-mobile",use:{...devices["iPhone 13"],defaultBrowserType:"webkit"}},{name:"firefox",use:{...devices["Desktop Firefox"]}}],
 webServer:{command:"npm run start:coach",url:"http://127.0.0.1:3000",reuseExistingServer:false,timeout:60000,env:{COACH_EXPERIMENT_TOKEN:token,COACH_LEDGER_PATH:directory,COACH_EXPERIMENT_ID:"browser"}},
});
