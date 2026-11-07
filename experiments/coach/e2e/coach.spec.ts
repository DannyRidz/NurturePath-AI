import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function results(page:Page){
 await page.goto("/start");await page.getByRole("button",{name:"Choose V01"}).click();
 await page.getByRole("checkbox",{name:/I understand this is a fictional example/}).check();await page.getByRole("button",{name:"Agree and continue"}).click();
 await page.getByRole("checkbox",{name:/I am 18 or older/}).check();await page.getByRole("button",{name:"Explore the example",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Immediate concerns",exact:true})).toBeFocused();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"Next section"}).click();
 await page.getByRole("button",{name:"Review answers",exact:true}).click();await page.getByRole("link",{name:"Get guidance"}).click();
 await expect(page.getByRole("heading",{name:"Your next step.",exact:true})).toBeVisible();
}
async function consent(page:Page){await page.getByRole("button",{name:"Help me prepare for a conversation"}).click();await page.getByLabel("Local experiment token").fill(process.env.COACH_TEST_TOKEN!);await page.getByRole("checkbox",{name:/I agree to send this fixed/}).check();}
const draft=(page:Page)=>page.getByRole("article",{name:"Simulated conversation draft"});
test("CO-01/02/03/08/09 truthful simulation, canonical facts, report exclusion and clear",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));const outbound:string[]=[];page.on("request",r=>{if(!r.url().startsWith("http://127.0.0.1:3000"))outbound.push(r.url());});
 await results(page);await page.getByRole("button",{name:"Help me prepare for a conversation"}).click();
 await expect(page.getByRole("button",{name:"Request simulated draft"})).toBeDisabled();await expect(page.getByRole("checkbox",{name:/I agree to send/})).not.toBeChecked();
 await page.getByLabel("Local experiment token").fill(process.env.COACH_TEST_TOKEN!);await page.getByRole("checkbox",{name:/I agree to send/}).check();
 const response=page.waitForResponse("**/api/coach");await page.getByRole("button",{name:"Request simulated draft"}).click();expect((await response).status()).toBe(200);
 await expect(draft(page)).toBeVisible();await expect(draft(page).getByRole("listitem")).toHaveCount(3);
 await expect(draft(page)).toContainText("Not applicable");expect(outbound).toEqual([]);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.locator(".coach-panel").screenshot({path:`output/playwright/coach-panel-${test.info().project.name}.png`});
 await page.screenshot({path:`output/playwright/coach-${test.info().project.name}.png`,fullPage:true});
 await page.getByRole("link",{name:/Preview complete report/}).click();await expect(page.getByRole("heading",{name:"Every fictional answer"})).toBeVisible();await expect(draft(page)).toHaveCount(0);
 await page.getByRole("link",{name:"Back to guidance",exact:true}).click();await expect(page.getByRole("button",{name:"Help me prepare for a conversation"})).toBeVisible();await expect(draft(page)).toHaveCount(0);
 await page.getByRole("button",{name:"Finish and clear",exact:true}).first().click();await page.goBack();await expect(page.getByRole("heading",{name:"No assessment is open."})).toBeVisible();expect(errors).toEqual([]);
});
test("CO-06 unavailable service preserves authored guidance and permits deliberate retry",async({page})=>{
 await results(page);await consent(page);await page.route("**/api/coach",r=>r.fulfill({status:503,contentType:"application/json",body:'{"status":"unavailable","code":"disabled"}'}));
 await page.getByRole("button",{name:"Request simulated draft"}).click();await expect(page.getByRole("status",{name:"Coach status"})).toContainText("unavailable");await expect(page.getByRole("heading",{name:"Your next step.",exact:true})).toBeVisible();await expect(draft(page)).toHaveCount(0);await expect(page.getByRole("button",{name:"Request simulated draft"})).toBeEnabled();
});
test("CO-07 dismiss, revoke and Hide discard current and delayed drafts",async({page})=>{
 await results(page);await consent(page);
 let release:()=>void=()=>{}, seen:()=>void=()=>{}, finish:()=>void=()=>{};
 const arrived=new Promise<void>(r=>seen=r), gate=new Promise<void>(r=>release=r), drained=new Promise<void>(r=>finish=r);
 // Hold a completed response, not an undispatched request. The local ledger must
 // settle before the deliberate retry; removing a route does not drain handlers.
 await page.route("**/api/coach",async route=>{
  const response=await route.fetch();expect(response.status()).toBe(200);seen();await gate;
  try{await route.fulfill({response});}catch{/* response canceled by dismissal */}finally{finish();}
 });
 await page.getByRole("button",{name:"Request simulated draft"}).click();await arrived;
 await expect(page.getByRole("button",{name:"Preparing simulated draft…"})).toBeDisabled();await page.getByRole("button",{name:"Dismiss coach"}).click();release();await drained;
 await expect(draft(page)).toHaveCount(0);await page.unroute("**/api/coach");await consent(page);await page.getByRole("button",{name:"Request simulated draft"}).click();await expect(draft(page)).toBeVisible();
 await page.getByRole("checkbox",{name:/I agree to send/}).uncheck();await expect(draft(page)).toHaveCount(0);await expect(page.getByLabel("Local experiment token")).toHaveValue("");
 await page.getByLabel("Local experiment token").fill(process.env.COACH_TEST_TOKEN!);await page.getByRole("checkbox",{name:/I agree to send/}).check();await page.getByRole("button",{name:"Request simulated draft"}).click();await expect(draft(page)).toBeVisible();
 await page.getByRole("button",{name:"Hide screen"}).click();await page.getByRole("button",{name:"Resume",exact:true}).click();await expect(draft(page)).toHaveCount(0);await expect(page.getByRole("button",{name:"Help me prepare for a conversation"})).toBeVisible();
});
test("CO-04 no coach or calls on an urgent example",async({page})=>{
 let count=0;page.on("request",r=>{if(r.url().includes("/api/coach"))count++;});await results(page);
 await page.getByLabel("Complete fictional example").selectOption("V08");
 await page.getByRole("button",{name:"Replace whole example"}).click();
 await expect(page.getByRole("heading",{name:"Seek urgent medical help now.",level:1})).toBeVisible();await expect(page.getByRole("button",{name:"Help me prepare for a conversation"})).toHaveCount(0);expect(count).toBe(0);
});
for(const action of ["clear","withdraw","hide","navigate","replace"] as const){
 test(`CO-07 pending response is discarded on ${action}`,async({page})=>{
  await results(page);await consent(page);
  let release:()=>void=()=>{}, seen:()=>void=()=>{};
  const gate=new Promise<void>(r=>release=r), arrived=new Promise<void>(r=>seen=r);
  await page.route("**/api/coach",async route=>{const response=await route.fetch();seen();await gate;try{await route.fulfill({response});}catch{/* discarded request */}});
  await page.getByRole("button",{name:"Request simulated draft"}).click();await arrived;
  if(action==="clear")await page.getByRole("button",{name:"Finish and clear",exact:true}).first().click();
  if(action==="withdraw")await page.getByRole("checkbox",{name:/I agree to send/}).uncheck();
  if(action==="hide")await page.getByRole("button",{name:"Hide screen"}).click();
  if(action==="navigate")await page.getByRole("link",{name:"Preview complete report"}).click();
  if(action==="replace"){await page.getByLabel("Complete fictional example").selectOption("V02");await page.getByRole("button",{name:"Replace whole example"}).click();}
  release();
  if(action==="hide")await page.getByRole("button",{name:"Resume",exact:true}).click();
  if(action==="navigate")await page.getByRole("link",{name:"Back to guidance",exact:true}).click();
  if(action==="clear"){await page.goBack();await expect(page.getByRole("heading",{name:"No assessment is open."})).toBeVisible();}
  await expect(draft(page)).toHaveCount(0);
  if(action==="withdraw"){await expect(page.getByRole("checkbox",{name:/I agree to send/})).not.toBeChecked();}
 });
}
test("CO-06 rejects malformed response and times out without automatic retry",async({page})=>{
 await results(page);await consent(page);let calls=0;
 await page.route("**/api/coach",async route=>{calls++;await route.fulfill({status:200,contentType:"application/json",body:'{"status":"draft","requestId":"wrong"}'});});
 await page.getByRole("button",{name:"Request simulated draft"}).click();await expect(page.getByRole("status",{name:"Coach status"})).toContainText("unavailable");expect(calls).toBe(1);await expect(draft(page)).toHaveCount(0);
 await page.unroute("**/api/coach");await page.clock.install();
 let release:()=>void=()=>{},seen:()=>void=()=>{};const gate=new Promise<void>(r=>release=r),arrived=new Promise<void>(r=>seen=r);
 await page.route("**/api/coach",async route=>{calls++;seen();await gate;try{await route.abort();}catch{}});
 await page.getByRole("button",{name:"Request simulated draft"}).click();await arrived;await page.clock.fastForward(18001);
 await expect(page.getByRole("status",{name:"Coach status"})).toContainText("unavailable");expect(calls).toBe(2);release();
});


test("CO-08 local simulation privacy excludes provider processing",async({page})=>{
 await page.goto("/privacy");await expect(page.getByRole("heading",{name:"Privacy and limits.",level:1})).toBeVisible();
 await expect(page.getByText("This mode uses an authored fixture",{exact:false})).toContainText("No request is made to Google");
});
