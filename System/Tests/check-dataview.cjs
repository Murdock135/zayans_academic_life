// Evaluate the real installed Dataview parser and query engine; host UI imports are inert stubs.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'../..');
function checkHomeResearchQuery(){
const stub=new Proxy(function(){},{get:(target,key)=>key==='prototype'?Object.prototype:stub,apply:()=>stub,construct:()=>({})});
const context={module:{exports:{}},exports:{},require:name=>{if(['obsidian','@codemirror/state','@codemirror/view','@codemirror/language'].includes(name))return stub;throw Error('Unexpected import: '+name)},console,Buffer,setTimeout,clearTimeout,setInterval,clearInterval,TextEncoder,TextDecoder,URL};
context.global=context;context.globalThis=context;
let source=fs.readFileSync(root+'/.obsidian/plugins/dataview/main.js','utf8');
source+='\nmodule.exports.__dqlCheck={parseQuery,Context,Link,executeCoreExtract,DEFAULT_SETTINGS};';
vm.runInNewContext(source,context,{filename:'installed-dataview.js'});
const d=context.module.exports.__dqlCheck;
const home=fs.readFileSync(root+'/Home.md','utf8');const query=[...home.matchAll(/```dataview\n([\s\S]*?)\n```/g)][1][1];
const parsed=d.parseQuery(query);assert(parsed.successful,parsed.error);
const data=[{id:'project-log',data:{type:'research-log',file:{folder:'Work/Project A/Research Log',link:d.Link.file('Work/Project A/Research Log/Entry.md'),mtime:2}}},{id:'paper-log',data:{type:'research-log',file:{folder:'Work/Project A/Papers/Paper One/Research Log',link:d.Link.file('Work/Project A/Papers/Paper One/Research Log/Entry.md'),mtime:3}}}];
const ctx=new d.Context({normalize:p=>p,resolve:()=>null,exists:()=>true},d.DEFAULT_SETTINGS);
const fields=Object.fromEntries(parsed.value.header.fields.map(f=>[f.name,f.field]));
const result=d.executeCoreExtract(data,ctx,parsed.value.operations,fields);assert(result.successful,result.error);
const rows=result.value.data;assert.equal(rows.length,2);
assert.equal(rows[0].data.Project.display,'Project A');assert.equal(rows[0].data.Paper.display,'Paper One');
assert.equal(rows[0].data.Project.path,'Work/Project A/Home.md');assert.equal(rows[0].data.Paper.path,'Work/Project A/Papers/Paper One/Home.md');
assert.equal(rows[1].data.Project.display,'Project A');assert.equal(rows[1].data.Paper,'');
// Resolve links as the live index does; verify latest nonempty values and resource fallbacks.
const readingQuery=[...home.matchAll(/```dataview\n([\s\S]*?)\n```/g)][0][1];
const readingParsed=d.parseQuery(readingQuery);assert(readingParsed.successful,readingParsed.error);
const sessions={
 old:{type:'reading-event',logged_at:'2026-10-02T12:30:00-05:00',reading_position:'23',progress_after:10},
 latest:{type:'reading-event',logged_at:'2026-10-14T12:30:00-05:00',reading_position:'26',progress_after:0},
 blank:{type:'reading-event',logged_at:'2026-10-14T13:30:00-05:00',reading_position:'',progress_after:null},
 unrelated:{type:'research-log',logged_at:'2026-10-14T14:30:00-05:00',reading_position:'999',progress_after:100}
};
const readingCtx=new d.Context({normalize:p=>p,resolve:p=>sessions[p]??null,exists:()=>true},d.DEFAULT_SETTINGS);
const readingFields=Object.fromEntries(readingParsed.value.header.fields.map(f=>[f.name,f.field]));
const resources=[
 {id:'linked',data:{kind:'book',status:['reading'],progress:0.676,reading_position:'23',file:{link:d.Link.file('linked'),mtime:2,inlinks:Object.keys(sessions).map(p=>d.Link.file(p))}}},
 {id:'fallback',data:{kind:'book',status:'reading',progress:0.06,reading_position:'12',file:{link:d.Link.file('fallback'),mtime:1,inlinks:[]}}}
];
const readingResult=d.executeCoreExtract(resources,readingCtx,readingParsed.value.operations,readingFields);assert(readingResult.successful,readingResult.error);
const readingRows=readingResult.value.data;assert.equal(readingRows.length,2);
assert.equal(readingRows[0].data['Last position'],'26');assert.match(readingRows[0].data.Progress,/>0%/);
assert.equal(readingRows[1].data['Last position'],'12');assert.match(readingRows[1].data.Progress,/>0\.06%/);
}
module.exports=checkHomeResearchQuery;
if(require.main===module){checkHomeResearchQuery();console.log('Installed Dataview engine: Home research labels and destinations verified.');}
