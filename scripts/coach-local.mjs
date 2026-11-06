import { mkdir, open, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
const command=process.argv[2] || 'dev';
if(!['init','dev','start','init-gemini','gemini','start-gemini'].includes(command))throw new Error('Unknown local coach command');
const real=command.includes('gemini');
const directory=resolve(process.env.COACH_LEDGER_PATH || (real?'.local/coach-gemini':'.local/coach-experiment'));
const experimentId=process.env.COACH_EXPERIMENT_ID || (real?'gemini-trial-1':'simulation-1');
if(process.env.VERCEL || process.env.NURTUREPATH_STATIC_PREVIEW || (real && process.env.CI)) throw new Error('Local operator experiment only');
async function hidden(prompt) {
  if(!process.stdin.isTTY)throw new Error('Use a local terminal for masked credential entry');
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');
  return new Promise((resolve,reject)=>{let value='';function input(chunk){for(const char of chunk){if(char==='\u0003'){cleanup();reject(new Error('Cancelled'));return;}if(char==='\r'||char==='\n'){cleanup();resolve(value);return;}if(char==='\u007f'){value=value.slice(0,-1);}else if(char>=' ')value+=char;}}function cleanup(){process.stdin.off('data',input);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');}process.stdin.on('data',input);});
}
if(command==='init' || command==='init-gemini') {
  await mkdir(directory,{recursive:true,mode:0o700});
  const file=await open(join(directory,'ledger.json'),'wx',0o600);
  try{await file.writeFile(JSON.stringify({experimentId,attempts:0,reservedCents:0}));await file.sync();}finally{await file.close();}
  console.log(real?'Initialized separate Gemini trial counters. No provider call made.':'Initialized simulation counters. Existing counters are never overwritten. No provider is connected.');
} else {
  let token=process.env.COACH_EXPERIMENT_TOKEN;
  if(!token)token=await hidden('Enter a 64 character hexadecimal local token (hidden): ');
  let apiKey;
  if(real){
    if(!process.env.COACH_ACTIVATION_PATH)throw new Error('Reviewed activation evidence path is required');
    apiKey=process.env.GEMINI_API_KEY || await hidden('Enter the Gemini API key (hidden, server memory only): ');
    if(!apiKey || apiKey.length<20)throw new Error('A Gemini API key is required');
  }
  if(!/^[a-f0-9]{64}$/i.test(token||''))throw new Error('A 64 character hexadecimal local token is required. It is never printed.');
  const lock=await open(join(directory,'runner.lock'),'wx',0o600);
  const mode=command.startsWith('start')?'start':'dev';
  const child=spawn(process.execPath,['node_modules/next/dist/bin/next',mode,'experiments/coach','--hostname','127.0.0.1','--port','3000'],{stdio:'inherit',env:{...process.env,GEMINI_API_KEY:real?apiKey:'',COACH_ADAPTER:real?'gemini':'mock',COACH_EXPERIMENT_ENABLED:'1',COACH_LEDGER_PATH:directory,COACH_EXPERIMENT_ID:experimentId,COACH_EXPERIMENT_TOKEN:token}});
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
  child.on('error',()=>{console.error('Local server failed. Reconcile local locks before restarting.');process.exitCode=1;});
  child.on('exit',async(code,signal)=>{await lock.close();if(code===0||signal==='SIGTERM'||signal==='SIGINT')await unlink(join(directory,'runner.lock'));process.exitCode=code??0;});
}
