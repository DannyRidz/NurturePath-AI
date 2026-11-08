import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const routes=JSON.parse(await readFile('.local/static-export-build/.next/server/app-paths-manifest.json','utf8'));
if(Object.keys(routes).some(route=>route.includes('/api/coach') || route.includes('rehearsal')))throw new Error('Coach endpoint entered the root build');
async function scan(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const path=join(directory,entry.name);if(entry.isDirectory()){if(entry.name==='experiments')throw new Error('Experiment output entered public export');await scan(path);}else if(/\.(html|js|txt|json)$/.test(entry.name)){const text=await readFile(path,'utf8');if(/coach-mock-notice-1|coach-gemini-notice-1|generativelanguage.googleapis.com|authored-fixture-1|Local experiment token|rehearsal-goals-1|REHEARSAL_LOCAL_TOKEN|UPSTASH_REDIS_REST_TOKEN|GEMINI_API_KEY/.test(text))throw new Error('Coach code entered public export');}}}
await scan('out');
console.log('Static artifact excludes API routes, provider transport, credentials and local experiment UI.');
