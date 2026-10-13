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
}
module.exports=checkHomeResearchQuery;
if(require.main===module){checkHomeResearchQuery();console.log('Installed Dataview engine: Home research labels and destinations verified.');}
