// Run via QuickAdd: Test vault workflows. Fixtures are confined to unique test roots.
module.exports = async ({app, quickAddApi, obsidian}) => {
 const {Component, MarkdownRenderer, Notice, moment} = obsidian;
 const stateKey = '__academicVaultTests';
 if (window[stateKey]?.running) throw new Error('Vault tests are already running.');
 const id = `vault-test-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
 const report = {runId:id,started:new Date().toISOString(),running:true,tests:[],cleanup:[],fixtureRoots:[]};
 window[stateKey] = report;
 const originalLeaf=app.workspace.getMostRecentLeaf();
 const roots={work:`Work/${id}`,items:`Library/Items/${id}`,sessions:`Library/Sessions/${id}`,views:`System/Tests/Fixtures/${id}`};
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
 const regexPath=path=>path.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&');
 function scope(text){return text.replaceAll('^Work\\/Tasks Next\\.md$','^'+regexPath(roots.work+'/Tasks Next.md')+'$').replaceAll('Work/Tasks Next',roots.work+'/Tasks Next').replaceAll('Work/Inbox',roots.work+'/Inbox').replaceAll('"Work"',JSON.stringify(roots.work)).replaceAll('"Library/Items"',JSON.stringify(roots.items)).replaceAll('"Library/Sessions"',JSON.stringify(roots.sessions))}
 async function scopedPage(source){return write(`${roots.views}/${source.split('/').pop()}`,scope(await app.vault.read(get(source))))}
 function blocks(text){return [...text.matchAll(/^```dataview\n([\s\S]*?)^```/gm)].map(m=>m[1])}
 async function query(file,index){const text=await app.vault.read(file);const result=await dv.query(blocks(text)[index],file.path);assert(result.successful,result.error);return result.value}
 async function render(file){const component=new Component();component.load();const el=document.createElement('div');el.className='markdown-preview-view vault-workflow-test';Object.assign(el.style,{position:'fixed',top:'0',left:'0',width:'1000px',height:'800px',opacity:'0',pointerEvents:'none'});document.body.appendChild(el);renders.push({component,el});await MarkdownRenderer.render(app,await app.vault.read(file),el,file.path,component);return el}
 function noErrors(el){assert(!el.querySelector('.dataview-error,.markdown-render-error'),el.textContent);assert(!/Tasks query:|Evaluation Error:|Dataview: Error/.test(el.textContent),el.textContent)}
 function tasksInSection(el,title){const heading=[...el.querySelectorAll('h2')].find(node=>node.textContent.trim()===title);if(!heading)return[];const tasks=[];for(let node=heading.nextElementSibling;node&&node.tagName!=='H2';node=node.nextElementSibling)tasks.push(...node.querySelectorAll('.task-list-item'));return tasks}
 const tasksIn=el=>tasksInSection(el,'Active project tasks');
 const nextTasksIn=el=>tasksInSection(el,'Next tasks');
 async function runResearch(){await quickAddApi.executeChoice('New research log');return app.workspace.getActiveFile()}
 try {
  assert(dv,'Dataview is not enabled');assert(app.plugins.plugins['obsidian-tasks-plugin'],'Tasks is not enabled');
  assert(!document.querySelector('.modal-container'),'Close existing dialogs before running tests.');
  for(const file of app.vault.getMarkdownFiles())productionBefore.set(file.path,await app.vault.read(file));
  for(const root of Object.values(roots)){assert(!get(root),'Test root collision');await folder(root);owned.push(root)}
  report.fixtureRoots=[...owned];
  leaf=app.workspace.getLeaf('tab');
  const tasksNext=await write(`${roots.work}/Tasks Next.md`,'# Tasks Next\n\n## Standalone tasks\n\n- [ ] GLOBAL_TASK\n- [ ] GLOBAL_REMAINS\n- [x] GLOBAL_COMPLETED\n');await indexed(tasksNext,p=>p.file.tasks.length===3);
  const inbox=await write(`${roots.work}/Inbox.md`,'# Inbox\n\n## Unprocessed\n\n- [ ] INBOX_TASK\n');await indexed(inbox);
  const similar=await write(`${roots.work}/Tasks Next Archive.md`,'# Similar name\n\n- [ ] SIMILAR_NAME_TASK\n');await indexed(similar);
  const inboxBefore=await app.vault.read(inbox);

  const projectFolder=`${roots.work}/Active (test)+`;
  await copyFolder(get('System/Templates/Project Blueprint'),projectFolder);
  const project=get(`${projectFolder}/Home.md`);await indexed(project);
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
  await copyFolder(get('System/Templates/Project Blueprint'),pausedFolder);await indexed(get(`${pausedFolder}/Home.md`));await set(get(`${pausedFolder}/Home.md`),{status:['paused']});
  await app.vault.modify(get(`${pausedFolder}/Milestones.md`),'# Milestones\n- [ ] PAUSED_TASK\n');await indexed(get(`${pausedFolder}/Milestones.md`),p=>p.file.tasks.some(t=>t.text==='PAUSED_TASK'));
  let entry;
  await test('Research capture: actual QuickAdd macro immediately opens a timestamp-named entry',async()=>{
   await open(scratch);entry=await runResearch();assert(entry.parent.path===`${projectFolder}/Research Log`,'Wrong project: '+entry.path);assert(/^\d{4}-\d{2}-\d{2} \d{6}-\d{3}\.md$/.test(entry.name),'Filename is not only date/time: '+entry.name);
   const p=await indexed(entry);assert(p.type==='research-log','Wrong entry type');assert(app.metadataCache.getFirstLinkpathDest(p.project.path,entry.path)?.path===project.path,'Wrong project link');assert(p.logged_at,'Timestamp missing');assert(leaf.view.getState().source===false,'Entry did not open in Live Preview');
  });
  await test('Research capture: repeated command creates another timestamp-named entry without a name prompt',async()=>{
   await open(project);const before=app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(projectFolder+'/Research Log/')).length;
   const next=await runResearch();assert(app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(projectFolder+'/Research Log/')).length===before+1,'Command did not create exactly one file');assert(/^\d{4}-\d{2}-\d{2} \d{6}-\d{3}(?: \(\d+\))?\.md$/.test(next.name),'Unexpected filename: '+next.name);
  });
  let resource;
  await test('Resource creation: core Insert template creates the intended metadata',async()=>{
   resource=await write(`${roots.items}/Reading resource.md`,'');await open(resource);assert(app.workspace.getActiveFile()?.path===resource.path,'Not on fixture');
   await app.internalPlugins.plugins.templates.instance.insertTemplate(get('System/Templates/Resource.md'));
   await wait(async()=>(await app.vault.read(resource)).includes('status:'),'resource template saved');const p=await indexed(resource);
   assert(p.type===undefined&&p.progress===0&&p.kind==='paper','Resource defaults incorrect or unnecessary type field present');assert(p.status.includes('saved'),'Saved status missing');assert(p.authors.length===0&&p.projects.length===0,'List properties missing');
  });
  assert(resource,'Resource setup failed');await set(resource,{status:['reading'],kind:'book',authors:['Test Author'],progress:25,position:'Page 10'});
  const finished=await write(`${roots.items}/Finished resource.md`,(await app.vault.read(get('System/Templates/Resource.md'))));await indexed(finished);await set(finished,{status:['finished'],finished_on:'2026-09-24',progress:100});
  const stopped=await write(`${roots.items}/Stopped resource.md`,await app.vault.read(get('System/Templates/Resource.md')));await indexed(stopped);await set(stopped,{status:['stopped']});
  const legacy=await write(`${roots.items}/Legacy resource.md`,await app.vault.read(get('System/Templates/Resource.md')));await indexed(legacy);await set(legacy,{status:'reading',kind:'book'});
  const falseMatch=await write(`${roots.items}/Not reading resource.md`,await app.vault.read(get('System/Templates/Resource.md')));await indexed(falseMatch);await set(falseMatch,{status:['notreading']});
  const home=await scopedPage('Home.md'), projects=await scopedPage('Work/Projects.md');
  const base=await write(`${roots.views}/Catalog.base`,(await app.vault.read(get('Library/Catalog.base'))).replaceAll('"Library/Items"',JSON.stringify(roots.items)));
  let catalogRenderId=0;
  async function catalogView(name,expected){
   const page=await write(`${roots.views}/Catalog view ${++catalogRenderId}.md`,`![[${base.path}#${name}]]\n`);
   const el=await render(page);await wait(()=>el.querySelector('.bases-view'),'Bases '+name+' view',20000);
   await wait(()=>el.textContent.includes(expected),'Bases '+name+' rows',20000);noErrors(el);return el;
  }
  await set(resource,{type:'Resource'});await set(legacy,{type:'incorrect-type'});
  const untyped=await write(`${roots.items}/No metadata.md`,'');await indexed(untyped);
  await write(`${roots.items}/Not a resource.txt`,'Attachment fixture');
  await test('Home: currently-reading query includes book resources with list and legacy text statuses only',async()=>{const result=await query(home,0);const paths=result.values.map(row=>row[0].path);assert(paths.length===2&&paths.includes(resource.path)&&paths.includes(legacy.path),'Wrong reading resources: '+JSON.stringify(paths))});
  await test('Bases Finished view: only finished resources appear without a type requirement',async()=>{const el=await catalogView('Finished','Finished resource');assert(!el.textContent.includes('Stopped resource')&&!el.textContent.includes('Reading resource'),'Wrong finished resources')});
  await test('Reading capture: real QuickAdd template creates unique timestamped events',async()=>{
   const plugin=app.plugins.plugins.quickadd;const source=plugin.settings.choices.find(c=>c.name==='Create reading event');assert(source,'Reading-event template choice missing');readingChoice=JSON.parse(JSON.stringify(source));readingChoice.id=id;readingChoice.name=id;readingChoice.command=false;readingChoice.folder.folders=[roots.sessions];readingChoice.openFile=false;plugin.settings.choices.push(readingChoice);
   await quickAddApi.executeChoice(id);await quickAddApi.executeChoice(id);
   const events=app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(roots.sessions+'/'));assert(events.length===2,'Expected two unique events');for(const event of events){const p=await indexed(event);assert(p.type==='reading-event'&&p.logged_at,'Invalid reading event');assert(!/\{\{/.test(await app.vault.read(event)),'Unexpanded reading token');await set(event,{resource:`[[${resource.path.slice(0,-3)}]]`})}
  });
  await test('Home: reading events render with resource links',async()=>{const recent=await query(home,2);assert(recent.values.length===2,'Events missing from Home');const el=await render(home);await wait(()=>el.textContent.includes('Reading resource'),'Home resource link');noErrors(el)});
  await test('Project dashboard: overview links to milestones and both indexes',async()=>{for(const [index,suffix]of [[0,'Milestones.md'],[1,'Scratch/Scratch Index.md'],[2,'Research Log/Research Log Index.md']]){const result=await query(project,index);assert(result.values.some(link=>link.path===`${projectFolder}/${suffix}`),'Missing '+suffix)}const el=await render(project);await wait(()=>el.textContent.includes('Research Log Index'),'Project links rendered');noErrors(el)});
  await test('Research index: new entry appears without manually adding a link',async()=>{assert(entry,'Capture prerequisite failed');const index=get(`${projectFolder}/Research Log/Research Log Index.md`);const result=await query(index,0);assert(result.values.some(row=>row[0].path===entry.path),'Research entry missing');const el=await render(index);await wait(()=>el.textContent.includes(entry.basename),'Research table rendered');noErrors(el)});
  await test('Projects directory: active and paused projects both remain visible',async()=>{const result=await query(projects,0);assert(result.values.length===2,'Projects directory lost a project');const el=await render(projects);await wait(()=>{const table=el.querySelector('.table-view-table');return table&&table.textContent.includes('paused')&&table.textContent.includes('active')},'Project status table');noErrors(el)});
  let homeEl,projectsEl;
  await test('Home and Projects rendering: standalone and active-project tasks stay on their respective dashboards',async()=>{homeEl=await render(home);projectsEl=await render(projects);await wait(()=>tasksIn(projectsEl).some(el=>el.textContent.includes('ACTIVE_TASK'))&&nextTasksIn(homeEl).some(el=>el.textContent.includes('GLOBAL_TASK')),'dashboard task sections');const projectText=tasksIn(projectsEl).map(el=>el.textContent).join('\n'),nextText=nextTasksIn(homeEl).map(el=>el.textContent).join('\n');assert(projectText.includes('SCRATCH_TASK')&&!projectText.includes('PAUSED_TASK')&&!projectText.includes('COMPLETED_TASK'),'Incorrect project filtering: '+projectText);assert(!nextText.includes('GLOBAL_COMPLETED')&&!nextText.includes('INBOX_TASK')&&!nextText.includes('SIMILAR_NAME_TASK'),'Incorrect standalone filtering: '+nextText);assert(!projectText.includes('GLOBAL_TASK')&&!nextText.includes('ACTIVE_TASK'),'Task sections overlap');assert(tasksIn(homeEl).length===0,'Active project tasks remain on Home');noErrors(homeEl);noErrors(projectsEl)});
  await test('Projects interaction: clicking a task updates only its source checkbox',async()=>{assert(projectsEl,'Projects render prerequisite failed');const row=tasksIn(projectsEl).find(el=>el.textContent.includes('ACTIVE_TASK'));assert(row,'Active checkbox absent');const checkbox=row.querySelector('input[type="checkbox"]');assert(checkbox,'Task checkbox not interactive');checkbox.click();await wait(async()=>/\[x\] ACTIVE_TASK/.test(await app.vault.read(milestones)),'source task completion');assert(/\[ \] PAUSED_TASK/.test(await app.vault.read(get(`${pausedFolder}/Milestones.md`))),'Unrelated task changed')});
  await test('Home interaction: clicking Tasks Next updates only its exact source and completion removes it',async()=>{assert(homeEl,'Home render prerequisite failed');const projectBefore=await app.vault.read(milestones),row=nextTasksIn(homeEl).find(el=>el.textContent.includes('GLOBAL_TASK'));assert(row,'Standalone checkbox absent');const checkbox=row.querySelector('input[type="checkbox"]');assert(checkbox,'Standalone checkbox not interactive');checkbox.click();await wait(async()=>/\[x\] GLOBAL_TASK/.test(await app.vault.read(tasksNext)),'standalone source completion');assert(await app.vault.read(inbox)===inboxBefore,'Inbox changed');assert(await app.vault.read(milestones)===projectBefore,'Project task changed');const fresh=await render(home);await wait(()=>nextTasksIn(fresh).some(el=>el.textContent.includes('GLOBAL_REMAINS')),'fresh standalone render');assert(!nextTasksIn(fresh).some(el=>el.textContent.includes('GLOBAL_TASK')),'Completed standalone task remains on Home')});
  await test('Inbox is accessible but never treated as a Home task source',async()=>{const links=[...homeEl.querySelectorAll('a.internal-link')];assert(links.some(link=>(link.dataset.href||'').endsWith('/Tasks Next')),'Tasks Next link missing');const directory=await render(projects);await wait(()=>directory.textContent.includes('Inbox')&&directory.textContent.includes('Tasks Next'),'Work directory capture links');assert(!nextTasksIn(homeEl).some(row=>row.textContent.includes('INBOX_TASK')),'Inbox task leaked onto Home')});
  await test('Projects interaction: changing project status removes only project tasks',async()=>{await set(project,{status:['archived']});const directory=await render(projects),freshHome=await render(home);await wait(()=>directory.textContent.includes('No open tasks from active projects.')&&nextTasksIn(freshHome).some(row=>row.textContent.includes('GLOBAL_REMAINS')),'status-independent standalone task');assert(tasksIn(directory).length===0,'Archived tasks remain visible');noErrors(directory);noErrors(freshHome);await set(project,{status:['active']})});
  await test('Bases All view: missing, capitalized, and incorrect type values cannot hide items',async()=>{
   const el=await catalogView('All','No metadata');
   for(const name of ['Reading resource','Legacy resource','Finished resource','Stopped resource'])assert(el.textContent.includes(name),'Catalog missing '+name);
   assert(!el.textContent.includes('Not a resource.txt'),'Catalog includes a non-Markdown attachment');
  });
  await test('Bases Reading view: exact list/text status matching and no type dependency',async()=>{
   const el=await catalogView('Reading','Reading resource');assert(el.textContent.includes('Legacy resource'),'Legacy text status omitted');
   for(const name of ['Finished resource','Stopped resource','Not reading resource','No metadata'])assert(!el.textContent.includes(name),'Reading view includes '+name);
  });
  await test('Index Checker: detects an unlinked scratchpad, then clears after linking',async()=>{
   const plugin=app.plugins.plugins['index-checker'];assert(plugin,'Index Checker missing');const scan=async()=>{const saved=plugin.indexedFoldersP;try{plugin.indexedFoldersP=[];plugin.processFolder(get(projectFolder));return await Promise.all(plugin.indexedFoldersP)}finally{plugin.indexedFoldersP=saved}};
   let results=await scan();assert(results.length===1&&results[0].index.name==='Scratch Index.md','Automatic research index incorrectly checked');assert(results[0].missingChildren.some(f=>f.path===scratch.path),'Missing scratch link not detected');
   const index=get(`${projectFolder}/Scratch/Scratch Index.md`);await app.vault.append(index,`\n[[${scratch.path.slice(0,-3)}]]\n`);await wait(()=>Object.keys(app.metadataCache.resolvedLinks[index.path]||{}).includes(scratch.path),'scratch link indexed');results=await scan();assert(results[0].missingChildren.length===0,'Linked scratchpad still reported missing');
  });
  await test('Resource lifecycle: finishing removes an item from Home, preserves sessions, and rereading restores it',async()=>{
   await set(resource,{status:['finished']});
   let reading=await query(home,0),done=await catalogView('Finished','Reading resource'),events=app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(roots.sessions+'/'));
   assert(!reading.values.some(row=>row[0].path===resource.path),'Finished resource remains on Home');
   assert(done.textContent.includes('Reading resource'),'Finished resource disappeared from library');
   assert(events.length===2,'Reading sessions were lost');
   await set(resource,{status:['reading']});reading=await query(home,0);
   assert(reading.values.some(row=>row[0].path===resource.path),'Rereading resource did not return to Home');
  });
  await test('Home limit: only five currently-reading resources, newest first',async()=>{
   let newest;const now=Date.now();
   for(let i=0;i<6;i++){const f=await write(`${roots.items}/Limit reading ${i}.md`,'---\nkind: book\nstatus: [reading]\n---\n');const content=await app.vault.read(f);await app.vault.modify(f,content,{mtime:now+(i+1)*1000});await indexed(f);newest=f}
   await wait(async()=>{const r=await query(home,0);return r.values.length===5&&r.values[0][0].path===newest.path},'reading limit and order');
  });
  await test('Home limit: only six recently edited research entries, newest first',async()=>{
   let newest;const now=Date.now();
   for(let i=0;i<7;i++){const f=await write(`${projectFolder}/Research Log/Limit entry ${i}.md`,'---\ntype: research-log\n---\n');const content=await app.vault.read(f);await app.vault.modify(f,content,{mtime:now+(i+1)*1000});await indexed(f);newest=f}
   await wait(async()=>{const r=await query(home,1);return r.values.length===6&&r.values[0][0].path===newest.path},'research limit and order');
  });
  await test('Home limit: six recent reading events; Sessions keeps all events',async()=>{
   let newest;
   for(let i=0;i<6;i++){const f=await write(`${roots.sessions}/Limit reading event ${i}.md`,`---\ntype: reading-event\nlogged_at: "${moment().add(i+1,'minutes').format('YYYY-MM-DDTHH:mm:ssZ')}"\nresource: "[[${resource.path.slice(0,-3)}]]"\n---\n`);await indexed(f);newest=f}
   const recent=await query(home,2),all=app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(roots.sessions+'/'));
   assert(recent.values.length===6&&recent.values[0][0].path===newest.path,'Wrong recent event limit/order');assert(all.length===8,'Session files were lost');
  });
  await test('Home limits: standalone and active-project sections each enforce twelve independently',async()=>{
   await app.vault.append(milestones,'\n'+Array.from({length:15},(_,i)=>`- [ ] LIMIT_TASK_${i}`).join('\n')+'\n');await indexed(milestones,p=>p.file.tasks.some(t=>t.text==='LIMIT_TASK_14'));
   await app.vault.append(tasksNext,'\n'+Array.from({length:15},(_,i)=>`- [ ] NEXT_LIMIT_TASK_${i}`).join('\n')+'\n');await indexed(tasksNext,p=>p.file.tasks.some(t=>t.text==='NEXT_LIMIT_TASK_14'));
   const el=await render(home);await wait(()=>tasksIn(el).length===12&&nextTasksIn(el).length===12,'independent 12-task limits');assert(!tasksIn(el).some(row=>row.textContent.includes('PAUSED_TASK')),'Paused tasks leaked into limited results');assert(!nextTasksIn(el).some(row=>row.textContent.includes('INBOX_TASK')),'Inbox leaked into standalone limit');noErrors(el);
  });
  await test('Every production Dataview query parses and evaluates',async()=>{for(const file of app.vault.getMarkdownFiles().filter(f=>!Object.values(roots).some(root=>f.path.startsWith(root+'/')))){for(const queryText of blocks(await app.vault.cachedRead(file))){const result=await dv.query(queryText,file.path);assert(result.successful,`${file.path}: ${result.error}`)}}});
  await test('Workflow links resolve',async()=>{for(const path of ['Home.md','Work/Projects.md','Work/Tasks Next.md','Work/Inbox.md','System/How To Use.md','System/Vault Map.md','System/Setup/Start Here.md']){const file=get(path);for(const link of app.metadataCache.getFileCache(file)?.links??[])assert(app.metadataCache.getFirstLinkpathDest(link.link,file.path),`${path}: unresolved [[${link.link}]]`)}});
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
