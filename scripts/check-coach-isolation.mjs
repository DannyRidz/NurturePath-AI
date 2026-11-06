import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const routes=JSON.parse(await readFile('.next/server/app-paths-manifest.json','utf8'));
if(Object.keys(routes).some(route=>route.includes('/api/coach')))throw new Error('Coach endpoint entered the root build');
async function scan(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const path=join(directory,entry.name);if(entry.isDirectory()){if(entry.name==='experiments')throw new Error('Experiment output entered public export');await scan(path);}else if(/\.(html|js|txt|json)$/.test(entry.name)){const text=await readFile(path,'utf8');if(/coach-mock-notice-1|coach-gemini-notice-1|coach-gemini-prompt-1|generativelanguage.googleapis.com|authored-fixture-1|Local experiment token|\/api\/coach/.test(text))throw new Error('Coach code entered public export');}}}
await scan('out');
console.log('Production export excludes the coach endpoint and simulation UI.');
