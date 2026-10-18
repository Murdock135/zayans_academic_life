const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const create = require('../Scripts/new-personal-project.js');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

function setup(name = 'Microbiology Foundations') {
    const files = new Map();
    for (const name of ['Home.md', 'Milestones.md']) {
        const p = `System/Templates/Personal Project Blueprint/${name}`;
        files.set(p, {path:p, content:read(p)});
    }
    const opened = [];
    const app = {
        vault: {
            getAbstractFileByPath: p => files.get(p),
            read: async f => f.content,
            createFolder: async p => { assert(!files.has(p)); files.set(p, {path:p}); },
            create: async (p, content) => { assert(!files.has(p)); const f={path:p,content}; files.set(p,f); return f; }
        },
        workspace: {getLeaf: () => ({openFile: async f => opened.push(f)})}
    };
    return {files, opened, run: () => create({app, quickAddApi:{inputPrompt:async()=>name}})};
}

test('personal creation: actual blueprint, areas, links, and Notes stay outside Work', async () => {
    const f = setup(); await f.run();
    const home=f.files.get('Personal/Microbiology Foundations/Home.md');
    assert.match(home.content, /type: project\nstatus:\n  - active\nareas: \[\]/);
    assert.match(home.content, /# Microbiology Foundations/);
    assert.match(home.content, /\[\[Personal\/Microbiology Foundations\/Milestones\|Milestones\]\]/);
    assert(f.files.has('Personal/Microbiology Foundations/Notes'));
    assert(f.files.has('Personal/Microbiology Foundations/Milestones.md'));
    assert(![...f.files.keys()].some(p=>p.startsWith('Work/')));
    assert.equal(f.opened[0],home);
});

test('personal creation: cancel, missing template, and duplicate never overwrite notes', async () => {
    const canceled=setup(null);await canceled.run();assert.equal(canceled.files.size,2);
    const missing=setup();missing.files.delete('System/Templates/Personal Project Blueprint/Milestones.md');
    await assert.rejects(missing.run(), /template not found/);assert(!missing.files.has('Personal'));
    const duplicate=setup();await duplicate.run();const before=[...duplicate.files.entries()];
    await assert.rejects(duplicate.run(), /already exists/);assert.deepEqual([...duplicate.files.entries()],before);
});

test('personal creation: unsafe names cannot escape Personal or corrupt replacement text', async () => {
    const f=setup('../A $&');await f.run();
    const home=[...f.files.values()].find(f=>f.path.startsWith('Personal/')&&f.path.endsWith('/Home.md'));
    assert.equal(home.path,'Personal/..-A $&/Home.md');assert(home.content.includes('# ../A $&'));
    const invalid=setup('...');await assert.rejects(invalid.run(),/valid filename/);assert(!invalid.files.has('Personal'));
});

const code=read('Personal/Home.md').match(/```dataviewjs\n([\s\S]*?)\n```/)[1];
const page=(p,type,status,tasks=[])=>({type,status,file:{path:p,folder:path.posix.dirname(p),tasks}});
const task=(tags=['#next'], completed=false,status=' ')=>({tags,completed,status});
function dashboard(pages) {
    const outputs=[],headers=[];
    vm.runInNewContext(code,{dv:{pages:source=>{assert.equal(source,'"Personal"');return {array:()=>pages};},
        array:v=>({array:()=>v==null?[]:Array.isArray(v)?v:[v]}),
        fileLink:p=>p,header:(level,label)=>headers.push(label),paragraph:s=>outputs.push(s)}});
    return {text:outputs.join('\n'),headers};
}
const matches=(text,p)=>[...text.matchAll(/path regex matches \/(.*)\//g)].some(m=>new RegExp(m[1]).test(p));

test('personal next actions: active owners, exact tags, unfinished tasks, and Notes',()=>{
    const pages=[page('Personal/A/Home.md','project',['active']),page('Personal/A/Milestones.md',null,null,[task()]),
        page('Personal/A/Notes/Idea.md',null,null,[task()]),page('Personal/A/Done.md',null,null,[task(['#next'],true)]),
        page('Personal/A/Cancelled.md',null,null,[task(['#next'],false,'-')]),page('Personal/A/Later.md',null,null,[task(['#next/later'])]),
        page('Personal/Inbox.md',null,null,[task()]),page('Personal/Routines/Weekly.md',null,null,[task()])];
    const r=dashboard(pages);assert(matches(r.text,pages[1].file.path));assert(matches(r.text,pages[2].file.path));
    for(const p of pages.slice(3))assert(!matches(r.text,p.file.path),p.file.path);
    assert.match(r.text,/tags regex matches \/\^#next\$\//);assert.match(r.text,/status.type is not CANCELLED/);
    assert.doesNotMatch(r.text,/limit /);
    pages[0].status='paused';assert.equal(dashboard(pages).headers.length,0);
    pages[0].status='active';assert.equal(dashboard(pages).headers.length,1);
});

test('personal next actions: nearest project owns tasks, with exact folder boundaries and escaped regex',()=>{
    const pages=[page('Personal/A [x]+/Home.md','project',['active']),page('Personal/A [x]+/Milestones.md',null,null,[task()]),
        page('Personal/A [x]+/Child/Home.md','project',['paused']),page('Personal/A [x]+/Child/Milestones.md',null,null,[task()]),
        page('Personal/A [x]+suffix/Note.md',null,null,[task()])];
    const r=dashboard(pages);assert(matches(r.text,pages[1].file.path));
    assert(!matches(r.text,pages[3].file.path));assert(!matches(r.text,pages[4].file.path));
});

test('personal integration wiring: command, template files, navigation, and shared callout',()=>{
    const choices=JSON.parse(read('.obsidian/plugins/quickadd/data.json')).choices;
    const command=choices.find(c=>c.name==='New personal project');assert(command.command);
    assert.equal(command.macro.commands[0].path,'System/Scripts/new-personal-project.js');
    assert(read('Home.md').includes('[[Personal/Home|Personal]]'));
    assert(read('Work/Tasks Next.md').includes('> [!abstract]- Personal projects\n> ![[Personal/Home#Next actions]]'));
});
