// Isolated execution of the real frontend data adapters; never touches live services.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const evidence = path.resolve(process.argv[2]);
const cache = new Map();
let mode = 500;
let requests = [];
const fakeFetch = async (url) => {
  requests.push({url, outcome: mode});
  if (mode === 'offline') throw new TypeError('Simulated network unavailable');
  if (mode === 'timeout') throw new DOMException('Simulated timeout', 'TimeoutError');
  if (mode === 'empty') return new Response(JSON.stringify({events:[],total:0,page:1,limit:100,totalPages:0}), {status:200});
  return new Response('{}', {status:mode});
};
function load(file) {
  file = path.resolve(root,file);
  if(cache.has(file)) return cache.get(file).exports;
  const module = {exports:{}}; cache.set(file,module);
  const source = fs.readFileSync(file,'utf8');
  const code = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const req = id => {
    if(id==='react') return {useCallback:f=>f};
    if(id==='@/components/auth-provider') return {useKeycloakAuth:()=>({getAccessToken:async()=> 'synthetic-test-token'})};
    if(id.startsWith('@/')) return load(id.slice(2)+'.ts');
    throw new Error('Unexpected dependency: '+id);
  };
  const context = {module,exports:module.exports,require:req,fetch:fakeFetch,Response,AbortSignal,DOMException,console,URL,process:{env:{NEXT_PUBLIC_API_URL:'http://isolated.invalid'}}};
  vm.runInNewContext(code,context,{filename:file});
  return module.exports;
}
(async()=>{
 const catalog=load('lib/mock-api/events.ts');
 const fixtures=load('lib/mock/events.ts');
 const api=load('lib/api.ts').useApi();
 const results=[];
 for(mode of [401,403,404,409,422,500,'timeout','offline','empty']) {
   requests=[];
   let list = { events: [], total: 0 };
   let detail = null;
   try { list = await catalog.getEvents({limit:100}); } catch(e){ list = { events: [], total: 0, error: e.message }; }
   try { detail = await catalog.getEventBySlug(fixtures.mockEvents[0].slug); } catch(e){ detail = null; }
   let message;
   if(mode!=='empty') { try {await api('/api/v1/holds');} catch(e){message=e.message;} }
   results.push({injected:mode,listCount:list.events.length,listTotal:list.total,detailFallsBack:detail?.id===fixtures.mockEvents[0].id,errorMessage:message,requests});
 }
 fs.writeFileSync(path.join(evidence,'adapter-faults.json'),JSON.stringify(results,null,2));
 const spec=JSON.parse(fs.readFileSync(path.join(evidence,'openapi.body.txt'),'utf8').replace(/^\uFEFF/,''));
 const live=JSON.parse(fs.readFileSync(path.join(evidence,'events.body.txt'),'utf8').replace(/^\uFEFF/,''));
 const mapped=load('lib/catalog.ts').toPublicEvent(live.events[0]);
 const eventsPath=Object.keys(spec.paths).find(p=>p.replace(/\/$/,'')==='/api/v1/events');
 const contract={path:eventsPath,parameters:spec.paths[eventsPath].get.parameters,responses:spec.paths[eventsPath].get.responses,livePageKeys:Object.keys(live),sample:{idPreserved:mapped.id===live.events[0].id,slugPreserved:mapped.slug===live.events[0].slug,titlePreserved:mapped.title===live.events[0].name,apiStatus:live.events[0].status,uiStatus:mapped.status,apiPrice:live.events[0].sessions[0].ticketTypes[0].price,uiPrice:mapped.ticketTypes[0].price,apiCurrency:live.events[0].sessions[0].ticketTypes[0].currency,uiCurrency:mapped.currency}};
 fs.writeFileSync(path.join(evidence,'contract.json'),JSON.stringify(contract,null,2));
 console.log(JSON.stringify({results:results.map(({requests,...r})=>r),contract},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
