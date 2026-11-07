import { spawn } from 'node:child_process';
// This command never launches the real provider adapter with credentials or activation.
const child=spawn(process.execPath,['node_modules/@playwright/test/cli.js','test','--config','experiments/coach/playwright.config.ts',...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,COACH_TEST_MODE:'gemini',GEMINI_API_KEY:'',COACH_ACTIVATION_PATH:''}});
child.on('exit',code=>{process.exitCode=code??1;});
