const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const capture = require('../Scripts/new-research-log.js');
const newProject = require('../Scripts/new-project.js');
const newPaper = require('../Scripts/new-paper.js');
const home = fs.readFileSync(path.join(root, 'Home.md'), 'utf8');
const projectsPage = fs.readFileSync(path.join(root, 'Work/Projects.md'), 'utf8');
const taskBlocks = [...home.matchAll(/```tasks\n([\s\S]*?)\n```/g)].map(match => match[1]);
const nextQuery = taskBlocks.find(block => block.includes('Tasks Next'));
const homeCode = projectsPage.match(/```dataviewjs\n([\s\S]*?)\n```/)[1];
const file = (p, type, status, tasks = []) => ({ path:p, basename:path.posix.basename(p,'.md'), parent:{path:path.posix.dirname(p)}, type,status,file:{path:p,folder:path.posix.dirname(p),tasks} });
function setup({ active='Work/A/Scratch/Idea.md', name='Experiment', projects=[file('Work/A/Home.md','project')], choose, cancel=false }={}) {
 const files=new Map(), writes=[], opens=[], prompts=[], picks=[];
 const app={vault:{getMarkdownFiles:()=>projects,getAbstractFileByPath:p=>files.get(p),createFolder:async p=>files.set(p,{path:p}),create:async(p,content)=>{assert(!files.has(p),'must not overwrite');const f={path:p,content};files.set(p,f);writes.push(f);return f;}},metadataCache:{getFileCache:f=>({frontmatter:{type:f.type}})},workspace:{getActiveFile:()=>active?{path:active}:null,getLeaf:()=>({openFile:async(f,options)=>opens.push({file:f,options})})}};
 const api={inputPrompt:async(title)=>{prompts.push(title);if(cancel)throw Error('Input cancelled by user');return name;},suggester:async(labels,values)=>{picks.push(labels);return choose===null?null:values[choose??0];},date:{now:format=>format.includes('HHmmss')?'2026-09-24 174500-123':'2026-09-24T17:45:00-05:00'}};
 return {app,api,files,writes,opens,prompts,picks,run:()=>capture({app,quickAddApi:api})};
}
test('research: creates a project-owned timestamped entry without a name prompt',async()=>{
 const f=setup();await f.run();assert.equal(f.prompts.length,0);assert.equal(f.picks.length,0);
 assert.equal(f.writes[0].path,'Work/A/Research Log/2026-09-24 174500-123.md');
 assert.match(f.writes[0].content,/type: research-log/);assert.match(f.writes[0].content,/project: "\[\[Work\/A\/Home\]\]"/);
 assert.match(f.writes[0].content,/logged_at: "2026-09-24T17:45:00-05:00"/);
 assert.equal(f.writes[0].content.split('---')[2].trim(),'');assert.equal(f.opens[0].options.state.source,false);
});
test('research: nearest nested project owns the entry',async()=>{const f=setup({active:'Work/A/Sub/Scratch/n.md',projects:[file('Work/A/P.md','project'),file('Work/A/Sub/P.md','project')]});await f.run();assert.match(f.writes[0].path,/^Work\/A\/Sub\/Research Log\//)});
test('research: neighboring folder prefixes are not treated as the same project',async()=>{const f=setup({active:'Work/AB/n.md',projects:[file('Work/A/P.md','project'),file('Work/AB/P.md','project')]});await f.run();assert.match(f.writes[0].path,/^Work\/AB\/Research Log\//)});
test('research: no project context offers a project picker when necessary',async()=>{const f=setup({active:'Home.md',projects:[file('Work/A/P.md','project'),file('Work/B/P.md','project')],choose:1});await f.run();assert.equal(f.picks.length,1);assert.match(f.writes[0].path,/^Work\/B\//)});
test('research: sole project needs no project picker',async()=>{const f=setup({active:'Home.md'});await f.run();assert.equal(f.picks.length,0)});
test('research: cancelling project selection creates nothing',async()=>{const f=setup({active:'Home.md',projects:[file('Work/A/P.md','project'),file('Work/B/P.md','project')],choose:null});await f.run();assert.equal(f.files.size,0);assert.equal(f.prompts.length,0)});
test('research: missing project fails before prompting or writing',async()=>{const f=setup({projects:[]});await assert.rejects(f.run(),/Create a project/);assert.equal(f.prompts.length,0);assert.equal(f.files.size,0)});
function nextVisible(tasks){
 const match=nextQuery.match(/path regex matches \/(.*)\//);
 const source=new RegExp(match[1]);
 return tasks.filter(task=>!task.done&&source.test(task.path)).slice(0,12);
}
test('Home next tasks: query uses the exact Tasks Next path and its own grouped 12-item limit',()=>{
 assert.match(nextQuery,/^not done$/m);assert.match(nextQuery,/path regex matches \/\^Work\\\/Tasks Next\\\.md\$\//);assert.match(nextQuery,/^limit 12$/m);
 assert.deepEqual(nextVisible([{path:'Work/Tasks Next.md',done:false,text:'include'},{path:'Work/Tasks Next Archive.md',done:false,text:'exclude'}]).map(task=>task.text),['include']);
});
test('Home next tasks: includes incomplete and excludes completed items',()=>{assert.deepEqual(nextVisible([{path:'Work/Tasks Next.md',done:false,text:'open'},{path:'Work/Tasks Next.md',done:true,text:'done'}]).map(task=>task.text),['open'])});
test('Home next tasks: Inbox checkboxes do not leak into Home',()=>{assert.equal(nextVisible([{path:'Work/Inbox.md',done:false,text:'capture'}]).length,0)});
test('Home next tasks: global tasks remain visible with no active project',()=>{assert.equal(homeResult([]),'No open tasks from active projects.');assert.equal(nextVisible([{path:'Work/Tasks Next.md',done:false,text:'standalone'}]).length,1)});
test('research: duplicate names/timestamps preserve the earlier entry',async()=>{const f=setup();await f.run();const first=f.writes[0];await f.run();assert.equal(f.writes.length,2);assert.equal(f.files.get(first.path),first);assert.match(f.writes[1].path,/ \(2\)\.md$/)});
test('research: failed writes do not open a nonexistent note',async()=>{const f=setup();f.app.vault.create=async()=>{throw Error('Disk unavailable')};await assert.rejects(f.run(),/Disk unavailable/);assert.equal(f.opens.length,0)});
test('project: unsafe path characters are replaced without changing ordinary names',()=>{
 assert.equal(newProject.safeFolderName('Agentic Epidemiology'),'Agentic Epidemiology');
 assert.equal(newProject.safeFolderName('A/B: C?'),'A-B- C-');
 assert.equal(newProject.safeFolderName('CON'),'CON-project');
});
function homeResult(pages){const output=[];vm.runInNewContext(homeCode,{dv:{pages:()=>({array:()=>pages}),array:v=>({array:()=>v==null?[]:Array.isArray(v)?v:[v]}),fileLink:(path,embed,label)=>({path,embed,label}),header:()=>{},el:()=>{},paragraph:text=>output.push(text)},Map});return output.join('\n');}
function matches(output,p){return [...output.matchAll(/path regex matches \/(.*)\//g)].some(match=>new RegExp(match[1]).test(p))}
for(const status of [['active'],'active']) test('Home: active '+JSON.stringify(status)+' includes project and nested scratch tasks',()=>{const pages=[file('Work/A/P.md','project',status),file('Work/A/M.md',null,null,[{}]),file('Work/A/Scratch/x.md',null,null,[{}])];const result=homeResult(pages);assert(matches(result,pages[1].path));assert(matches(result,pages[2].path));assert.match(result,/not done\ngroup|not done\npath/);assert.doesNotMatch(result,/limit /)});
for(const status of [['paused'],['completed'],['archived'],[],null,['inactive']])test('Home: excludes status '+JSON.stringify(status),()=>{assert.equal(homeResult([file('Work/A/P.md','project',status),file('Work/A/M.md',null,null,[{}])]),'No open tasks from active projects.')});
test('Home: nested inactive project overrides its active parent',()=>{const pages=[file('Work/A/P.md','project',['active']),file('Work/A/Sub/P.md','project',['paused']),file('Work/A/M.md',null,null,[{}]),file('Work/A/Sub/M.md',null,null,[{}])];const r=homeResult(pages);assert(matches(r,pages[2].path));assert(!matches(r,pages[3].path))});
test('Home: regex escaping and folder boundaries cannot leak other tasks',()=>{const pages=[file('Work/A [x]+/P.md','project',['active']),file('Work/A [x]+/M.md',null,null,[{}]),file('Work/A [x]+suffix/M.md',null,null,[{}]),file('Work/Loose.md',null,null,[{}])];const r=homeResult(pages);assert(matches(r,pages[1].path));assert(!matches(r,pages[2].path));assert(!matches(r,pages[3].path))});
test('configuration: workflow dependencies, templates, and script paths exist',()=>{
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const plugins=read('.obsidian/community-plugins.json');for(const id of ['quickadd','dataview','obsidian-tasks-plugin','index-checker'])assert(plugins.includes(id),id);
 assert.equal(read('.obsidian/plugins/dataview/data.json').enableDataviewJs,true);
 assert.equal(read('.obsidian/types.json').types.status,'multitext');
 const choices=read('.obsidian/plugins/quickadd/data.json').choices;
 for(const name of ['New project','New paper','New research log','Log reading']){const choice=choices.find(c=>c.name===name);assert(choice?.command,name);if(choice.templatePath)assert(fs.existsSync(path.join(root,choice.templatePath)));for(const command of choice.macro?.commands??[])if(command.path)assert(fs.existsSync(path.join(root,command.path)))}
 assert(fs.existsSync(path.join(root,'Work/Tasks Next.md')));assert(fs.existsSync(path.join(root,'Work/Inbox.md')));
});

test('Projects next tasks: includes tagged task beyond the ordinary limit, excludes completed and untagged tasks',()=>{
 const code=[...projectsPage.matchAll(/```dataviewjs\n([\s\S]*?)\n```/g)][1][1];
 const outputs=[];
 const pages=[file('Work/A/Home.md','project',['active']),file('Work/A/Milestones.md',null,null,[...Array.from({length:12},()=>({completed:false,tags:[]})),{completed:false,tags:['#next']}]),file('Work/A/Done.md',null,null,[{completed:true,tags:['#next']}]),file('Work/A/Other.md',null,null,[{completed:false,tags:['#next/later']}])];
 vm.runInNewContext(code,{dv:{pages:()=>({array:()=>pages}),array:v=>({array:()=>v??[]}),fileLink:()=>'',header:()=>{},el:()=>{},paragraph:s=>outputs.push(s)},Map});
 const result=outputs.join('\n');
 assert(matches(result,'Work/A/Milestones.md'));assert(!matches(result,'Work/A/Done.md'));assert(!matches(result,'Work/A/Other.md'));
 assert.match(result,/tags regex matches \/\^#next\$\//);assert.doesNotMatch(result,/limit /);
});


const paperPages = () => [file('Work/A/Home.md','project',['active']), file('Work/A/Papers/P1/Home.md','paper',['active'])];
test('research: a paper scratchpad saves in that paper and links to both owners',async()=>{
 const f=setup({active:'Work/A/Papers/P1/Scratch/Idea.md',projects:paperPages()});await f.run();
 assert.match(f.writes[0].path,/^Work\/A\/Papers\/P1\/Research Log\//);
 assert.match(f.writes[0].content,/project: "\[\[Work\/A\/Home\]\]"/);
 assert.match(f.writes[0].content,/paper: "\[\[Work\/A\/Papers\/P1\/Home\]\]"/);
 assert.equal(f.picks.length,0);
});
test('research: project notes stay at project level even when it has papers',async()=>{
 const f=setup({projects:paperPages()});await f.run();assert.match(f.writes[0].path,/^Work\/A\/Research Log\//);assert.doesNotMatch(f.writes[0].content,/^paper:/m);
});
test('research: Home offers projects and papers, even with just one project',async()=>{
 const f=setup({active:'Home.md',projects:paperPages(),choose:0});await f.run();
 assert.equal(f.picks.length,1);assert(f.picks[0].some(label=>label==='Paper: Work/A/Papers/P1'));assert(f.picks[0].some(label=>label==='Project: Work/A'));
 assert.match(f.writes[0].path,/^Work\/A\/Papers\/P1\/Research Log\//);
});
test('research: cancelling the destination picker writes nothing with papers present',async()=>{
 const f=setup({active:'Home.md',projects:paperPages(),choose:null});await f.run();assert.equal(f.writes.length,0);assert.equal(f.files.size,0);
});
test('research: a similarly named paper folder cannot capture its neighbor',async()=>{
 const f=setup({active:'Work/A/Papers/P10/Scratch/Idea.md',projects:[...paperPages(),file('Work/A/Papers/P10/Home.md','paper')]});await f.run();assert.match(f.writes[0].path,/^Work\/A\/Papers\/P10\/Research Log\//);
});
function dashboard(pages,index=0){const outputs=[],headers=[];const code=[...projectsPage.matchAll(/```dataviewjs\n([\s\S]*?)\n```/g)][index][1];vm.runInNewContext(code,{dv:{pages:()=>({array:()=>pages}),array:v=>({array:()=>v==null?[]:Array.isArray(v)?v:[v]}),fileLink:(p,e,label)=>label,header:(level,text)=>headers.push([level,text]),el:()=>{},paragraph:s=>outputs.push(s)},Map});return {text:outputs.join('\n'),headers};}
for(const index of [0,1])test(`paper tasks: dashboard ${index} requires active project and paper, with owner headings`,()=>{
 const pages=[...paperPages(),file('Work/A/Papers/P2/Home.md','paper',['paused']),file('Work/A/Papers/P1/Milestones.md',null,null,[{tags:['#next']}]),file('Work/A/Papers/P2/Milestones.md',null,null,[{tags:['#next']}]),file('Work/A/Milestones.md',null,null,[{tags:['#next']}])];
 const r=dashboard(pages,index);assert(matches(r.text,pages[3].path));assert(!matches(r.text,pages[4].path));assert(matches(r.text,pages[5].path));assert(r.headers.some(([level,text])=>level===4&&text==='P1'));
 pages[0].status=['paused'];const paused=dashboard(pages,index);assert(!matches(paused.text,pages[3].path));assert(!matches(paused.text,pages[5].path));
});
test('paper tasks: ordinary and next dashboards include all papers without a shared limit',()=>{
 const pages=[...paperPages(),file('Work/A/Papers/P2/Home.md','paper',['active']),file('Work/A/Papers/P1/Milestones.md',null,null,Array.from({length:8},()=>({tags:['#next']}))),file('Work/A/Papers/P2/Milestones.md',null,null,Array.from({length:8},()=>({tags:['#next']})))];
 const ordinary=dashboard(pages).text;assert(matches(ordinary,pages[3].path));assert(matches(ordinary,pages[4].path));assert.doesNotMatch(ordinary,/limit /);
 const next=dashboard(pages,1).text;assert(matches(next,pages[3].path));assert(matches(next,pages[4].path));assert.doesNotMatch(next,/limit /);
});
test('Projects: a first project with more than 12 tasks cannot hide the second project',()=>{
 const pages=[file('Work/A/Home.md','project',['active']),file('Work/A/Milestones.md',null,null,Array.from({length:14},()=>({}))),file('Work/B/Home.md','project',['active']),file('Work/B/Milestones.md',null,null,[{}])];
 const result=dashboard(pages);assert(matches(result.text,pages[1].path));assert(matches(result.text,pages[3].path));assert.deepEqual(result.headers.filter(([level])=>level===3).map(([,text])=>text),['1. A','2. B']);
});
for(const index of [0,1])test(`Projects: dashboard ${index} renders each project once with shared and paper sections`,()=>{
 const pages=[file('Work/A/Home.md','project',['active']),file('Work/A/Papers/P1/Home.md','paper',['active']),file('Work/A/Papers/P1/Milestones.md',null,null,[{tags:['#next']}]),file('Work/B/Home.md','project',['active']),file('Work/B/Milestones.md',null,null,[{tags:['#next']}]),file('Work/A/Milestones.md',null,null,[{tags:['#next']}])];
 const result=dashboard(pages,index);assert.deepEqual(result.headers.filter(([level])=>level===3),[[3,'1. A'],[3,'2. B']]);assert.deepEqual(result.headers,[[3,'1. A'],[4,'P1'],[3,'2. B']]);
 for(const page of [pages[2],pages[4],pages[5]])assert(matches(result.text,page.path));
});
function paperSetup(options={}){
 const f=setup(options);
 function loadFolder(relative){const absolute=path.join(root,relative);const folder={path:relative,name:path.posix.basename(relative),children:[]};f.files.set(relative,folder);for(const entry of fs.readdirSync(absolute,{withFileTypes:true})){const p=relative+'/'+entry.name;if(entry.isDirectory())folder.children.push(loadFolder(p));else{const child={path:p,name:entry.name,extension:path.posix.extname(p).slice(1),content:fs.readFileSync(path.join(root,p))};folder.children.push(child);f.files.set(p,child)}}return folder;}
 loadFolder('System/Templates/Paper Blueprint');
 f.app.vault.read=async file=>file.content.toString();f.app.vault.readBinary=async file=>file.content;
 f.app.vault.createBinary=f.app.vault.create;f.runPaper=()=>newPaper({app:f.app,quickAddApi:f.api});return f;
}
test('paper creation: copies actual blueprint, names Home, links parent and opens Live Preview',async()=>{
 const f=paperSetup({name:'Paper $&'});await f.runPaper();const prefix='Work/A/Papers/Paper $&/';
 for(const suffix of ['Home.md','Milestones.md','Research Log/Research Log Index.md','Scratch/00 Scratch Index.md','Attachments/.gitkeep','Scratch/Attachments/.gitkeep'])assert(f.files.has(prefix+suffix),suffix);
 const content=f.files.get(prefix+'Home.md').content;assert.match(content,/# Paper \$&\n/);assert.match(content,/project: "\[\[Work\/A\/Home\]\]"/);assert.match(content,/Parent project: \[\[Work\/A\/Home\|A\]\]/);assert.doesNotMatch(content,/PARENT_PROJECT_LINK/);
 assert.equal(f.opens[0].file.path,prefix+'Home.md');assert.equal(f.opens[0].options.state.source,false);
});
test('paper creation: naming a sibling from inside a paper uses its parent project',async()=>{
 const f=paperSetup({active:'Work/A/Papers/P1/Scratch/Idea.md',projects:paperPages(),name:'Sibling'});await f.runPaper();assert(f.files.has('Work/A/Papers/Sibling/Home.md'));
});
test('paper creation: choosing a project outside Work routes to that project',async()=>{
 const f=paperSetup({active:'Home.md',projects:[file('Work/A/Home.md','project'),file('Work/B/Home.md','project')],choose:1});await f.runPaper();assert(f.files.has('Work/B/Papers/Experiment/Home.md'));
});
test('paper creation: duplicate folder is rejected without altering earlier notes',async()=>{
 const f=paperSetup();await f.runPaper();const first=f.writes.length;await assert.rejects(f.runPaper(),/already exists/);assert.equal(f.writes.length,first);
});
for(const name of [null,'','   ','...'])test('paper creation: empty or invalid name '+JSON.stringify(name)+' creates no files',async()=>{
 const f=paperSetup({name});if(name==='...')await assert.rejects(f.runPaper(),/valid filename/);else await f.runPaper();assert.equal(f.writes.length,0);assert(!f.files.has('Work/A/Papers'));
});
test('paper creation: cancellation and missing blueprint/project never write a partial paper',async()=>{
 const canceled=paperSetup({active:'Home.md',projects:[file('Work/A/Home.md','project'),file('Work/B/Home.md','project')],choose:null});await canceled.runPaper();assert.equal(canceled.writes.length,0);
 const missing=paperSetup();missing.files.delete('System/Templates/Paper Blueprint');await assert.rejects(missing.runPaper(),/blueprint not found/);assert.equal(missing.writes.length,0);assert(!missing.files.has('Work/A/Papers'));
 const noProject=paperSetup({projects:[]});await assert.rejects(noProject.runPaper(),/Create a project/);assert.equal(noProject.prompts.length,0);
});
test('configuration: QuickAdd identifiers and command names are unique',()=>{
 const choices=JSON.parse(fs.readFileSync(path.join(root,'.obsidian/plugins/quickadd/data.json'),'utf8')).choices;
 assert.equal(new Set(choices.map(c=>c.id)).size,choices.length);assert.equal(new Set(choices.map(c=>c.name)).size,choices.length);
});

test('Home: installed Dataview engine resolves research owners and latest reading-session progress',()=>require('./check-dataview.cjs')());
