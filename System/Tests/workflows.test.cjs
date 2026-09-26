const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const capture = require('../Scripts/new-research-log.js');
const home = fs.readFileSync(path.join(root, 'Home.md'), 'utf8');
const projectsPage = fs.readFileSync(path.join(root, 'Work/Projects.md'), 'utf8');
const taskBlocks = [...home.matchAll(/```tasks\n([\s\S]*?)\n```/g)].map(match => match[1]);
const nextQuery = taskBlocks.find(block => block.includes('Tasks Next'));
const homeCode = projectsPage.match(/```dataviewjs\n([\s\S]*?)\n```/)[1];
const file = (p, type, status, tasks = []) => ({ path:p, basename:path.posix.basename(p,'.md'), parent:{path:path.posix.dirname(p)}, type,status,file:{path:p,folder:path.posix.dirname(p),tasks} });
function setup({ active='Work/A/Scratch/Idea.md', name='Experiment', projects=[file('Work/A/Project.md','project')], choose, cancel=false }={}) {
 const files=new Map(), writes=[], opens=[], prompts=[], picks=[];
 const app={vault:{getMarkdownFiles:()=>projects,getAbstractFileByPath:p=>files.get(p),createFolder:async p=>files.set(p,{path:p}),create:async(p,content)=>{assert(!files.has(p),'must not overwrite');const f={path:p,content};files.set(p,f);writes.push(f);return f;}},metadataCache:{getFileCache:f=>({frontmatter:{type:f.type}})},workspace:{getActiveFile:()=>active?{path:active}:null,getLeaf:()=>({openFile:async(f,options)=>opens.push({file:f,options})})}};
 const api={inputPrompt:async(title)=>{prompts.push(title);if(cancel)throw Error('Input cancelled by user');return name;},suggester:async(labels,values)=>{picks.push(labels);return choose===null?null:values[choose??0];},date:{now:format=>format.includes('HHmmss')?'2026-09-24 174500-123':'2026-09-24T17:45:00-05:00'}};
 return {app,api,files,writes,opens,prompts,picks,run:()=>capture({app,quickAddApi:api})};
}
test('research: creates a project-owned timestamped entry without a name prompt',async()=>{
 const f=setup();await f.run();assert.equal(f.prompts.length,0);assert.equal(f.picks.length,0);
 assert.equal(f.writes[0].path,'Work/A/Research Log/2026-09-24 174500-123.md');
 assert.match(f.writes[0].content,/type: research-log/);assert.match(f.writes[0].content,/project: "\[\[Work\/A\/Project\]\]"/);
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
function homeResult(pages){let output;vm.runInNewContext(homeCode,{dv:{pages:()=>({array:()=>pages}),array:v=>({array:()=>v==null?[]:Array.isArray(v)?v:[v]}),paragraph:text=>output=text}});return output;}
function matches(output,p){const match=output.match(/path regex matches \/(.*)\//);return !!match&&new RegExp(match[1]).test(p)}
for(const status of [['active'],'active']) test('Home: active '+JSON.stringify(status)+' includes project and nested scratch tasks',()=>{const pages=[file('Work/A/P.md','project',status),file('Work/A/M.md',null,null,[{}]),file('Work/A/Scratch/x.md',null,null,[{}])];const result=homeResult(pages);assert(matches(result,pages[1].path));assert(matches(result,pages[2].path));assert.match(result,/not done\ngroup|not done\npath/);assert.match(result,/limit 12/)});
for(const status of [['paused'],['completed'],['archived'],[],null,['inactive']])test('Home: excludes status '+JSON.stringify(status),()=>{assert.equal(homeResult([file('Work/A/P.md','project',status),file('Work/A/M.md',null,null,[{}])]),'No open tasks from active projects.')});
test('Home: nested inactive project overrides its active parent',()=>{const pages=[file('Work/A/P.md','project',['active']),file('Work/A/Sub/P.md','project',['paused']),file('Work/A/M.md',null,null,[{}]),file('Work/A/Sub/M.md',null,null,[{}])];const r=homeResult(pages);assert(matches(r,pages[2].path));assert(!matches(r,pages[3].path))});
test('Home: regex escaping and folder boundaries cannot leak other tasks',()=>{const pages=[file('Work/A [x]+/P.md','project',['active']),file('Work/A [x]+/M.md',null,null,[{}]),file('Work/A [x]+suffix/M.md',null,null,[{}]),file('Work/Loose.md',null,null,[{}])];const r=homeResult(pages);assert(matches(r,pages[1].path));assert(!matches(r,pages[2].path));assert(!matches(r,pages[3].path))});
test('configuration: workflow dependencies, templates, and script paths exist',()=>{
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const plugins=read('.obsidian/community-plugins.json');for(const id of ['quickadd','dataview','obsidian-tasks-plugin','index-checker'])assert(plugins.includes(id),id);
 assert.equal(read('.obsidian/plugins/dataview/data.json').enableDataviewJs,true);
 assert.equal(read('.obsidian/types.json').types.status,'multitext');
 const choices=read('.obsidian/plugins/quickadd/data.json').choices;
 for(const name of ['New research log','Log reading']){const choice=choices.find(c=>c.name===name);assert(choice?.command,name);if(choice.templatePath)assert(fs.existsSync(path.join(root,choice.templatePath)));for(const command of choice.macro?.commands??[])if(command.path)assert(fs.existsSync(path.join(root,command.path)))}
 assert(fs.existsSync(path.join(root,'Work/Tasks Next.md')));assert(fs.existsSync(path.join(root,'Work/Inbox.md')));
});
