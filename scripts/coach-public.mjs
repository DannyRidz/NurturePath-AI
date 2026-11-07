import { createServer } from 'vite';
const command = process.argv[2] || 'config';
if (!['config', 'init', 'status', 'disable', 'enable'].includes(command)) throw new Error('Unknown operator command');
const loader = await createServer({configFile:false, appType:'custom', server:{middlewareMode:true,hmr:false,ws:false,watch:null}});
try {
  const { configurationHash, publicGeminiRequestBody } = await loader.ssrLoadModule('/src/lib/coach/gemini.ts');
  const { redisCommand } = await loader.ssrLoadModule('/src/lib/coach/admission.ts');
  const fingerprint = configurationHash(), budgetKey = '{nurturepath-coach}:gemini-public-1:budget';
  if(command === 'config') {
    console.log(JSON.stringify({releaseId:'gemini-public-1',model:'gemini-3.1-flash-lite',configurationHash:fingerprint,requestBytes:Buffer.byteLength(publicGeminiRequestBody()),maxAttempts:60,maxReservedCents:100},null,2));
  } else {
    const url = process.env.COACH_KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || await prompt('Upstash REST URL (hidden): ',true);
    const parsed = new URL(url);
    if(parsed.protocol!=='https:' || !parsed.hostname.endsWith('.upstash.io') || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname!=='/' || parsed.port) throw new Error('Invalid store URL');
    const token = process.env.COACH_KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || await prompt('Upstash REST token (hidden): ',true);
    if(token.length<20)throw new Error('Store token required');
    const store = {url,token};
    if(command === 'init') {
      const script = `if redis.call('EXISTS',KEYS[1]) ~= 0 then return 0 end redis.call('HSET',KEYS[1],'enabled','0','fingerprint',ARGV[1],'maxAttempts','60','maxCents','100','attempts','0','reservedCents','0') return 1`;
      const result = await redisCommand(store,['EVAL',script,1,budgetKey,fingerprint]);
      if(result.result!==1) throw new Error('Existing release was preserved. Inspect status; never reset counters.');
      console.log('Initialized the approved public allowance in disabled state. No Gemini call made.');
    } else if(command === 'status') {
      const result = await redisCommand(store,['HMGET',budgetKey,'enabled','attempts','reservedCents','maxAttempts','maxCents','fingerprint']);
      if(!Array.isArray(result.result)||result.result.length!==6)throw new Error('Invalid store response');
      console.log(JSON.stringify(Object.fromEntries(['enabled','attempts','reservedCents','maxAttempts','maxCents','fingerprint'].map((name,i)=>[name,result.result[i]])),null,2));
    } else if(command === 'disable') {
      const result=await redisCommand(store,['EVAL',`if redis.call('EXISTS',KEYS[1])==0 then return 0 end redis.call('HSET',KEYS[1],'enabled','0') return 1`,1,budgetKey]);
      if(result.result!==1)throw new Error('No initialized release.');
      console.log('Public admission disabled. Sent requests may still bill. Counters retained.');
    } else {
      console.log('Enable only after checking output, provider usage, account processing, current prices and any pending request. This does not reset counters or increase the approved allowance.');
      if(await prompt('Type RECONCILED to enable the approved release: ',false)!=='RECONCILED')throw new Error('Cancelled');
      const script=`local s=redis.call('HMGET',KEYS[1],'fingerprint','maxAttempts','maxCents','attempts','reservedCents') local n=tonumber(s[4]) if s[1]~=ARGV[1] or s[2]~='60' or s[3]~='100' or not n or n<0 or n~=math.floor(n) or n>=60 or s[4]~=s[5] then return 0 end redis.call('HSET',KEYS[1],'enabled','1') return 1`;
      const result=await redisCommand(store,['EVAL',script,1,budgetKey,fingerprint]);
      if(result.result!==1)throw new Error('Mismatched, missing, corrupt or exhausted release.');
      console.log('Public admission enabled within the existing allowance. No Gemini call made by this command.');
    }
  }
} finally { await loader.close(); }
async function prompt(label, masked) {
  if(!process.stdin.isTTY)throw new Error('Use a terminal for operator entry');
  process.stdout.write(label);process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');
  return new Promise((resolve,reject)=>{let value='';const cleanup=()=>{process.stdin.off('data',input);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');};function input(chunk){for(const char of chunk){if(char==='\u0003'){cleanup();reject(new Error('Cancelled'));return;}if(char==='\r'||char==='\n'){cleanup();resolve(value);return;}if(char==='\u007f'){value=value.slice(0,-1);if(!masked)process.stdout.write('\b \b');}else if(char>=' '){value+=char;if(!masked)process.stdout.write(char);}}}process.stdin.on('data',input);});
}
