import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { publicCanonicalSummary } from "../src/lib/coach/facts";
import { geminiModel, publicNoticeVersion } from "../src/lib/coach/contract";

async function results(page:Page){
 await page.goto("/start");await page.getByRole("radio",{name:/General learning/}).check();await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("checkbox",{name:/I understand this is a made-up example/}).check();await page.getByRole("button",{name:"Agree and continue"}).click();
 await page.getByRole("checkbox",{name:/I am 18 or older/}).check();await page.getByRole("button",{name:"Explore the example",exact:true}).click();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Next section"}).click();
 await page.getByRole("button",{name:"Review answers",exact:true}).click();await page.getByRole("link",{name:"Get guidance"}).click();
 await page.getByRole("button",{name:"Help me prepare for a conversation"}).click();
 await page.getByRole("checkbox",{name:/I agree to send/}).check();
}
const draft=(page:Page)=>page.getByRole("article",{name:"AI conversation draft"});
function fakeDraft(requestId:string){return {status:"draft",requestId,variantId:"V01",catalogVersion:"sim-1",rulesVersion:"sim-1",contentVersion:"sim-1",noticeVersion:publicNoticeVersion,promptVersion:"coach-gemini-prompt-2",provider:"google",model:geminiModel,generatedAt:new Date().toISOString(),summary:publicCanonicalSummary(),questions:["What would I like to learn?","How could I organize my questions?","Which educational resources could we discuss?"],usage:{inputTokens:700,outputTokens:100,thinkingTokens:0,totalTokens:800,durationMs:20}};}

test.skip(process.env.NURTUREPATH_STATIC_PREVIEW === "1", "AI is excluded from the static artifact");

test("CO-01/02/06/08 Gemini disclosure, separate consent and actual disabled endpoint",async({page})=>{
 await results(page);await page.getByRole("checkbox",{name:/I agree to send/}).uncheck();
 await expect(page.getByRole("button",{name:"Request Gemini draft"})).toBeDisabled();
 await expect(page.locator(".coach-panel")).toContainText("not zero retention");
 await expect(page.locator(".coach-panel")).toContainText("cannot recall a sent request");
 await page.getByRole("checkbox",{name:/I agree to send/}).check();
 const response=page.waitForResponse("**/api/coach");await page.getByRole("button",{name:"Request Gemini draft"}).click();expect((await response).status()).toBe(503);
 await expect(page.getByRole("status",{name:"Coach status"})).toContainText("may still use credits");
 await expect(page.getByRole("heading",{name:"Your next step.",exact:true})).toBeVisible();await expect(draft(page)).toHaveCount(0);
});
test("CO-02/03/09 labelled draft, usage, keyboard action and report exclusion with a deterministic browser fixture",async({page})=>{
 await results(page);
 await page.route("**/api/coach",route=>route.fulfill({json:fakeDraft(route.request().postDataJSON().requestId)}));
 await page.getByRole("button",{name:"Request Gemini draft"}).focus();await page.keyboard.press("Enter");
 await expect(draft(page)).toBeVisible();await expect(draft(page).getByRole("listitem")).toHaveCount(3);
 await expect(draft(page)).toContainText(geminiModel);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.screenshot({path:`output/playwright/public-gemini-${test.info().project.name}.png`,fullPage:true});
 await page.getByRole("link",{name:"Preview complete report"}).click();await expect(draft(page)).toHaveCount(0);
 await expect(page.getByText(publicCanonicalSummary(),{exact:true})).toHaveCount(0);
 await page.getByRole("link",{name:"Back to guidance",exact:true}).click();await expect(draft(page)).toHaveCount(0);
});
test("CO-06 rejects simulation provenance in Gemini mode",async({page})=>{
 await results(page);await page.route("**/api/coach",route=>{const body=fakeDraft(route.request().postDataJSON().requestId);return route.fulfill({json:{...body,provider:"simulated",model:"authored-fixture-1"}});});
 await page.getByRole("button",{name:"Request Gemini draft"}).click();await expect(page.getByRole("status",{name:"Coach status"})).toContainText("unavailable");await expect(draft(page)).toHaveCount(0);
});
for(const action of ["withdraw","hide","clear","navigate","replace"] as const){
 test(`CO-07 Gemini late completion is discarded on ${action}`,async({page})=>{
  await results(page);let release!:()=>void,seen!:()=>void;const arrived=new Promise<void>(r=>seen=r),gate=new Promise<void>(r=>release=r);
  await page.route("**/api/coach",async route=>{const body=fakeDraft(route.request().postDataJSON().requestId);seen();await gate;try{await route.fulfill({json:body});}catch{}});
  await page.getByRole("button",{name:"Request Gemini draft"}).click();await arrived;
  if(action==="withdraw")await page.getByRole("checkbox",{name:/I agree to send/}).uncheck();
  if(action==="hide")await page.getByRole("button",{name:"Hide screen"}).click();
  if(action==="clear")await page.getByRole("button",{name:"Finish and clear",exact:true}).first().click();
  if(action==="navigate")await page.getByRole("link",{name:"Preview complete report"}).click();
  if(action==="replace"){await page.getByLabel("Complete fictional example").filter({visible:true}).selectOption("V08");await page.getByRole("button",{name:"Replace whole example"}).filter({visible:true}).click();}
  release();
  if(action==="hide")await page.getByRole("button",{name:"Resume",exact:true}).click();
  if(action==="navigate")await page.getByRole("link",{name:"Back to guidance",exact:true}).click();
  await expect(draft(page)).toHaveCount(0);
  if(action==="replace")await expect(page.getByRole("heading",{name:"Seek urgent medical help now.",level:1,exact:true}).filter({visible:true})).toBeVisible();
 });
}


test("PUB-4 public privacy describes provider and metadata processing",async({page})=>{
 await page.goto("/privacy");
 await expect(page.getByRole("heading",{name:"Privacy and limits.",level:1})).toBeVisible();
 await expect(page.getByText("With separate",{exact:false})).toContainText("Google");
 await expect(page.getByText("This version makes no analytics",{exact:false})).toHaveCount(0);
});
