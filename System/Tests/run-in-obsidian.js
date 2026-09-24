// Run via QuickAdd: Test vault workflows. Fixtures are confined to unique test roots.
module.exports = async ({app, quickAddApi, obsidian}) => {
 const {Component, MarkdownRenderer, Notice, moment} = obsidian;
 const stateKey = '__academicVaultTests';
 if (window[stateKey]?.running) throw new Error('Vault tests are already running.');
 const id = `vault-test-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
 const report = {runId:id,started:new Date().toISOString(),running:true,tests:[],cleanup:[],fixtureRoots:[]};
 window[stateKey] = report;
 const originalLeaf=app.workspace.getMostRecentLeaf();
 const roots={work:`Work/${id}`,items:`Library/Items/${id}`,sessions:`Library/Sessions/${id}`,daily:`Daily/Startup/${id}`,archive:`Daily/Archive/${id}`,views:`System/Tests/Fixtures/${id}`};
 const owned=[]; const renders=[]; const ownedModals=new Set(); const productionBefore=new Map(); let leaf; let readingChoice;
 const dv=app.plugins.plugins.dataview?.api;
 const assert=(condition,message)=>{if(!condition)throw Error(message)};
 const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 async function wait(fn,message,timeout=15000){const start=Date.now();do{const value=await fn();if(value)return value;await sleep(100)}while(Date.now()-start<timeout);throw Error('Timed out: '+message)}
 async function test(name,fn){const start=Date.now();try{await fn();report.tests.push({name,status:'passed',ms:Date.now()-start})}catch(e){report.tests.push({name,status:'failed',error:e.stack||String(e),ms:Date.now()-start})}}
 const get=p=>app.vault.getAbstractFileByPath(p);
 async function folder(p){if(get(p))return;const parent=p.slice(0,p.lastIndexOf('/'));if(parent)await folder(parent);await app.vault.createFolder(p)}
 async function write(p,text){assert(Object.values(roots).some(root=>p.startsWith(root+'/')),'Write outside fixture roots: '+p);await folder(p.slice(0,p.lastIndexOf('/')));assert(!get(p),'Fixture already exists: '+p);return app.vault.create(p,text)}
 async function indexed(file,predicate=()=>true){return wait(()=>{const p=dv.page(file.path);return p&&predicate(p)?p:null},'metadata index for '+file.path)}
 async function open(file){await leaf.openFile(file,{state:{mode:'source',source:false}});app.workspace.setActiveLeaf(leaf,{focus:true});await wait(()=>app.workspace.getActiveFile()?.path===file.path&&leaf.view.editor,'active fixture editor');return leaf.view}
 async function set(file,values){await app.fileManager.processFrontMatter(file,fm=>Object.assign(fm,values));await wait(()=>{const fm=app.metadataCache.getFileCache(file)?.frontmatter;return fm&&Object.entries(values).every(([key,value])=>JSON.stringify(fm[key])===JSON.stringify(value))},"saved properties for "+file.path);await indexed(file,p=>!("status" in values)||JSON.stringify(p.status?.array?p.status.array():p.status)===JSON.stringify(values.status))}
 async function copyFolder(source,dest){await folder(dest);for(const child of [...source.children]){if(child.children)await copyFolder(child,`${dest}/${child.name}`);else await write(`${dest}/${child.name}`,await app.vault.read(child))}}
 function scope(text){return text.replaceAll('"Work"',JSON.stringify(roots.work)).replaceAll('"Library/Items"',JSON.stringify(roots.items)).replaceAll('"Library/Sessions"',JSON.stringify(roots.sessions)).replaceAll('"Daily/Startup"',JSON.stringify(roots.daily)).replaceAll('"Daily/Archive"',JSON.stringify(roots.archive))}
 async function scopedPage(source){return write(`${roots.views}/${source.split('/').pop()}`,scope(await app.vault.read(get(source))))}
 function blocks(text){return [...text.matchAll(/^```dataview\n([\s\S]*?)^```/gm)].map(m=>m[1])}
 async function query(file,index){const text=await app.vault.read(file);const result=await dv.query(blocks(text)[index],file.path);assert(result.successful,result.error);return result.value}
 async function render(file){const component=new Component();component.load();const el=document.createElement('div');el.className='markdown-preview-view vault-workflow-test';Object.assign(el.style,{position:'fixed',top:'0',left:'0',width:'1000px',height:'800px',opacity:'0',pointerEvents:'none'});document.body.appendChild(el);renders.push({component,el});await MarkdownRenderer.render(app,await app.vault.read(file),el,file.path,component);return el}
 function noErrors(el){assert(!el.querySelector('.dataview-error,.markdown-render-error'),el.textContent);assert(!/Tasks query:|Evaluation Error:|Dataview: Error/.test(el.textContent),el.textContent)}
 const tasksIn=el=>[...el.querySelectorAll('.block-language-dataviewjs .task-list-item')];
 async function runNamedResearch(name){let rejected;const pending=quickAddApi.executeChoice('New research log');pending.catch(e=>{rejected=e});const input=await wait(()=>{if(rejected)throw rejected;return [...document.querySelectorAll('.modal-container')].filter(el=>el.textContent.includes('Research log name')).map(el=>el.querySelector('input')).find(Boolean)},'research name prompt');ownedModals.add(input.closest('.modal-container'));input.value=name;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true,cancelable:true}));await pending;return app.workspace.getActiveFile()}
 try {
  assert(dv,'Dataview is not enabled');assert(app.plugins.plugins['obsidian-tasks-plugin'],'Tasks is not enabled');
  assert(!document.querySelector('.modal-container'),'Close existing dialogs before running tests.');
  for(const file of app.vault.getMarkdownFiles())productionBefore.set(file.path,await app.vault.read(file));
  for(const root of Object.values(roots)){assert(!get(root),'Test root collision');await folder(root);owned.push(root)}
  report.fixtureRoots=[...owned];
  leaf=app.workspace.getLeaf('tab');
  const projectFolder=`${roots.work}/Active (test)+`;
  await copyFolder(get('System/Templates/Project Blueprint'),projectFolder);
  const project=get(`${projectFolder}/Project.md`);await indexed(project);
  await test('Project creation: complete blueprint and default properties',async()=>{
   const p=await indexed(project);assert(p.type==='project','Project type missing');assert(JSON.stringify(p.status.array?p.status.array():p.status)==='["active"]','Default status must be an active list');assert(p.areas.length===0,'Areas must start empty');
   for(const suffix of ['Milestones.md','Scratch/Scratch Index.md','Research Log/Research Log Index.md'])assert(get(`${projectFolder}/${suffix}`),'Missing '+suffix);
  });
  await test('Project properties: status and areas persist and render as editable properties',async()=>{
   await set(project,{status:['paused'],areas:['test-area']});await set(project,{status:['active']});await open(project);
   const row=await wait(()=>leaf.view.containerEl.querySelector('[data-property-key="status"]'),'status Properties row');assert(row.textContent.includes('active'),'Status is not rendered');assert((await indexed(project)).areas.includes('test-area'),'Area value lost');
  });
  const milestones=get(`${projectFolder}/Milestones.md`);
  await app.vault.modify(milestones,'# Milestones\n\n## Test outcome\n\n- [ ] ACTIVE_TASK\n- [x] COMPLETED_TASK\n');await indexed(milestones,p=>p.file.tasks.some(t=>t.text==='ACTIVE_TASK'));
  const scratch=await write(`${projectFolder}/Scratch/Test scratch.md`,'- [ ] SCRATCH_TASK\n');await indexed(scratch);
  const pausedFolder=`${roots.work}/Paused`;
  await copyFolder(get('System/Templates/Project Blueprint'),pausedFolder);await indexed(get(`${pausedFolder}/Project.md`));await set(get(`${pausedFolder}/Project.md`),{status:['paused']});
  await app.vault.modify(get(`${pausedFolder}/Milestones.md`),'# Milestones\n- [ ] PAUSED_TASK\n');await indexed(get(`${pausedFolder}/Milestones.md`),p=>p.file.tasks.some(t=>t.text==='PAUSED_TASK'));
  let entry;
  await test('Research capture: actual QuickAdd macro accepts a name and opens a timestamped entry',async()=>{
   await open(scratch);entry=await runNamedResearch('Research integration entry');assert(entry.path.startsWith(`${projectFolder}/Research Log/Research integration entry — `),'Wrong project/name: '+entry.path);assert(/\d{4}-\d{2}-\d{2} \d{6}-\d{3}\.md$/.test(entry.path),'Missing date/time');
   const p=await indexed(entry);assert(p.type==='research-log','Wrong entry type');assert(app.metadataCache.getFirstLinkpathDest(p.project.path,entry.path)?.path===project.path,'Wrong project link');assert(p.logged_at,'Timestamp missing');assert(leaf.view.getState().source===false,'Entry did not open in Live Preview');
  });
  await test('Research capture: actual prompt cancellation creates no entry',async()=>{
   await open(project);const before=app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(projectFolder+'/Research Log/')).length;
   let rejected;const pending=quickAddApi.executeChoice('New research log');pending.catch(e=>{rejected=e});const modal=await wait(()=>{if(rejected)throw rejected;return [...document.querySelectorAll('.modal-container')].find(el=>el.textContent.includes('Research log name'))},'cancel prompt');ownedModals.add(modal);
   const close=[...modal.querySelectorAll('button')].find(b=>b.textContent==='Cancel');assert(close,'Cancel button missing');close.click();await pending.catch(e=>{assert(/cancel|abort/i.test(String(e)),String(e))});
   assert(app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(projectFolder+'/Research Log/')).length===before,'Cancellation created a file');
  });
  let resource;
  await test('Resource creation: core Insert template creates the intended metadata',async()=>{
   resource=await write(`${roots.items}/Reading resource.md`,'');await open(resource);assert(app.workspace.getActiveFile()?.path===resource.path,'Not on fixture');
   await app.internalPlugins.plugins.templates.instance.insertTemplate(get('System/Templates/Resource.md'));
   await wait(async()=>(await app.vault.read(resource)).includes('type: resource'),'resource template saved');const p=await indexed(resource);
   assert(p.type==='resource'&&p.progress===0&&p.kind==='paper','Resource defaults incorrect');assert(p.status.includes('saved'),'Saved status missing');assert(p.authors.length===0&&p.projects.length===0,'List properties missing');
  });
  assert(resource,'Resource setup failed');await set(resource,{status:['reading'],authors:['Test Author'],progress:25,position:'Page 10'});
  const finished=await write(`${roots.items}/Finished resource.md`,(await app.vault.read(get('System/Templates/Resource.md'))));await indexed(finished);await set(finished,{status:['finished'],finished_on:'2026-09-24',progress:100});
  const stopped=await write(`${roots.items}/Stopped resource.md`,await app.vault.read(get('System/Templates/Resource.md')));await indexed(stopped);await set(stopped,{status:['stopped']});
  const legacy=await write(`${roots.items}/Legacy resource.md`,await app.vault.read(get('System/Templates/Resource.md')));await indexed(legacy);await set(legacy,{status:'reading'});
  const falseMatch=await write(`${roots.items}/Not reading resource.md`,await app.vault.read(get('System/Templates/Resource.md')));await indexed(falseMatch);await set(falseMatch,{status:['notreading']});
  const home=await scopedPage('Home.md'), library=await scopedPage('Library/Library.md'), history=await scopedPage('Daily/History.md'), projects=await scopedPage('Work/Projects.md');
  await test('Home: currently-reading query includes list and legacy text statuses only',async()=>{const result=await query(home,2);const paths=result.values.map(row=>row[0].path);assert(paths.length===2&&paths.includes(resource.path)&&paths.includes(legacy.path),'Wrong reading resources: '+JSON.stringify(paths))});
  await test('Library: finished resources remain in the finished-items view',async()=>{const result=await query(library,0);assert(result.values.length===1&&result.values[0][0].path===finished.path,'Wrong finished resources')});
  await test('Daily startup: core daily-note creation expands the template and is idempotent',async()=>{
   const daily=Object.create(app.internalPlugins.plugins['daily-notes'].instance);daily.options={...daily.options,folder:roots.daily};const first=await daily.getDailyNote(moment());const second=await daily.getDailyNote(moment());assert(first.path===second.path,'Daily creation duplicated');const text=await app.vault.read(first);assert(!text.includes('{{'),'Unexpanded daily tokens');await indexed(first);const result=await query(home,0);assert(result.values.length===3,'Expected three startup prompts');
  });
  await test('Reading capture: real QuickAdd template creates unique timestamped events',async()=>{
   const plugin=app.plugins.plugins.quickadd;const source=plugin.settings.choices.find(c=>c.name==='Log reading');assert(source,'Log reading command missing');readingChoice=JSON.parse(JSON.stringify(source));readingChoice.id=id;readingChoice.name=id;readingChoice.command=false;readingChoice.folder.folders=[roots.sessions];readingChoice.openFile=false;plugin.settings.choices.push(readingChoice);
   await quickAddApi.executeChoice(id);await quickAddApi.executeChoice(id);
   const events=app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(roots.sessions+'/'));assert(events.length===2,'Expected two unique events');for(const event of events){const p=await indexed(event);assert(p.type==='reading-event'&&p.logged_at,'Invalid reading event');assert(!/\{\{/.test(await app.vault.read(event)),'Unexpanded reading token');await set(event,{resource:`[[${resource.path.slice(0,-3)}]]`})}
  });
  await test('History and Home: reading events render with resource links',async()=>{const full=await query(history,0),recent=await query(home,3);assert(full.values.length===2&&recent.values.length===2,'Events missing from dashboards');const el=await render(history);await wait(()=>el.querySelectorAll('.dataview.table-view-table').length>0,'History table');await wait(()=>el.textContent.includes('Reading resource'),'History resource link');noErrors(el)});
  await test('Project dashboard: overview links to milestones and both indexes',async()=>{for(const [index,suffix]of [[0,'Milestones.md'],[1,'Scratch/Scratch Index.md'],[2,'Research Log/Research Log Index.md']]){const result=await query(project,index);assert(result.values.some(link=>link.path===`${projectFolder}/${suffix}`),'Missing '+suffix)}const el=await render(project);await wait(()=>el.textContent.includes('Research Log Index'),'Project links rendered');noErrors(el)});
  await test('Research index: new entry appears without manually adding a link',async()=>{assert(entry,'Capture prerequisite failed');const index=get(`${projectFolder}/Research Log/Research Log Index.md`);const result=await query(index,0);assert(result.values.some(row=>row[0].path===entry.path),'Research entry missing');const el=await render(index);await wait(()=>el.textContent.includes('Research integration entry'),'Research table rendered');noErrors(el)});
  await test('Projects directory: active and paused projects both remain visible',async()=>{const result=await query(projects,0);assert(result.values.length===2,'Projects directory lost a project');const el=await render(projects);await wait(()=>{const table=el.querySelector('.table-view-table');return table&&table.textContent.includes('paused')&&table.textContent.includes('active')},'Project status table');noErrors(el)});
  let homeEl;
  await test('Home rendering: active tasks and scratch tasks show, paused/completed tasks do not',async()=>{homeEl=await render(home);await wait(()=>tasksIn(homeEl).some(el=>el.textContent.includes('ACTIVE_TASK')),'Active task render');const text=tasksIn(homeEl).map(el=>el.textContent).join('\n');assert(text.includes('SCRATCH_TASK')&&!text.includes('PAUSED_TASK')&&!text.includes('COMPLETED_TASK'),'Incorrect task filtering: '+text);noErrors(homeEl)});
  await test('Home interaction: clicking a task updates only its source checkbox',async()=>{assert(homeEl,'Home render prerequisite failed');const row=tasksIn(homeEl).find(el=>el.textContent.includes('ACTIVE_TASK'));assert(row,'Active checkbox absent');const checkbox=row.querySelector('input[type="checkbox"]');assert(checkbox,'Task checkbox not interactive');checkbox.click();await wait(async()=>/\[x\] ACTIVE_TASK/.test(await app.vault.read(milestones)),'source task completion');assert(/\[ \] PAUSED_TASK/.test(await app.vault.read(get(`${pausedFolder}/Milestones.md`))),'Unrelated task changed')});
  await test('Home interaction: changing project status removes its tasks',async()=>{await set(project,{status:['archived']});const el=await render(home);await wait(()=>el.textContent.includes('No open tasks from active projects.'),'Archived task exclusion');assert(tasksIn(el).length===0,'Archived tasks remain visible');noErrors(el);await set(project,{status:['active']})});
  await test('Bases catalog: resources render as table rows, including finished and stopped items',async()=>{
   const baseText=(await app.vault.read(get('Library/Catalog.base'))).replaceAll('"Library/Items"',JSON.stringify(roots.items));const base=await write(`${roots.views}/Catalog.base`,baseText);
   await app.vault.modify(library,(await app.vault.read(library)).replace('![[Library/Catalog.base]]',`![[${base.path}]]`));
   const el=await render(library);await wait(()=>el.querySelector('.bases-view'),'Bases catalog view',20000);await wait(()=>el.textContent.includes('Reading resource')&&el.textContent.includes('Stopped resource'),'Catalog resource rows',20000);assert(el.textContent.includes('Finished resource'),'Finished resource missing from catalog');noErrors(el);
  });
  await test('Index Checker: detects an unlinked scratchpad, then clears after linking',async()=>{
   const plugin=app.plugins.plugins['index-checker'];assert(plugin,'Index Checker missing');const scan=async()=>{const saved=plugin.indexedFoldersP;try{plugin.indexedFoldersP=[];plugin.processFolder(get(projectFolder));return await Promise.all(plugin.indexedFoldersP)}finally{plugin.indexedFoldersP=saved}};
   let results=await scan();assert(results.length===1&&results[0].index.name==='Scratch Index.md','Automatic research index incorrectly checked');assert(results[0].missingChildren.some(f=>f.path===scratch.path),'Missing scratch link not detected');
   const index=get(`${projectFolder}/Scratch/Scratch Index.md`);await app.vault.append(index,`\n[[${scratch.path.slice(0,-3)}]]\n`);await wait(()=>Object.keys(app.metadataCache.resolvedLinks[index.path]||{}).includes(scratch.path),'scratch link indexed');results=await scan();assert(results[0].missingChildren.length===0,'Linked scratchpad still reported missing');
  });
  await test('Resource lifecycle: finishing removes an item from Home, preserves history, and rereading restores it',async()=>{
   await set(resource,{status:['finished']});
   let reading=await query(home,2),done=await query(library,0),events=await query(history,0);
   assert(!reading.values.some(row=>row[0].path===resource.path),'Finished resource remains on Home');
   assert(done.values.some(row=>row[0].path===resource.path),'Finished resource disappeared from library');
   assert(events.values.length===2,'Reading history was lost');
   await set(resource,{status:['reading']});reading=await query(home,2);
   assert(reading.values.some(row=>row[0].path===resource.path),'Rereading resource did not return to Home');
  });
  await test('Startup archival: moving the checklist clears Home but preserves History',async()=>{
   const current=get(`${roots.daily}/${moment().format('YYYY-MM-DD')}.md`);assert(current,'Daily fixture missing');
   const original=current.path;await app.fileManager.renameFile(current,`${roots.archive}/${current.name}`);
   await wait(()=>!dv.page(original)&&dv.page(current.path),'archived daily index');
   assert((await query(home,0)).values.length===0,'Archived checklist remains on Home');
   assert((await query(history,1)).values.some(link=>link.path===current.path),'Archived checklist missing from History');
   await app.fileManager.renameFile(current,original);await indexed(current);
  });
  await test('Home limit: only five currently-reading resources, newest first',async()=>{
   let newest;const now=Date.now();
   for(let i=0;i<6;i++){const f=await write(`${roots.items}/Limit reading ${i}.md`,'---\ntype: resource\nstatus: [reading]\n---\n');const content=await app.vault.read(f);await app.vault.modify(f,content,{mtime:now+(i+1)*1000});await indexed(f);newest=f}
   await wait(async()=>{const r=await query(home,2);return r.values.length===5&&r.values[0][0].path===newest.path},'reading limit and order');
  });
  await test('Home limit: only six recently edited research entries, newest first',async()=>{
   let newest;const now=Date.now();
   for(let i=0;i<7;i++){const f=await write(`${projectFolder}/Research Log/Limit entry ${i}.md`,'---\ntype: research-log\n---\n');const content=await app.vault.read(f);await app.vault.modify(f,content,{mtime:now+(i+1)*1000});await indexed(f);newest=f}
   await wait(async()=>{const r=await query(home,1);return r.values.length===6&&r.values[0][0].path===newest.path},'research limit and order');
  });
  await test('Home limit: six recent reading events; History keeps all events',async()=>{
   let newest;
   for(let i=0;i<6;i++){const f=await write(`${roots.sessions}/Limit reading event ${i}.md`,`---\ntype: reading-event\nlogged_at: "${moment().add(i+1,'minutes').format('YYYY-MM-DDTHH:mm:ssZ')}"\nresource: "[[${resource.path.slice(0,-3)}]]"\n---\n`);await indexed(f);newest=f}
   const recent=await query(home,3),all=await query(history,0);
   assert(recent.values.length===6&&recent.values[0][0].path===newest.path,'Wrong recent event limit/order');assert(all.values.length===8,'History incorrectly truncates events');
  });
  await test('Home limit: at most twelve open project tasks render',async()=>{
   await app.vault.append(milestones,'\n'+Array.from({length:15},(_,i)=>`- [ ] LIMIT_TASK_${i}`).join('\n')+'\n');await indexed(milestones,p=>p.file.tasks.some(t=>t.text==='LIMIT_TASK_14'));
   const el=await render(home);await wait(()=>tasksIn(el).length===12,'12-task limit');assert(!tasksIn(el).some(row=>row.textContent.includes('PAUSED_TASK')),'Paused tasks leaked into limited results');noErrors(el);
  });
  await test('Every production Dataview query parses and evaluates',async()=>{for(const file of app.vault.getMarkdownFiles().filter(f=>!Object.values(roots).some(root=>f.path.startsWith(root+'/')))){for(const queryText of blocks(await app.vault.cachedRead(file))){const result=await dv.query(queryText,file.path);assert(result.successful,`${file.path}: ${result.error}`)}}});
 }catch(e){report.tests.push({name:'Suite setup or prerequisite',status:'failed',error:e.stack||String(e)})}
 finally {
  for(const modal of ownedModals){if(modal?.isConnected)[...modal.querySelectorAll('button')].find(b=>b.textContent==='Cancel')?.click()}
  for(const {component,el}of renders){component.unload();el.remove()}
  if(readingChoice){const choices=app.plugins.plugins.quickadd.settings.choices;const i=choices.indexOf(readingChoice);if(i>=0)choices.splice(i,1)}
  if(leaf)leaf.detach();if(originalLeaf?.view)app.workspace.setActiveLeaf(originalLeaf,{focus:true});
  for(const root of owned.reverse()){try{const f=get(root);if(f)await app.vault.delete(f,true);report.cleanup.push({path:root,removed:!get(root)})}catch(e){report.cleanup.push({path:root,error:String(e)})}}
  if(productionBefore.size)await test('Isolation: production notes remain unchanged',async()=>{for(const [path,content]of productionBefore){const file=get(path);assert(file,'Production note removed: '+path);assert(await app.vault.read(file)===content,'Production note changed during the run: '+path)}});
  report.finished=new Date().toISOString();report.passed=report.tests.filter(t=>t.status==='passed').length;report.failed=report.tests.filter(t=>t.status==='failed').length;
  report.running=false;report.ok=report.failed===0&&report.cleanup.every(c=>c.removed);
  await folder('System/Tests/Results');await app.vault.adapter.write('System/Tests/Results/latest.json',JSON.stringify(report,null,2)+'\n');
  new Notice(`Vault tests: ${report.passed} passed, ${report.failed} failed. See System/Tests/Results/latest.json.`,10000);
 }
 return report;
};
