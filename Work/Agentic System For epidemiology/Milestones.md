
> [!milestones] Roadmap
> 1. [x] Complete the initial design  [completion:: 2026-10-19]
> 2. [x] Refactor & incorporate good software-design principles  [completion:: 2026-10-19]
> 3. [x] Preliminary checks; run system  [completion:: 2026-10-19]
> 4. [ ] Design improvements, batch evals and writing
> 5. [ ] Agent as a judge
> 6. [ ] Ablation
> 7. [ ] Support for multi-turn conversations
> 8. [ ] Publish paper (END)

## Milestone 4-Design improvments, batch evals and writing

### Design 
- [ ] #task Give the planner the ability to do a literature review
- [ ] #task Give the executor two things #next 
	- [ ] #task a skill that describes an execution workflow
	- [x] #task The index.json  [completion:: 2026-10-19]
	- [x] #task image understanding tool  [completion:: 2026-10-26]

### Batch eval
- [ ] #task Extract token-in/token-out info (1 week)

## Milestone 5- Agent as a judge
### Diagnostics
- [ ] #task Stream each worker. hint:
- [ ] #task Track per-agent tool calling statistics in executor
	- [ ] how many tool calls, what were they
	- [ ] How many files generated
	- [ ] How many tokens
- [ ] #task Check for facts, hallucinations, methodological rigor issues.
### Read and plan
- [ ] #task Search a list of things to check for
### Fix

### SPARQ judge



> [!abstract]- Other work
> ### Optional housekeeping
> - [ ] #task Fix DevOps stuff
> 	- [ ] #task fix dockerfile
> 	- [ ] #task fix run scripts
>
> ### Future work
> - [ ] #task Planner supervisor
> 	- [ ] #task Basic plan review loop
> - [ ] #task Executor supervisor
> - [ ] #task Weather calling tool
>
> ### Misc
> - [ ] #task Implement lazy-updating bedrock model list and cross-checking with config files.
> - [ ] #task Add a web search node (tavily + pubmed)

# Archived

- [x] #task Review code  [completion:: 2026-09-30] 🔒 [[2026-09-30]] 🕸️ Milestones > Milestone 1- Batch eval
- [x] #task Merge `feat/loop_batch_eval` with `main`  [completion:: 2026-09-30] 🔒 [[2026-10-07]] 🕸️ Milestones > Milestone 1- Batch eval
- [x] #task Create node `interim_organizer`  [completion:: 2026-10-16] 🔒 [[2026-10-16]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design improvements
	- It should be coupled with the executor node. It should have knowledge of the current step id. If the step is the last step (you can determine this by checking plan length), then move to the next node
- [x] #task Create a type for index.json  [completion:: 2026-10-16] 🔒 [[2026-10-16]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design improvements
- [x] #task Create an `organizer_node`. This should be invoked  [completion:: 2026-10-16] 🔒 [[2026-10-16]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design improvements
	- After each execution step
	- After aggregator is done doing its work
	- It should also have `from_successful` and `from_failed`
- [x] #task Put artifact numbers into the artifact index  [completion:: 2026-10-23] 🔒 [[2026-10-25]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design
- [x] #task Make metadata output better  [completion:: 2026-10-25] 🔒 [[2026-10-25]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design
	- [x] #task Move printing of settings into  [completion:: 2026-10-25]
	- [x] #task Use rich tables  [completion:: 2026-10-25]
	- [x] #task Hide API. use `xxxx` or something  [completion:: 2026-10-25]
- [x] #task Pydantic encoder not serializing Path objects  [completion:: 2026-10-25] 🔒 [[2026-10-25]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design > Fix
- [x] #task Make the aggregator a report-writing node  [completion:: 2026-10-27] 🔒 [[2026-10-27]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design
	- [x] #task Give the aggregator the following tools  [completion:: 2026-10-27]
		- [x] image understanding  [completion:: 2026-10-27]
		- [x] search and list artifacts  [completion:: 2026-10-27]
- [x] Find MCP  [completion:: 2026-10-19] 🔒 [[2026-10-27]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design
	- [ ] Just use deep-agents
- [x] #task The aggregator's report should be appended to the `Messages` key of the state as well.  [completion:: 2026-10-27] 🔒 [[2026-10-27]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design
- [x] #task Use a node to format report (add TOC, list of figures, references, tables), convert to pdf and save it.  [completion:: 2026-10-27] 🔒 [[2026-10-27]] 🕸️ Milestone 4-Design improvments, batch evals and writing > Design
	- Perhaps the layout could be like:
	- ```sh
	  run_dir/
		  report/
			  report.pdf
			  report.md
			  refs.bib (in the future when we had literature search capabilities)
	  ```
